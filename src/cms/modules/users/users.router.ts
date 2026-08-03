import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
  SSO_CLIENT_ID: string;
  SSO_CLIENT_SECRET: string;
};

const usersRouter = new Hono<{ Bindings: Bindings }>();

// Helper Hashing (Sama seperti sebelumnya)
async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------
// 1. GET ALL USERS
// ---------------------------------------------------------------------
usersRouter.get('/', async (c) => {
    try {
        if (!c.env.DB) return c.json({ error: 'Database Error' }, 500);
        const { results } = await c.env.DB.prepare(
            'SELECT id, username, name, email, role, created_at FROM users ORDER BY created_at DESC'
        ).all();
        return c.json(results);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// ---------------------------------------------------------------------
// 2. CREATE USER (POST /)
// ---------------------------------------------------------------------
usersRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { username, password, email, role, name } = body;

        // Validasi minimal
        if (!username || !password) return c.json({ error: 'Username & Password wajib' }, 400);

        // Hash Password sebelum simpan (Opsional, tapi disarankan)
        // Untuk saat ini kita simpan plain text agar sesuai dengan data lama Anda, 
        // atau gunakan sha256(password) jika ingin mulai secure.
        // const finalPass = await sha256(password); 
        const finalPass = password; 

        const res = await c.env.DB.prepare(
            'INSERT INTO users (username, password, email, role, name, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(username, finalPass, email || '', role || 'editor', name || '', new Date().toISOString()).run();

        if (res.success) {
            return c.json({ success: true, message: 'User berhasil dibuat' });
        } else {
            return c.json({ error: 'Gagal membuat user' }, 500);
        }
    } catch (e: any) {
        return c.json({ error: 'Error: ' + e.message }, 500);
    }
});

// ---------------------------------------------------------------------
// 3. UPDATE USER (PUT /:id) -> Fix Error 404 saat Edit
// ---------------------------------------------------------------------
usersRouter.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { username, email, role, name, password } = body;

        let query = 'UPDATE users SET username=?, email=?, role=?, name=?';
        let params = [username, email, role, name];

        // Jika password diisi, update password juga
        if (password && password.trim() !== '') {
            query += ', password=?';
            params.push(password); // atau sha256(password)
        }

        query += ' WHERE id=?';
        params.push(id);

        const res = await c.env.DB.prepare(query).bind(...params).run();

        if (res.success) {
            return c.json({ success: true });
        } else {
            return c.json({ error: 'Gagal update user' }, 500);
        }
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// ---------------------------------------------------------------------
// 4. DELETE USER (DELETE /:id) -> Fix Error 404 saat Hapus
// ---------------------------------------------------------------------
usersRouter.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const res = await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

        if (res.success) {
            return c.json({ success: true });
        } else {
            return c.json({ error: 'Gagal menghapus user' }, 500);
        }
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// ---------------------------------------------------------------------
// 5. LOGIN (Tetap Dipertahankan)
// ---------------------------------------------------------------------
usersRouter.post('/login', async (c) => {
    try {
        const body = await c.req.json().catch(() => null);
        if (!body) return c.json({ error: 'Data login tidak lengkap' }, 400);

        const { username, password } = body; 
        if (!c.env.DB) return c.json({ error: 'Database tidak terhubung' }, 500);

        const user: any = await c.env.DB.prepare('SELECT id, username, password, role FROM users WHERE username = ?')
            .bind(username).first();

        if (!user) return c.json({ error: 'Username tidak terdaftar' }, 401);

        const inputPassword = String(password);
        const dbPassword = String(user.password);
        
        const isPlainMatch = inputPassword === dbPassword;
        const hashedInput = await sha256(inputPassword);
        const isHashMatch = hashedInput === dbPassword;

        if (!isPlainMatch && !isHashMatch) return c.json({ error: 'Password salah' }, 401);

        const token = btoa(JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role || 'admin',
            iat: Date.now()
        }));

        return c.json({ success: true, token, user: { id: user.id, username: user.username } });

    } catch (e: any) {
        return c.json({ error: 'Gagal Login: ' + e.message }, 500);
    }
});

