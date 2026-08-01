import type { ThemeStructure, ThemeContext } from '../types';
import { css } from './style';

const LabMuNews: ThemeStructure = {
  name: 'LabMu News',
  version: '1.2.0',
  author: 'LabMu Dev',

  _layout(content: string, title: string, ctx: ThemeContext) {
    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${ctx.site.title || 'Portal Berita'}</title>
        <style>${css}</style>
      </head>
      <body>
        <header class="main-header">
          <div class="container header-inner">
             <a href="/" class="logo">LabMu<span style="color:#111">News.</span></a>
             <nav class="nav-menu">
                <a href="/">Nasional</a>
                <a href="/">Ekonomi</a>
                <a href="/">Teknologi</a>
                <a href="/quran" style="color:#059669;">QuranMu</a>
             </nav>
          </div>
        </header>

        <div class="container">
          <main>${content}</main>
        </div>

        <footer>
           <p>&copy; ${new Date().getFullYear()} LabMu News Premium. Ditenagai oleh LabMu CMS.</p>
        </footer>
      </body>
      </html>
    `;
  },

  renderHome(ctx: ThemeContext) {
    const posts = ctx.data || [];
    
    // Kalau belum ada konten, tampilkan placeholder cantik
    if (posts.length === 0) {
       return this._layout(`
         <div style="text-align:center; padding:100px 0;">
            <h2 style="color:#ccc;">Belum ada berita yang diterbitkan.</h2>
            <p>Silakan gunakan Addon <b>WP Importer</b> untuk menarik berita dari WordPress.</p>
         </div>
       `, 'Home', ctx);
    }

    // Ambil 1 Berita Terbaru jadi HERO
    const heroPost = posts[0];
    const otherPosts = posts.slice(1);

    const heroHtml = `
      <div class="hero-section">
         <a href="/${heroPost.slug}" class="hero-card" style="grid-column: span 2;">
            <img src="${heroPost.featured_image || 'https://placehold.co/800x400/111/fff?text=Breaking+News'}" class="hero-img">
            <div class="hero-overlay">
               <span class="hero-cat">${heroPost.category || 'Berita Utama'}</span>
               <h2 class="hero-title">${heroPost.title}</h2>
               <p>${new Date(heroPost.created_at).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
            </div>
         </a>
      </div>
    `;

    // Berita Lainnya Grid
    const gridHtml = `
      <div class="section-title"><span>Berita Terkini</span></div>
      <div class="news-grid">
         ${otherPosts.map((p: any) => `
            <a href="/${p.slug}" class="news-card">
               <img src="${p.featured_image || 'https://placehold.co/400x250/eee/999?text=News'}" class="news-thumb">
               <div class="news-body">
                  <div class="news-meta">${new Date(p.created_at).toLocaleDateString('id-ID')}</div>
                  <h3 class="news-title">${p.title}</h3>
                  <div class="read-more">Baca Selengkapnya &rarr;</div>
               </div>
            </a>
         `).join('')}
      </div>
    `;

    return this._layout(heroHtml + gridHtml, 'Berita Terkini', ctx);
  },

  renderSingle(ctx: ThemeContext) {
    const p = ctx.data;
    if (!p) return this._layout('<h1>404 Not Found</h1>', '404', ctx);

    const html = `
      <article class="single-container">
         <header class="post-header">
            <span class="hero-cat">${p.category || 'Umum'}</span>
            <h1 class="post-title">${p.title}</h1>
            <div class="post-meta">
               Oleh <b>Admin</b> &bull; ${new Date(p.created_at || Date.now()).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}
            </div>
         </header>

         ${p.featured_image ? `<img src="${p.featured_image}" class="post-img">` : ''}

         <div class="post-content">
            ${p.body}
         </div>
      </article>
    `;
    return this._layout(html, p.title, ctx);
  },

  renderPage(ctx: ThemeContext) { return this.renderSingle(ctx); },
  render404(ctx: ThemeContext) { return this._layout('<div style="text-align:center; padding:100px;"><h1>404</h1><p>Halaman tidak ditemukan</p></div>', 'Not Found', ctx); }
};

export default LabMuNews;