import { Hono } from 'hono'
import { cors } from 'hono/cors'
import registerAddons from './addons'
// Hapus import { Bindings } from './types' jika isinya konflik, kita definisikan ulang di bawah agar pasti.

// MODULES
import adminRouter from './modules/admin/admin.router'
import contentRouter from './modules/contents/contents.router'
import publicRouter from './modules/public/public.router'
import settingsRouter from './modules/settings/settings.router'
import mediaRouter from './modules/media/media.router'
import usersRouter from './modules/users/users.router'
import migrationRouter from './migration'
import themeRouter from './modules/theme/theme.router'
import menusRouter from './modules/menus/menus.router'
import { updateSchema } from './db/init'
import { renderAdmin } from './modules/admin/ui/view'; // Pastikan path ini benar (view.ts atau views.ts)
import postsRouter from './modules/posts/posts.router';

// ADDONS
import quranRouter from './addons/quran-mu/quran.router'
import tarjihRouter from './addons/tarjih-sync/router' 

// --- [PERBAIKAN KRUSIAL] DEFINISI BINDINGS ---
// Pastikan nama 'BUCKET' sama persis dengan di wrangler.toml
type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket; 
};

const app = new Hono<{ Bindings: Bindings }>()

// ---------------------------------------------------------------------
// 1. CORS (Letakkan paling atas agar tidak kena block)
// ---------------------------------------------------------------------
app.use('/*', cors());

// ---------------------------------------------------------------------
// 2. AUTH MIDDLEWARE (HANYA UNTUK API)
// ---------------------------------------------------------------------
// Import middleware auth (Pastikan path import sesuai dengan struktur folder Anda)
// Jika error, cek path './middleware/auth'
import { authMiddleware } from './middleware/auth'; 

app.use('/api/*', async (c, next) => {
  const path = c.req.path;
   
  // Whitelist yang lebih presisi
  const isWhitelisted = 
    path.includes('/login') || 
    path.startsWith('/api/public') || 
    path.startsWith('/api/setup') || // Penting untuk setup database awal
    path.startsWith('/api/media/file') || // Agar gambar bisa diakses publik
    path.startsWith('/api/posts') || // FIX: Agar public bisa baca post (metode GET)
    path.startsWith('/api/contents'); 

  // Izinkan GET request untuk public content (posts/media)
  if (isWhitelisted || (c.req.method === 'GET' && path.startsWith('/api/posts'))) {
    return await next();
  }
   
  return await authMiddleware(c, next);
});

// ---------------------------------------------------------------------
// 3. GLOBAL ERROR HANDLER
// ---------------------------------------------------------------------
app.onError((err, c) => {
  console.error(`[Global Error]: ${err.message}`, err);
  return c.json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: c.req.path
  }, 500);
});

// ---------------------------------------------------------------------
// 4. SECURITY HEADERS
// ---------------------------------------------------------------------
app.use('*', async (c, next) => {
  await next();
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('X-Content-Type-Options', 'nosniff');
  // Content Security Policy yang aman namun fleksibel untuk gambar/script
  c.header('Content-Security-Policy', 
    "default-src 'self' https: data: blob:; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https:;"
  );
});

// ---------------------------------------------------------------------
// 5. ROUTES DEFINITION
// ---------------------------------------------------------------------
registerAddons(app);

// --- Admin UI Routes ---
// Render Admin dengan data view yang sesuai
app.get('/admin', (c) => c.html(renderAdmin({ view: 'dash' }))); 
app.get('/admin/login', (c) => c.html(renderAdmin({ view: 'login' })));
app.get('/admin/', (c) => c.redirect('/admin', 301));

// System Install/Upgrade
app.get('/sys/install', async (c) => {
  try {
      // Pastikan fungsi updateSchema mengembalikan log atau string
      const logs = await updateSchema(c.env.DB); 
      return c.json({ success: true, message: "Database Upgrade Sukses!", details: logs });
  } catch (e: any) {
      return c.json({ error: "Gagal Init DB: " + e.message }, 500);
  }
})

// API Routes
app.route('/sys/migration', migrationRouter)
app.route('/api/contents', contentRouter)
app.route('/api/settings', settingsRouter)
app.route('/api/media', mediaRouter) 
app.route('/api/theme', themeRouter)
app.route('/api/users', usersRouter)
app.route('/api/menus', menusRouter)
app.route('/api/posts', postsRouter);
app.route('/api/quran', quranRouter)


// Addon Routes
app.route('/admin/tarjih-sync', tarjihRouter)

// Core Public Routes (DEFAULT)
app.route('/', publicRouter)

// ---------------------------------------------------------------------
// 6. PUBLIC VIEW HANDLER (FIX: Menggunakan Tabel POSTS)
// ---------------------------------------------------------------------
// Handler ini menangani slug (seperti /judul-postingan)
// Diletakkan paling bawah agar tidak menimpa route API/Admin
app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = c.env.DB;

  // Skip jika slug adalah aset sistem atau favicon
  if (slug.includes('.') || slug === 'favicon.ico' || slug === 'admin') {
    return c.notFound();
  }

  try {
    // FIX KRUSIAL: Query ke tabel 'posts' bukan 'contents'
    // Mengambil data post yang statusnya publish
    const post = await db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'publish'")
      .bind(slug)
      .first();

    if (!post) {
      return c.html(`
        <div style="font-family:sans-serif; text-align:center; padding:50px;">
            <h1>404</h1>
            <p>Halaman tidak ditemukan.</p>
            <a href="/">Kembali ke Beranda</a>
        </div>
      `, 404);
    }

    // Render HTML Sederhana (View Post)
    return c.html(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title} - LabMu</title>
        <style>
            body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
            h1 { font-size: 2.5rem; margin-bottom: 10px; color: #111; }
            .meta { color: #666; font-size: 0.9em; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
            .tag { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 0.85em; margin-right: 5px; color: #555; text-decoration: none; }
            .content { font-size: 1.1rem; }
            .btn-back { display: inline-block; margin-bottom: 20px; text-decoration: none; color: #2271b1; }
        </style>
      </head>
      <body>
        <a href="/" class="btn-back">← Kembali</a>
        
        ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}">` : ''}
        
        <h1>${post.title}</h1>
        
        <div class="meta">
            <span>📅 ${new Date(post.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            ${post.category ? ` | 📁 ${post.category}` : ''}
        </div>
        
        <div class="content">
            ${post.body || post.content || ''} 
        </div>
        
        <div style="margin-top:40px; padding-top:20px; border-top:1px solid #eee;">
            ${(post.tags || '').split(',').map((t: string) => t.trim() ? `<span class="tag">#${t.trim()}</span>` : '').join('')}
        </div>
      </body>
      </html>
    `);

  } catch (e: any) {
    return c.html(`<h1>Error System</h1><pre>${e.message}</pre>`, 500);
  }
});

export default app