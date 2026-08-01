import { Hono } from 'hono';

// [PERBAIKAN] Sesuaikan tipe ini dengan Log Wrangler Anda (MY_BUCKET)
type Bindings = {
  DB: D1Database;
  MY_BUCKET: R2Bucket; // <--- Ubah jadi Wajib sesuai log
  // Fallback types (Opsional)
  MEDIA_BUCKET?: R2Bucket;
  BUCKET?: R2Bucket;
  R2?: R2Bucket;
};

const mediaRouter = new Hono<{ Bindings: Bindings }>();

// Helper untuk mencari Binding R2 yang aktif (Prioritas ke MY_BUCKET)
const getBucket = (c: any) => {
    return c.env.MY_BUCKET || c.env.MEDIA_BUCKET || c.env.BUCKET || c.env.R2;
};

// 1. ENDPOINT SETUP (RESET & SYNC)
mediaRouter.get('/setup', async (c) => {
    try {
        // Cek DB
        if (!c.env.DB) {
             const keys = Object.keys(c.env).join(', ');
             throw new Error(`DB Error! Binding 'DB' hilang. Yang ada: [${keys}]`);
        }

        // Cek R2
        const r2 = getBucket(c);
        if (!r2) {
             const keys = Object.keys(c.env).join(', ');
             throw new Error(`R2 Error! Binding 'MY_BUCKET' tidak ditemukan. Yang ada: [${keys}]`);
        }

        // --- MULAI RESET ---
        await c.env.DB.prepare('DROP TABLE IF EXISTS media_meta').run();

        // Buat Tabel dengan kolom lengkap
        await c.env.DB.prepare(`
            CREATE TABLE media_meta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT NOT NULL,
                url TEXT NOT NULL,
                type TEXT,
                size INTEGER,
                alt TEXT,
                title TEXT,
                description TEXT,
                caption TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        // Sync Data
        const listed = await r2.list();
        let count = 0;
        let skipped = 0;
        
        for (const obj of listed.objects) {
            // [FIX PENTING] Lewati folder (yang berakhiran /) agar tidak jadi gambar hitam
            if (obj.key.endsWith('/')) {
                skipped++;
                continue;
            }

            const url = `/api/media/file/${obj.key}`;
            
            // Tebak Tipe File
            let type = 'application/octet-stream';
            if (obj.key.match(/\.(jpg|jpeg)$/i)) type = 'image/jpeg';
            else if (obj.key.match(/\.png$/i)) type = 'image/png';
            else if (obj.key.match(/\.webp$/i)) type = 'image/webp';
            else if (obj.key.match(/\.svg$/i)) type = 'image/svg+xml';

            await c.env.DB.prepare(`
                INSERT INTO media_meta (key, url, type, size, created_at) 
                VALUES (?, ?, ?, ?, datetime('now'))
            `).bind(obj.key, url, type, obj.size).run();
            count++;
        }

        return c.json({ success: true, message: `BERHASIL! ${count} file dipulihkan. (${skipped} folder dibuang)` });

    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 2. GET LIST
mediaRouter.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare('SELECT * FROM media_meta ORDER BY created_at DESC').all();
        return c.json(results || []);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 3. UPLOAD
mediaRouter.post('/', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];
        if (!file || !(file instanceof File)) return c.json({ error: 'File wajib ada' }, 400);

        const r2 = getBucket(c);
        if (!r2) return c.json({ error: 'R2 Putus (Cek MY_BUCKET)' }, 500);

        const date = new Date();
        const folder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
        // Bersihkan nama file
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
        const key = `${folder}/${Date.now()}-${cleanName}`;

        await r2.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

        const url = `/api/media/file/${key}`;
        await c.env.DB.prepare(
            'INSERT INTO media_meta (key, url, type, size, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
        ).bind(key, url, file.type, file.size).run();

        return c.json({ success: true, url });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 4. UPDATE / EDIT METADATA
mediaRouter.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        
        await c.env.DB.prepare(`
            UPDATE media_meta 
            SET alt = ?, title = ?, description = ?, caption = ?
            WHERE id = ?
        `).bind(
            body.alt || '', 
            body.title || '', 
            body.description || '', 
            body.caption || '', 
            id
        ).run();

        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 5. SERVE FILE
mediaRouter.get('/file/*', async (c) => {
    const key = c.req.path.replace('/api/media/file/', '');
    const r2 = getBucket(c);
    if (!r2) return c.text('R2 Putus', 500);

    const obj = await r2.get(decodeURIComponent(key));
    if (!obj) return c.text('Not found', 404);

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('etag', obj.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');
    
    // [FIX] Paksa Header Gambar jika R2 memberikannya kosong
    const currentType = headers.get('Content-Type');
    if (!currentType || currentType === 'application/octet-stream') {
        if (key.match(/\.(jpg|jpeg)$/i)) headers.set('Content-Type', 'image/jpeg');
        else if (key.match(/\.png$/i)) headers.set('Content-Type', 'image/png');
        else if (key.match(/\.webp$/i)) headers.set('Content-Type', 'image/webp');
    }

    return new Response(obj.body, { headers });
});

// 6. DELETE
mediaRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');
    const r2 = getBucket(c);
    
    // Ambil Key dari DB berdasarkan ID
    const file: any = await c.env.DB.prepare('SELECT key FROM media_meta WHERE id=?').bind(id).first();
    
    if(file && r2) {
        await r2.delete(file.key);
        await c.env.DB.prepare('DELETE FROM media_meta WHERE id=?').bind(id).run();
    }
    return c.json({ success: true });
});

export default mediaRouter;