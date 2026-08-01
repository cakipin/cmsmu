import { Hono } from 'hono';
import { Bindings } from '../../types';
import { getActiveTheme } from '../../themes/registry'; 
import { QuranService } from '../../addons/quran-mu/quran.service';
import { ListSurat } from '../../themes/labmu-quran/list-surat';
import LabMuQuran from '../../themes/labmu-quran/index';

const publicRouter = new Hono<{ Bindings: Bindings }>();

// --- HELPER ---
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

// 1. ROUTE HOMEPAGE
publicRouter.get('/', async (c) => {
  try {
    const { settings, menus } = await getGlobalData(c.env.DB);
    const { Renderer, themeId } = await getRenderer(c.env.DB);
    
    // TEMA QURAN
    if (themeId === 'labmu-quran') {
        const context = { site: settings, menus: menus, data: ListSurat };
        return c.html(Renderer.renderHome(context));
    } 
    // TEMA BERITA/WIKI
    else {
        const { results: posts } = await c.env.DB.prepare("SELECT * FROM posts WHERE status = 'publish' ORDER BY created_at DESC LIMIT 10").all();
        const context = { site: settings, menus: menus, data: posts || [] };
        return c.html(Renderer.renderHome(context));
    }
  } catch(e: any) { return c.text('Error: ' + e.message, 500); }
});

// 2. ROUTE MAGIC (Menangani Kategori, Post, Page, Quran)
publicRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug').toLowerCase();
  
  if (slug.includes('.') || slug === 'favicon.ico') return c.notFound(); 

  try {
    const { settings, menus } = await getGlobalData(c.env.DB);
    const { Renderer } = await getRenderer(c.env.DB); 
    const db = c.env.DB;

    // --- A. CEK APAKAH INI KATEGORI? ---
    // Logika Baru: Cek slug asli ("fatwa-tarjih") ATAU slug spasi ("fatwa tarjih")
    const slugSpace = slug.replace(/-/g, ' '); 

    // Kita gunakan LIKE agar pencarian case-insensitive dan menangkap variasi
    const categoryQuery = `
        SELECT * FROM posts 
        WHERE (lower(category) = ? OR lower(category) = ?) 
        AND status='publish' 
        ORDER BY created_at DESC
    `;
    
    const { results: posts } = await db.prepare(categoryQuery).bind(slug, slugSpace).all();
    
    // Jika ditemukan minimal 1 post, berarti ini adalah HALAMAN KATEGORI
    if (posts && posts.length > 0) {
        
        // Ambil nama kategori asli dari post pertama untuk judul (biar cantik, misal "Fatwa Tarjih")
        const realCategoryName = posts[0].category || slugSpace;
        
        // Capitalize Title (Fatwa tarjih -> Fatwa Tarjih)
        const title = realCategoryName.replace(/\b\w/g, (l: string) => l.toUpperCase());
        
        const context = { 
            site: settings, 
            menus: menus, 
            data: posts,
            categoryName: title 
        };
        
        if (Renderer && typeof Renderer.renderCategory === 'function') {
            return c.html(Renderer.renderCategory(context));
        } else {
            return c.html(Renderer.renderHome(context));
        }
    }

    // --- B. CEK QURAN ---
    // (Kode Quran tetap sama seperti sebelumnya...)
    let nomorSurat = null;
    if (/^\d+$/.test(slug)) { 
        const num = parseInt(slug);
        if (num >= 1 && num <= 114) nomorSurat = num;
    } else {
        const suratFound = ListSurat.find(s => s.slug === slug); 
        if (suratFound) nomorSurat = suratFound.nomor;
    }
    if (nomorSurat) {
        const quranService = new QuranService(c.env.QURAN_CACHE, c.env.DB);
        const dataSurat = await quranService.getDetailSurat(nomorSurat);
        if (dataSurat) return c.html(LabMuQuran.renderSingle({ site: settings, menus, data: dataSurat })); 
    }
    
    // --- C. CEK POST & PAGE ---
    // (Kode Post & Page tetap sama...)
    let content: any = await db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'publish'").bind(slug).first();
    let type = 'post';

    if (!content) {
        content = await db.prepare("SELECT * FROM pages WHERE slug = ? AND status = 'publish'").bind(slug).first();
        type = 'page';
    }
    
    if (content) {
        content.type = type;
        const context = { site: settings, menus: menus, data: content };
        if (type === 'page' && Renderer.renderPage) return c.html(Renderer.renderPage(context));
        return c.html(Renderer.renderSingle(context));
    }

    // --- D. 404 NOT FOUND ---
    return c.html(Renderer.render404({ site: settings, menus, data: null }), 404);

  } catch (e: any) { return c.text('Error System: ' + e.message, 500); }
});

export default publicRouter;