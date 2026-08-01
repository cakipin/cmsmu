// src/modules/posts/posts.router.ts
import { Hono } from 'hono';

const postsRouter = new Hono<{ Bindings: any }>();

// 1. GET ALL POSTS
postsRouter.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            "SELECT * FROM posts ORDER BY created_at DESC"
        ).all();
        return c.json(results || []);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 2. GET SINGLE POST
postsRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const post = await c.env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
        if (!post) return c.json({ error: 'Post not found' }, 404);
        return c.json(post);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 3. CREATE POST
postsRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const now = new Date().toISOString();

        // Validasi Status
        let status = (body.status || 'draft').toLowerCase();
        if(status.includes('pub')) status = 'publish';

        // FIX: Hapus updated_at dari query jika kolom belum ada di DB
        const { success } = await c.env.DB.prepare(`
            INSERT INTO posts (title, slug, body, status, category, tags, featured_image, author, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            body.title || 'Untitled',
            body.slug,
            body.body || '',
            status,
            body.category || 'Uncategorized',
            body.tags || '',
            body.featured_image || '',
            body.author || 'Admin',
            body.created_at || now
        ).run();

        if (success) {
            return c.json({ success: true, message: 'Post Created' });
        } else {
            return c.json({ error: 'Failed to create post' }, 400);
        }
    } catch (e: any) {
        if (e.message.includes('UNIQUE constraint failed')) {
            return c.json({ error: 'Slug sudah digunakan, ganti judul atau slug.' }, 409);
        }
        return c.json({ error: e.message }, 500);
    }
});

// 4. UPDATE POST (FIX: Hilangkan updated_at agar tidak error)
postsRouter.put('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        
        let status = (body.status || 'draft').toLowerCase();
        if(status.includes('pub')) status = 'publish';

        // FIX: Hapus kolom updated_at dari query UPDATE
        const { success } = await c.env.DB.prepare(`
            UPDATE posts SET 
                title = ?, 
                slug = ?, 
                body = ?, 
                status = ?, 
                category = ?, 
                tags = ?, 
                featured_image = ?
            WHERE id = ?
        `).bind(
            body.title,
            body.slug,
            body.body,
            status,
            body.category || 'Uncategorized',
            body.tags || '',
            body.featured_image,
            id
        ).run();

        if (success) {
            return c.json({ success: true, message: 'Post Updated' });
        } else {
            return c.json({ error: 'Post not found or no changes' }, 404);
        }
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 5. DELETE POST
postsRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');
    
    // SUPPORT BULK DELETE (Dipisahkan koma)
    if (id.includes(',')) {
        const ids = id.split(',');
        // Gunakan batch delete atau loop sederhana (batch lebih aman di D1)
        const stmts = ids.map(i => c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(i));
        await c.env.DB.batch(stmts);
        return c.json({ success: true, message: 'Bulk Deleted' });
    }

    try {
        const { success } = await c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
        
        if (success) {
            return c.json({ success: true, message: 'Deleted' });
        } else {
            return c.json({ success: true, message: 'Deleted (or already gone)' });
        }
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default postsRouter;