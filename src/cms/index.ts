import { Hono } from 'hono'
import { cors } from 'hono/cors'
import registerAddons from './addons'

// MODULES
import adminRouter from './modules/admin/admin.router'
import contentRouter from './modules/contents/contents.router'
import publicRouter from './modules/public/public.router'
import settingsRouter from './modules/settings/settings.router'
import mediaRouter from './modules/media/media.router'
import usersRouter from './modules/users/users.router'
import migrationRouter from './migration'
import themeRouter from './modules/theme/theme.router'
import pluginsRouter from './modules/plugins/plugins.router'
import menusRouter from './modules/menus/menus.router'
import { updateSchema } from './db/init'
import { renderAdmin } from './modules/admin/ui/view'
import postsRouter from './modules/posts/posts.router'
import pagesRouter from './modules/pages/pages.router'; // Pastikan import ini ada


// ADDONS
// (All addons have been removed)

// AUTH MIDDLEWARE
import { authMiddleware } from './middleware/auth'

type Bindings = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  BUCKET?: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>()

const getBucket = (env: Bindings) => {
    return env.MEDIA_BUCKET || env.BUCKET;
};

// 1. GLOBAL MIDDLEWARE
app.use('/*', cors())
app.use('*', async (c, next) => {
  await next();
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Content-Security-Policy', "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:;");
});

app.onError((err, c) => {
  console.error(`[Global Error]: ${err.message}`, err);
  return c.json({ success: false, error: err.message || 'Internal Server Error' }, 500);
});

// 2. AUTH MIDDLEWARE
app.use('/api/*', async (c, next) => {
  const path = c.req.path;
  const method = c.req.method;
  const isWhitelisted = path.includes('/login') || path.startsWith('/api/public') || path.startsWith('/api/setup') || 
    (method === 'GET' && (path.startsWith('/api/media') || path.startsWith('/api/posts') || path.startsWith('/api/pages') || path.startsWith('/api/contents')));

  if (isWhitelisted) return await next();
  return await authMiddleware(c, next);
});

// 3. ROUTES DEFINITION
registerAddons(app);

// Admin & Sys
app.get('/admin', (c) => c.html(renderAdmin({ view: 'dash' }))); 
app.get('/admin/login', (c) => c.html(renderAdmin({ view: 'login' })));
app.get('/admin/', (c) => c.redirect('/admin', 301));
app.get('/sys/install', async (c) => {
  try { const logs = await updateSchema(c.env.DB); return c.json({ success: true, details: logs }); } 
  catch (e: any) { return c.json({ error: e.message }, 500); }
});
app.route('/sys/migration', migrationRouter);

// API
app.route('/api/contents', contentRouter);
app.route('/api/settings', settingsRouter);
app.route('/api/media', mediaRouter); 
app.route('/api/theme', themeRouter);
app.route('/api/plugins', pluginsRouter);
app.route('/api/users', usersRouter);
app.route('/api/menus', menusRouter);
app.route('/api/posts', postsRouter);
app.route('/api/pages', pagesRouter); // Route API Pages

// Catch-all admin view (setelah spesifik routes)
app.get('/admin/:view', (c) => c.html(renderAdmin({ view: c.req.param('view') })));

// Media
app.get('/media/*', async (c) => {
  try {
    const key = c.req.path.replace('/media/', '');
    if (!key) return c.notFound();
    const bucket = getBucket(c.env);
    if (!bucket) return c.text('Bucket Config Error', 500);
    const object = await bucket.get(decodeURIComponent(key));
    if (!object) return c.text('File not found', 404);
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); 
    return new Response(object.body, { headers });
  } catch (e: any) { return c.text(e.message, 500); }
});

// =====================================================================
// PUBLIC ROUTER (THEME) - DISABLED FOR ASTRO INTEGRATION
// =====================================================================
// Menangani Homepage, Login, Search, dan URL lain yang tidak ada di DB
// app.route('/', publicRouter);

export default app