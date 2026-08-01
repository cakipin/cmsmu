import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
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

export default usersRouter;