import type { ThemeStructure, ThemeContext } from '../types';
import { css } from './style';
import { renderHeader, renderFooter, renderSidebar, renderHero, renderBreadcrumbs, renderShareButtons } from './components';

const LabMuPro: ThemeStructure = {
  name: 'LabMu Pro Framework',
  version: '3.0.0', // Major update to boilerplate framework
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

    const isLandingPage = layoutType === 'landing-page';

    // Vanilla JS for Interactive Components
    const modularJs = `
      <script>
        // DOM Ready
        document.addEventListener('DOMContentLoaded', () => {
          
          // 1. Theme Toggle (Dark/Light Mode)
          const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
          
          const toggles = document.querySelectorAll('.theme-toggle');
          toggles.forEach(btn => {
            btn.addEventListener('click', () => {
              const currentTheme = document.documentElement.getAttribute('data-theme');
              const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);
            });
          });

          // 2. Burger Menu (Mobile)
          const burgerBtn = document.getElementById('burgerBtn');
          const mobileMenu = document.getElementById('mobileMenu');
          if(burgerBtn && mobileMenu) {
            burgerBtn.addEventListener('click', () => {
              mobileMenu.classList.toggle('active');
            });
          }

          // 3. Accordion
          const accordions = document.querySelectorAll('.accordion-header');
          accordions.forEach(acc => {
            acc.addEventListener('click', function() {
              this.classList.toggle('active');
              const panel = this.nextElementSibling;
              if (panel.classList.contains('active')) {
                panel.classList.remove('active');
              } else {
                panel.classList.add('active');
              }
            });
          });

          // 4. Tabs
          const tabBtns = document.querySelectorAll('.tab-btn');
          tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
              const target = this.getAttribute('data-target');
              const tabGroup = this.closest('.tabs').parentElement;
              
              tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
              this.classList.add('active');
              
              tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
              tabGroup.querySelector(target).classList.add('active');
            });
          });

        });
      </script>
    `;

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${ctx.site.title}</title>
        <meta name="description" content="${ctx.site.description || ''}">
        
        <!-- Preconnect & Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        
        <!-- Icons -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        
        <style>
          :root {
            --primary: ${ctx.site?.theme_primary || '#2563eb'};
            --bg-body: ${ctx.site?.theme_bg || '#f8fafc'};
            --bg-card: ${ctx.site?.theme_bg || '#ffffff'};
            --text-main: ${ctx.site?.theme_text || '#334155'};
            --accent: ${ctx.site?.theme_accent || '#f59e0b'};
            --header-text: ${ctx.site?.header_text_color || '#334155'};
          }
          ${css}
        </style>
      </head>
      <body>
        <!-- Hook: before_header -->
        ${!isLandingPage ? renderHeader(ctx) : ''}
        
        <!-- Hook: before_main_content -->
        ${layoutType === 'home' ? renderHero(ctx) : ''}

        <div class="container main-wrapper ${layoutType}">
          ${layoutType === 'layout-left-sidebar' && !isLandingPage ? renderSidebar(sidebarData) : ''}

          <main id="main-content" role="main">
            ${content}
          </main>

          ${layoutType === 'layout-right-sidebar' && !isLandingPage ? renderSidebar(sidebarData) : ''}
        </div>

        <!-- Hook: after_main_content -->
        ${!isLandingPage ? renderFooter(ctx) : ''}

        ${modularJs}
        <!-- Hook: wp_footer equivalent -->
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
      html = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size:var(--text-2xl); border-bottom: 2px solid var(--primary); padding-bottom:10px; display:inline-block;">Artikel Terbaru</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-2">
        ${posts.map((p: any) => `
          <article class="card post-card">
            <a href="/${p.slug}">
              <img src="${p.featured_image || 'https://placehold.co/600x400/eee/ccc?text=No+Image'}" class="post-thumb" alt="${p.title}" loading="lazy">
            </a>
            <div class="post-content">
              <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: 10px;">${p.category || p.type}</span>
              <h3 class="post-title"><a href="/${p.slug}">${p.title}</a></h3>
              <p class="post-excerpt">${(p.body || '').replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
              
              <div class="post-meta">
                <span><i class="far fa-calendar"></i> ${new Date(p.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>`;
    }
    
    return this._layout(html, 'Beranda', ctx, 'layout-right-sidebar');
  },

  // 3. TAMPILAN SINGLE POST
  renderSingle(ctx: ThemeContext) {
    const post = ctx.data;
    if (!post) return this.render404(ctx);
    
    // Breadcrumbs
    const breadcrumbs = renderBreadcrumbs([
      { label: post.category || 'Blog', url: '#' },
      { label: post.title }
    ]);

    // Social Share
    const fullUrl = `${ctx.site.url}/${post.slug}`;
    const shareButtons = renderShareButtons(fullUrl, post.title);

    // Render list tags HTML
    const tagsHtml = post.tags 
      ? post.tags.split(',').map((t: string) => `<span class="badge" style="margin-right:5px;">#${t.trim()}</span>`).join('')
      : '';

    // Structured Data (Schema.org)
    const schemaOrg = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "image": post.featured_image ? [post.featured_image] : [],
      "datePublished": new Date(post.created_at).toISOString(),
      "author": [{
          "@type": "Person",
          "name": "Admin",
          "url": ctx.site.url
        }]
    };

    const html = `
      <article>
        ${breadcrumbs}
        
        <div class="entry-header">
           <h1 class="entry-title">${post.title}</h1>
           <div class="entry-meta">
              <span><i class="far fa-calendar"></i> ${new Date(post.created_at).toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
              <span><i class="far fa-folder"></i> ${post.category || post.type}</span>
              <span><i class="far fa-user"></i> Admin</span>
           </div>
        </div>

        ${post.featured_image ? `<img src="${post.featured_image}" class="entry-image" alt="${post.title}" loading="lazy">` : ''}

        <div class="entry-content">
          <!-- Hook: before_content -->
          ${post.body || '<p>Isi konten belum ditulis...</p>'}
          <!-- Hook: after_content -->
        </div>

        ${tagsHtml ? `
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-color);">
             <strong style="margin-right:10px; color:var(--text-main);">Tags:</strong> ${tagsHtml}
          </div>
        ` : ''}

        ${shareButtons}
        
        <!-- Schema Markup -->
        <script type="application/ld+json">
          ${JSON.stringify(schemaOrg)}
        </script>
      </article>
    `;
    return this._layout(html, post.title, ctx, 'layout-right-sidebar');
  },

  // 4. PAGE & 404
  renderPage(ctx: ThemeContext) {
    const post = ctx.data;
    if (!post) return this.render404(ctx);

    const breadcrumbs = renderBreadcrumbs([
      { label: 'Halaman', url: '#' },
      { label: post.title }
    ]);

    // Halaman biasanya menggunakan layout full width (tanpa sidebar)
    const html = `
      <article>
        ${breadcrumbs}
        <div class="entry-header">
           <h1 class="entry-title">${post.title}</h1>
        </div>
        ${post.featured_image ? `<img src="${post.featured_image}" class="entry-image" alt="${post.title}" loading="lazy">` : ''}
        <div class="entry-content">
          ${post.body || '<p>Isi halaman belum ditulis...</p>'}
        </div>
      </article>
    `;
    return this._layout(html, post.title, ctx, 'layout-full'); 
  },

  render404(ctx: ThemeContext) {
    const html = `
      <div style="text-align:center; padding: 100px 0; max-width:600px; margin:0 auto;">
        <h1 style="font-size:6rem; color:var(--primary); margin-bottom:0;">404</h1>
        <h2 style="font-size:2rem; margin-bottom:1rem;">Halaman Tidak Ditemukan</h2>
        <p style="color:var(--text-muted); margin-bottom:2rem;">Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak pernah ada.</p>
        <a href="/" class="btn btn-primary"><i class="fas fa-home"></i> Kembali ke Beranda</a>
      </div>
    `;
    return this._layout(html, 'Not Found', ctx, 'layout-full');
  }
};

export default LabMuPro;