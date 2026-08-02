import type { ThemeStructure, ThemeContext } from '../types';
import { css } from './style';

const LabMuDefault: ThemeStructure = {
  name: 'LabMu Default',
  version: '2.0.0',
  author: 'LabMu Team',

  // ─── LAYOUT ─────────────────────────────────────────────────────────────────
  _layout(content: string, title: string, ctx: ThemeContext) {
    const menus = ctx.menus || [];
    const site = ctx.site || {};
    const favicon = site.site_favicon || '/favicon.ico';
    const siteTitle = site.site_title || 'LabMu CMS';
    const siteDesc = site.site_desc || '';

    // CSS Variable overrides dari Settings
    const primaryColor = site.theme_primary || '#2271b1';
    const primaryDark = site.theme_primary_dark || '#135e96';
    const bgColor = site.theme_bg || '#ffffff';
    const textColor = site.theme_text || '#1a1a2e';
    const accentColor = site.theme_accent || '#f0f7ff';

    const themeVars = `
      :root {
        --cms-primary: ${primaryColor};
        --cms-primary-dark: ${primaryDark};
        --cms-bg: ${bgColor};
        --cms-text: ${textColor};
        --cms-accent: ${accentColor};
      }
    `;

    const navHtml = menus.length > 0 ? `
      <nav class="main-nav">
        <ul class="nav-menu">
          ${menus.map((m: any) => `
            <li class="menu-item"><a href="${m.url}">${m.label}</a></li>
          `).join('')}
        </ul>
      </nav>
    ` : '';

    const logoUrl = site.header_logo_url || site.site_logo;
    const logoHtml = logoUrl
      ? `<img src="${logoUrl}" alt="${siteTitle} Logo">`
      : '';

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="${favicon}">
  <title>${title} – ${siteTitle}</title>
  <style>${themeVars}${css}</style>
</head>
<body>
  <div class="site-wrapper">
    <header class="site-header">
      <div class="container">
        <div class="header-inner">
          <a href="/" class="site-brand">
            ${logoHtml}
            <div class="site-brand-text">
              <span class="site-title">${siteTitle}</span>
              ${siteDesc ? `<span class="site-tagline">${siteDesc}</span>` : ''}
            </div>
          </a>
          ${navHtml}
        </div>
      </div>
    </header>

    <main>
      <div class="container">
        ${content}
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        &copy; ${new Date().getFullYear()} <a href="/">${siteTitle}</a>. Powered by <strong>LabMu CMS</strong>.
      </div>
    </footer>
  </div>
</body>
</html>`;
  },

  // ─── HOME ────────────────────────────────────────────────────────────────────
  renderHome(ctx: ThemeContext) {
    const posts = ctx.data || [];
    const site = ctx.site || {};
    const siteTitle = site.site_title || 'LabMu CMS';
    const siteDesc = site.site_desc || 'Selamat datang di website kami.';

    const heroHtml = `
      <div class="home-hero">
        <div class="container">
          <h1>${siteTitle}</h1>
          <p>${siteDesc}</p>
        </div>
      </div>
    `;

    let gridHtml = '';
    if (posts.length === 0) {
      gridHtml = `<div class="empty-state"><p>Belum ada postingan. Mulailah menulis di Admin Panel!</p></div>`;
    } else {
      gridHtml = `<div class="post-grid">
        ${posts.map((p: any) => {
          const dateStr = p.created_at
            ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '';
          const imgHtml = p.featured_image
            ? `<img class="post-card-img" src="${p.featured_image}" alt="${p.title}" loading="lazy">`
            : `<div class="post-card-img-placeholder">✍️</div>`;
          const catHtml = p.category && p.category !== 'Uncategorized'
            ? `<span class="post-card-cat">${p.category}</span>` : '';
          const excerpt = p.excerpt || (p.body ? p.body.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : 'Klik untuk membaca selengkapnya...');

          return `<article class="post-card">
            <a href="/${p.slug}">${imgHtml}</a>
            <div class="post-card-body">
              ${catHtml}
              <h2 class="post-card-title"><a href="/${p.slug}">${p.title}</a></h2>
              <p class="post-card-excerpt">${excerpt}</p>
              <div class="post-card-meta">
                <span>📅 ${dateStr}</span>
                <a href="/${p.slug}">Baca →</a>
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>`;
    }

    // Home hero is outside container, so we need a special layout
    const siteHtml = site.site_title ? heroHtml + `<div>${gridHtml}</div>` : gridHtml;
    return this._layout(siteHtml, 'Beranda', ctx);
  },

  // ─── SINGLE POST ─────────────────────────────────────────────────────────────
  renderSingle(ctx: ThemeContext) {
    const post = ctx.data;
    if (!post) return this.render404(ctx);

    const dateStr = post.created_at
      ? new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    const catHtml = post.category && post.category !== 'Uncategorized'
      ? `<span class="single-category">${post.category}</span>` : '';

    const tagsHtml = post.tags
      ? `<div class="post-tags">${post.tags.split(',').map((t: string) => t.trim()).filter(Boolean).map((t: string) =>
          `<a href="/${t.toLowerCase().replace(/\s+/g,'-')}" class="post-tag">#${t}</a>`
        ).join('')}</div>`
      : '';

    const html = `
      <div class="single-wrap">
        <a href="/" class="back-link">← Kembali</a>

        <article>
          <div class="single-header">
            ${catHtml}
            <h1 class="single-title">${post.title}</h1>
            <div class="single-meta">
              ${dateStr ? `<span>📅 ${dateStr}</span>` : ''}
              <span>👤 Admin</span>
            </div>
          </div>

          ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" class="single-featured-img">` : ''}

          <div class="entry-content">
            ${post.body || '<p>Konten belum tersedia.</p>'}
          </div>

          ${tagsHtml}
        </article>
      </div>
    `;
    return this._layout(html, post.title, ctx);
  },

  // ─── PAGE ────────────────────────────────────────────────────────────────────
  renderPage(ctx: ThemeContext) {
    const page = ctx.data;
    if (!page) return this.render404(ctx);

    const html = `
      <div class="page-wrap">
        ${page.featured_image ? `<img src="${page.featured_image}" alt="${page.title}" class="single-featured-img" style="margin-bottom:28px;">` : ''}
        <h1 class="page-title">${page.title}</h1>
        <div class="entry-content">
          ${page.body || '<p>Halaman ini belum memiliki konten.</p>'}
        </div>
      </div>
    `;
    return this._layout(html, page.title, ctx);
  },

  // ─── CATEGORY ───────────────────────────────────────────────────────────────
  renderCategory(ctx: ThemeContext) {
    const posts = ctx.data || [];
    const catName = (ctx as any).categoryName || 'Kategori';

    const gridHtml = posts.length === 0
      ? `<div class="empty-state"><p>Tidak ada artikel dalam kategori ini.</p></div>`
      : `<div class="post-grid">
          ${posts.map((p: any) => {
            const dateStr = p.created_at
              ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              : '';
            const imgHtml = p.featured_image
              ? `<img class="post-card-img" src="${p.featured_image}" alt="${p.title}" loading="lazy">`
              : `<div class="post-card-img-placeholder">✍️</div>`;
            const excerpt = p.excerpt || (p.body ? p.body.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : 'Klik untuk membaca...');

            return `<article class="post-card">
              <a href="/${p.slug}">${imgHtml}</a>
              <div class="post-card-body">
                <h2 class="post-card-title"><a href="/${p.slug}">${p.title}</a></h2>
                <p class="post-card-excerpt">${excerpt}</p>
                <div class="post-card-meta">
                  <span>📅 ${dateStr}</span>
                  <a href="/${p.slug}">Baca →</a>
                </div>
              </div>
            </article>`;
          }).join('')}
        </div>`;

    const html = `
      <div class="cat-header">
        <a href="/" class="back-link">← Beranda</a>
        <h1>📂 ${catName}</h1>
        <p>${posts.length} artikel ditemukan</p>
      </div>
      ${gridHtml}
    `;
    return this._layout(html, catName, ctx);
  },

  // ─── 404 ────────────────────────────────────────────────────────────────────
  render404(ctx: ThemeContext) {
    const html = `
      <div class="error-page">
        <div class="error-code">404</div>
        <h1 class="error-title">Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        <a href="/" class="back-link">← Kembali ke Beranda</a>
      </div>
    `;
    return this._layout(html, '404 – Tidak Ditemukan', ctx);
  },
};

export default LabMuDefault;