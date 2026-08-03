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
    const page: any = await c.env.DB.prepare('SELECT body FROM pages WHERE slug = ?').bind(slug).first();
    if (page) {
      return c.json({ success: true, data: page });
    } else {
      if (slug === 'home') {
        // Pre-fill default layout for the home page so they can edit it immediately
        const defaultHomePuck = {
          content: [
            { type: "SiteHeader", props: { id: "SiteHeader-1" } },
            { type: "Hero", props: { id: "Hero-1" } },
            { type: "FeatureGrid", props: { id: "FeatureGrid-1" } },
            { type: "Testimonial", props: { id: "Testimonial-1" } },
            { type: "RecentPosts", props: { id: "RecentPosts-1" } },
            { type: "CallToAction", props: { id: "CallToAction-1" } },
            { type: "SiteFooter", props: { id: "SiteFooter-1" } }
          ],
          root: { props: { title: "Beranda Utama" } },
          zones: {}
        };
        return c.json({ success: true, data: { body: JSON.stringify(defaultHomePuck) } });
      }
      return c.json({ success: true, data: null }); // Data belum ada
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// GET /api/theme-editor/pages
themeEditorRouter.get('/pages', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, title, slug FROM pages ORDER BY title ASC').all();
    
    // Get homepage slug from settings
    const settingRow = await c.env.DB.prepare("SELECT value FROM settings WHERE key = 'site_homepage_slug'").first();
    const homeSlug = settingRow ? settingRow.value : 'home';
    
    return c.json({ success: true, data: results || [], homeSlug: homeSlug });
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
