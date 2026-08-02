import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const themeEditorRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/theme-editor/page?slug=about
themeEditorRouter.get('/page', async (c) => {
  const slug = c.req.query('slug');
  if (!slug) return c.json({ error: 'Slug required' }, 400);

  try {
    const page = await c.env.DB.prepare('SELECT body FROM pages WHERE slug = ?').bind(slug).first();
    if (page) {
      return c.json({ success: true, data: page });
    } else {
      return c.json({ success: true, data: null }); // Data belum ada
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// POST /api/theme-editor/page
themeEditorRouter.post('/page', async (c) => {
  try {
    const body = await c.req.json();
    const { slug, body: content } = body;
    if (!slug) return c.json({ error: 'Slug required' }, 400);

    // Cek apakah halaman sudah ada
    const exists = await c.env.DB.prepare('SELECT id FROM pages WHERE slug = ?').bind(slug).first();
    
    // Judul otomatis (Capitalize slug)
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    if (exists) {
      // Update
      await c.env.DB.prepare(`
        UPDATE pages SET body=?, updated_at=datetime('now') WHERE slug=?
      `).bind(content, slug).run();
    } else {
      // Insert baru
      await c.env.DB.prepare(`
        INSERT INTO pages (title, slug, body, status, created_at, updated_at)
        VALUES (?, ?, ?, 'publish', datetime('now'), datetime('now'))
      `).bind(title, slug, content).run();
    }
    
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default themeEditorRouter;
