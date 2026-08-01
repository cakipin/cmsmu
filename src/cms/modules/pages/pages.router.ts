import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const pagesRouter = new Hono<{ Bindings: Bindings }>();

// 1. GET ALL (Tabel)
pagesRouter.get('/', async (c) => {
  try {
    // [UPDATE] Ambil featured_image juga jika nanti mau ditampilkan di tabel
    const { results } = await c.env.DB.prepare(
      "SELECT id, title, slug, status, featured_image, created_at FROM pages ORDER BY created_at DESC"
    ).all();
    return c.json(results);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 2. GET SINGLE (Untuk Edit)
pagesRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const page = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first();
    return page ? c.json(page) : c.json({ error: 'Page not found' }, 404);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 3. CREATE (Simpan Baru)
pagesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    // [UPDATE] Ambil featured_image dari body
    const { title, slug, body: content, excerpt, meta_title, meta_description, status, featured_image } = body;
    
    await c.env.DB.prepare(`
      INSERT INTO pages (title, slug, body, excerpt, meta_title, meta_description, status, featured_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(title, slug, content, excerpt || '', meta_title || '', meta_description || '', status || 'publish', featured_image || '').run();
    
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 4. UPDATE (Simpan Perubahan)
pagesRouter.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    // [UPDATE] Update featured_image
    await c.env.DB.prepare(`
      UPDATE pages SET title=?, slug=?, body=?, excerpt=?, meta_title=?, meta_description=?, status=?, featured_image=?, updated_at=datetime('now')
      WHERE id=?
    `).bind(body.title, body.slug, body.body, body.excerpt || '', body.meta_title || '', body.meta_description || '', body.status, body.featured_image || '', id).run();
    
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// 5. DELETE
pagesRouter.delete('/', async (c) => {
  try {
    let id;
    try {
        const body = await c.req.json();
        id = body.id;
    } catch(e) {
        id = c.req.query('id');
    }
    if (!id) return c.json({ error: 'ID required' }, 400);

    await c.env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default pagesRouter;