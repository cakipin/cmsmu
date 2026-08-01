import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { getActiveTheme } from '../../themes/registry'; 

// Import Helper SEO
// (SEO Plugin Removed)

const publicRouter = new Hono<{ Bindings: Bindings }>();

// --- HELPER DATABASE ---
async function getGlobalData(db: any) {
    let settings: any = {};
    let menus: any[] = [];
    try {
        const { results: settingRows } = await db.prepare("SELECT key, value FROM settings").all();
        if(settingRows) settingRows.forEach((row: any) => { settings[row.key] = row.value; });
        const { results: menuRows } = await db.prepare("SELECT * FROM menus ORDER BY order_num ASC").all();
        menus = menuRows || [];
    } catch (e) { console.error("Error global data", e); }
    return { settings, menus };
}

async function getRenderer(db: any) {
  try {
    const activeThemeRow = await db.prepare("SELECT id FROM themes WHERE active = 1").first();
    const themeId = activeThemeRow ? activeThemeRow.id : 'labmu-default';
    const theme = getActiveTheme(themeId);
    return { Renderer: theme || getActiveTheme('labmu-default'), themeId };
  } catch (e) { 
      return { Renderer: getActiveTheme('labmu-default'), themeId: 'labmu-default' }; 
  }
}

// ============================================================
// 1. ROUTE HOMEPAGE
// ============================================================
publicRouter.get('/', async (c) => {
  try {
    const { settings, menus } = await getGlobalData(c.env.DB);
    const { Renderer, themeId } = await getRenderer(c.env.DB);
    
    if (themeId === 'labmu-quran') {
        const context = { site: settings, menus: menus, data: ListSurat };
        return c.html(Renderer.renderHome(context));
    } else {
        const { results: posts } = await c.env.DB.prepare("SELECT * FROM posts WHERE status = 'publish' ORDER BY created_at DESC LIMIT 10").all();
        const context = { site: settings, menus: menus, data: posts || [] };
        return c.html(Renderer.renderHome(context));
    }
  } catch(e: any) { return c.text('Error: ' + e.message, 500); }
});


// 2. ROUTE PENCARIAN DENGAN PAGINATION
publicRouter.get('/search', async (c) => {
    const query = c.req.query('q');
    const page = parseInt(c.req.query('page') || '1'); // Default hal 1
    const limit = 10; // Jumlah per halaman
    const offset = (page - 1) * limit;
    
    // Jika kosong, kembalikan ke home
    if (!query) return c.redirect('/');

    const cleanQuery = query.toLowerCase().trim();

    try {
        const db = c.env.DB;
        const { settings, menus } = await getGlobalData(db);
        const { Renderer } = await getRenderer(db);

        // A. HITUNG TOTAL DATA (Untuk Pagination)
        const countSql = `
            SELECT count(*) as total FROM posts 
            WHERE status = 'publish' 
            AND (
                lower(title) LIKE ? 
                OR lower(body) LIKE ? 
                OR lower(tags) LIKE ?
            )
        `;
        const bindVal = `%${cleanQuery}%`;
        const totalRow: any = await db.prepare(countSql).bind(bindVal, bindVal, bindVal).first();
        const totalItems = totalRow.total || 0;
        const totalPages = Math.ceil(totalItems / limit);

        // B. AMBIL DATA SESUAI HALAMAN (LIMIT OFFSET)
        const sql = `
            SELECT * FROM posts 
            WHERE status = 'publish' 
            AND (
                lower(title) LIKE ? 
                OR lower(body) LIKE ? 
                OR lower(tags) LIKE ?
            )
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        const { results: posts } = await db.prepare(sql).bind(bindVal, bindVal, bindVal, limit, offset).all();

        // C. KIRIM DATA KE TEMA
        const context = { 
            site: settings, 
            menus: menus, 
            data: posts || [],
            query: query,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };

        if (Renderer && typeof Renderer.renderSearch === 'function') {
            return c.html(Renderer.renderSearch(context));
        }
        
        // Fallback
        context.categoryName = `Pencarian: "${query}"`;
        if (Renderer && typeof Renderer.renderCategory === 'function') {
            return c.html(Renderer.renderCategory(context));
        } else {
            return c.html(Renderer.renderHome(context));
        }

    } catch (e: any) { return c.text("Search Error: " + e.message, 500); }
});

// ============================================================
// 3. ROUTE MAGIC (Kategori, Post, Page, Quran)
// ============================================================
publicRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug').toLowerCase();
  
  // Filter file system
  if (slug.includes('.') || slug === 'favicon.ico') return c.notFound(); 

  try {
    const { settings, menus } = await getGlobalData(c.env.DB);
    const { Renderer } = await getRenderer(c.env.DB); 
    const db = c.env.DB;

    // A. CEK KATEGORI
    const slugSpace = slug.replace(/-/g, ' '); 
    const catQuery = `SELECT * FROM posts WHERE (lower(category) = ? OR lower(category) = ?) AND status='publish' ORDER BY created_at DESC`;
    const { results: catPosts } = await db.prepare(catQuery).bind(slug, slugSpace).all();
    
    if (catPosts && catPosts.length > 0) {
        const realCategoryName = catPosts[0].category || slugSpace;
        const title = realCategoryName.replace(/\b\w/g, (l: string) => l.toUpperCase());
        const context = { site: settings, menus, data: catPosts, categoryName: title };
        if (Renderer && typeof Renderer.renderCategory === 'function') {
            return c.html(Renderer.renderCategory(context));
        }
        return c.html(Renderer.renderHome(context));
    }

    // B. CEK QURAN (Removed)
    
    // C. CEK POST & PAGE
    let content: any = await db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'publish'").bind(slug).first();
    let type = 'post';

    if (!content) {
        content = await db.prepare("SELECT * FROM pages WHERE slug = ? AND status = 'publish'").bind(slug).first();
        type = 'page';
    }
    
    if (content) {
        // content.body = injectInternalLinks(content.body); (Removed)
        content.type = type;
        const context = { site: settings, menus, data: content };
        if (type === 'page' && Renderer.renderPage) return c.html(Renderer.renderPage(context));
        return c.html(Renderer.renderSingle(context));
    }

    return c.html(Renderer.render404({ site: settings, menus, data: null }), 404);

  } catch (e: any) { return c.text('Error System: ' + e.message, 500); }
});

export default publicRouter;