// ---------------------------------------------------------------------
// 6. SSO LOGIN (MUHAMMADIYAH ID)
// ---------------------------------------------------------------------
usersRouter.post('/sso', async (c) => {
    try {
        const body = await c.req.json().catch(() => null);
        if (!body || !body.code || !body.redirectUri) {
            return c.json({ error: 'Data otorisasi tidak lengkap' }, 400);
        }

        const { code, redirectUri } = body;
        if (!c.env.DB) return c.json({ error: 'Database tidak terhubung' }, 500);

        // Ambil konfigurasi dari table settings di DB (opsional)
        let dbSettings: any = {};
        try {
            const { results } = await c.env.DB.prepare("SELECT key, value FROM settings WHERE key IN ('sso_enabled', 'sso_client_id', 'sso_client_secret')").all();
            if (results) {
                results.forEach((row: any) => { dbSettings[row.key] = row.value; });
            }
        } catch(e) {}
        
        if (dbSettings.sso_enabled === 'false') {
            return c.json({ error: 'SSO sedang dinonaktifkan oleh Administrator.' }, 403);
        }
        
        // Ambil secrets dari env (sebagai fallback utama) atau dari DB
        const CLIENT_ID = dbSettings.sso_client_id || c.env.SSO_CLIENT_ID || c.env.CLIENT_ID; 
        const CLIENT_SECRET = dbSettings.sso_client_secret || c.env.SSO_CLIENT_SECRET || c.env.CLIENT_SECRET;

        if (!CLIENT_ID || !CLIENT_SECRET) {
            return c.json({ error: 'Konfigurasi SSO (Client ID/Secret) belum disetel di server.' }, 500);
        }

        const DIASMU_TOKEN_ENDPOINT = 'https://diasmu.labmu.workers.dev/oauth/token';
        const DIASMU_USERINFO_ENDPOINT = 'https://diasmu.labmu.workers.dev/oauth/userinfo';

        // 1. Tukar Kode dengan Token
        const tokenResponse = await fetch(DIASMU_TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: redirectUri,
                code: code,
            }).toString(),
        });

        if (!tokenResponse.ok) {
            return c.json({ error: 'Gagal mendapatkan token dari Muhammadiyah ID: ' + tokenResponse.statusText }, tokenResponse.status);
        }

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            return c.json({ error: 'Respon token tidak valid.' }, 500);
        }

        // 2. Ambil Info Pengguna
        const userResponse = await fetch(DIASMU_USERINFO_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokenData.access_token
            }
        });

        if (!userResponse.ok) {
            return c.json({ error: 'Gagal mendapatkan profil pengguna: ' + userResponse.statusText }, userResponse.status);
        }

        const userData = await userResponse.json();

        // Cari user berdasarkan email (diutamakan) atau sso_id jika kita menyimpannya
        const email = userData.email || '';
        // Karena schema table users default di cmsMu tidak memiliki sso_id, kita cek berdasarkan email
        // Atau jika tidak ada email, generate username otomatis
        const username = email || (userData.name ? userData.name.toLowerCase().replace(/\\s+/g, '.') : 'user.sso');

        let user: any = await c.env.DB.prepare('SELECT id, username, role FROM users WHERE email = ? OR username = ?')
            .bind(email, username).first();

        // 3. Auto-Register Jika User Tidak Ditemukan
        if (!user) {
            const defaultRole = 'editor';
            const name = userData.name || username;
            
            // Simpan ke DB dengan password dummy yang mustahil diketik (krn kita pake plain di local, kita kasih karakter invalid agar tak bisa dipakai manual)
            const randomPassword = 'SSO_' + crypto.randomUUID();
            
            const res = await c.env.DB.prepare(
                'INSERT INTO users (username, password, email, role, name, created_at) VALUES (?, ?, ?, ?, ?, ?)'
            ).bind(username, randomPassword, email, defaultRole, name, new Date().toISOString()).run();

            if (!res.success) {
                return c.json({ error: 'Gagal melakukan auto-registrasi SSO' }, 500);
            }
            
            // Fetch kembali setelah insert untuk mendapatkan ID
            user = await c.env.DB.prepare('SELECT id, username, role FROM users WHERE username = ?')
                .bind(username).first();
        }

        // 4. Generate JWT Token untuk cmsMu
        const token = btoa(JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role || 'editor',
            iat: Date.now()
        }));

        return c.json({ 
            success: true, 
            token, 
            user: { id: user.id, username: user.username, role: user.role } 
        });

    } catch (e: any) {
        return c.json({ error: 'Terjadi kesalahan sistem saat memproses SSO: ' + e.message }, 500);
    }
});

export default usersRouter;