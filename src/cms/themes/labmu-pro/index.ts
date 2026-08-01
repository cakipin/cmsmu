import type { ThemeStructure, ThemeContext } from '../types';
import { css } from './style';
import { renderHeader, renderFooter, renderSidebar, renderHero } from './components';

const LabMuPro: ThemeStructure = {
  name: 'LabMu Pro',
  version: '2.1.0', // Update versi
  author: 'LabMu Team',

  // 1. LAYOUT MASTER
  _layout(content: string, title: string, ctx: ThemeContext, layoutType: string = 'layout-right-sidebar') {
    
    // LOGIC PINTAR MEMILIH DATA SIDEBAR
    let sidebarData: any[] = [];
    if (ctx.sidebarPosts && Array.isArray(ctx.sidebarPosts)) {
        sidebarData = ctx.sidebarPosts;
    } else if (Array.isArray(ctx.data)) {
        sidebarData = ctx.data;
    }

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${ctx.site.title}</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>${css}</style>
      </head>
      <body>
        ${renderHeader(ctx)}
        
        ${layoutType === 'home' ? renderHero(ctx) : ''}

        <div class="container main-wrapper ${layoutType === 'home' ? 'layout-right-sidebar' : layoutType}">
          <main>
            ${content}
          </main>

          ${layoutType !== 'layout-full' ? renderSidebar(sidebarData) : ''}

        </div>

        ${renderFooter(ctx)}
      </body>
      </html>
    `;
  },

  // 2. TAMPILAN HOME
  renderHome(ctx: ThemeContext) {
    const posts = ctx.data || [];
    let html = '';

    if (posts.length === 0) {
      html = '<div style="text-align:center; padding:50px;">Belum ada konten.</div>';
    } else {
      html = `<div class="grid-2">
        ${posts.map((p: any) => `
          <article class="post-card">
            <a href="/${p.slug}">
              <img src="${p.featured_image || 'https://placehold.co/600x400/eee/ccc?text=No+Image'}" class="post-thumb" alt="${p.title}">
            </a>
            <div class="post-content">
              
              <span class="post-tag">${p.category || p.type}</span>
              
              <h2 class="post-title"><a href="/${p.slug}">${p.title}</a></h2>
              <p class="post-excerpt">${(p.body || '').replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
              
              <div class="post-meta">
                <span><i class="far fa-calendar"></i> ${new Date(p.created_at).toLocaleDateString()}</span>
                
                ${p.tags ? `<span style="margin-left:auto; font-size:11px; color:#2563eb;">#${p.tags.split(',')[0]}</span>` : ''}
              </div>
            </div>
          </article>
        `).join('')}
      </div>`;
    }
    
    return this._layout(html, 'Beranda', ctx, 'home');
  },

  // 3. TAMPILAN SINGLE POST
  renderSingle(ctx: ThemeContext) {
    const post = ctx.data;
    
    // Render list tags HTML jika ada
    const tagsHtml = post.tags 
      ? post.tags.split(',').map((t: string) => 
          `<span style="background:#f1f5f9; padding:4px 10px; border-radius:4px; font-size:13px; margin-right:5px; display:inline-block; color:#475569;">#${t.trim()}</span>`
        ).join('')
      : '';

    const html = `
      <article>
        <div class="entry-header">
           <span style="color:var(--primary); font-weight:bold; text-transform:uppercase; letter-spacing:1px; font-size:0.9rem;">
              ${post.category || post.type}
           </span>
           
           <h1 class="entry-title">${post.title}</h1>
           <div style="color:#64748b;">
              Ditulis oleh <b>Admin</b> pada ${new Date(post.created_at).toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}
           </div>
        </div>

        ${post.featured_image ? `<img src="${post.featured_image}" class="entry-image">` : ''}

        <div class="entry-content">
          ${post.body || '<p>Isi konten belum ditulis...</p>'}
        </div>

        ${tagsHtml ? `
          <div style="margin-top:40px; padding-top:20px; border-top:1px solid #eee;">
             <strong style="margin-right:10px; color:#333;">Tags:</strong> ${tagsHtml}
          </div>
        ` : ''}

        <div style="margin-top:30px; padding:30px; background:#f1f5f9; border-radius:10px; text-align:center;">
           <h3>Suka artikel ini?</h3>
           <p>Bagikan ke teman-temanmu agar mereka juga mendapatkan manfaatnya.</p>
           <button class="btn-hero" style="font-size:0.9rem; padding:10px 20px;">Share Article</button>
        </div>
      </article>
    `;
    return this._layout(html, post.title, ctx, 'layout-right-sidebar');
  },

  // 4. PAGE & 404
  renderPage(ctx: ThemeContext) {
    return this.renderSingle(ctx); 
  },

  render404(ctx: ThemeContext) {
    const html = `
      <div style="text-align:center; padding: 100px 0;">
        <h1 style="font-size:5rem; color:var(--primary);">404</h1>
        <p style="font-size:1.5rem;">Halaman Hilang Ditelan Bumi</p>
        <a href="/" class="btn-hero" style="margin-top:20px;">Kembali ke Home</a>
      </div>
    `;
    return this._layout(html, 'Not Found', ctx, 'layout-full');
  }
};

export default LabMuPro;