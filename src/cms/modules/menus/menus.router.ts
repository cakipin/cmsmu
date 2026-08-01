import { Hono } from 'hono';

const menusRouter = new Hono();

// 1. GET ALL MENUS
menusRouter.get('/', async (c) => {
    try {
        // Ambil data menu urut berdasarkan order_num
        const { results } = await c.env.DB.prepare(
            "SELECT * FROM menus ORDER BY order_num ASC"
        ).all();
        
        return c.json({ success: true, data: results || [] });
    } catch (e: any) {
        // Jika tabel belum ada, return kosong (jangan error 500)
        return c.json({ success: true, data: [] });
    }
});

// 2. ADD / CREATE MENU
menusRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const id = crypto.randomUUID();
        
        await c.env.DB.prepare(
            "INSERT INTO menus (id, label, url, order_num) VALUES (?, ?, ?, ?)"
        ).bind(id, body.label, body.url, body.order_num || 0).run();

        return c.json({ success: true, message: 'Menu saved' });
    } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

// 3. DELETE MENU
menusRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.DB.prepare("DELETE FROM menus WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

export default menusRouter;