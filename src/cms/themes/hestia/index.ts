import type { ThemeStructure, ThemeContext } from '../types';
import { css } from './style';

const Hestia: ThemeStructure = {
  name: 'Hestia Clone',
  version: '1.0.0',
  author: 'LabMu Dev',

  _layout(content: string, title: string, ctx: ThemeContext) {
    const menus = ctx.menus || [];
    const siteTitle = ctx.site.site_title || 'Hestia Clone';

    const navHtml = menus.length > 0 ? menus.map((m: any) => `
      <a href="${m.url}" class="nav-link">${m.label}</a>
    `).join('') : `
      <a href="/" class="nav-link">Home</a>
      <a href="/about" class="nav-link">About</a>
      <a href="/blog" class="nav-link">Blog</a>
    `;

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${siteTitle}</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700" rel="stylesheet">
        <style>${css}</style>
      </head>
      <body>
        <nav class="navbar">
          <div class="container navbar-container">
             <a href="/" class="navbar-brand">${siteTitle}</a>
             <div class="navbar-nav">
                ${navHtml}
             </div>
          </div>
        </nav>

        <main class="main-content">
           ${content}
        </main>

        <footer class="footer">
           <div class="container text-center">
             <p>&copy; ${new Date().getFullYear()} ${siteTitle}. Hestia Clone Theme.</p>
           </div>
        </footer>
      </body>
      </html>
    `;
  },
  
  renderHome(ctx: ThemeContext) {
    const posts = ctx.data || [];
    const siteTitle = ctx.site.site_title || 'Hestia Clone';
    const siteDesc = ctx.site.site_description || 'Material Design inspired CMS theme.';

    const heroHtml = `
      <div class="hero">
         <div class="container text-center">
            <h1 class="hero-title">${siteTitle}</h1>
            <h4 class="hero-subtitle">${siteDesc}</h4>
            <a href="#blog" class="btn btn-primary">Read Blog</a>
         </div>
      </div>
    `;

    const blogHtml = `
      <div class="section-blog" id="blog">
         <div class="container">
            <div class="text-center">
               <h2 class="section-title">Latest Blog</h2>
               <p class="section-description">Our most recent articles.</p>
            </div>
            <div class="grid">
               ${posts.length === 0 ? '<p class="text-center">No posts found.</p>' : posts.map((p: any) => {
                  const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                  const imgHtml = p.featured_image ? `<div class="card-image" style="background-image: url('${p.featured_image}')"></div>` : `<div class="card-image" style="background-color: #eee;"></div>`;
                  const excerpt = p.excerpt || (p.body ? p.body.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '');
                  return `
                     <div class="card card-blog">
                        <a href="/${p.slug}">${imgHtml}</a>
                        <div class="card-body">
                           <h6 class="card-category text-info">${p.category || 'Uncategorized'}</h6>
                           <h4 class="card-title"><a href="/${p.slug}">${p.title}</a></h4>
                           <p class="card-description">${excerpt}</p>
                           <div class="card-author">
                              By Admin &middot; ${dateStr}
                           </div>
                        </div>
                     </div>
                  `;
               }).join('')}
            </div>
         </div>
      </div>
    `;

    return this._layout(heroHtml + blogHtml, 'Home', ctx);
  },

  renderSingle(ctx: ThemeContext) {
    const p = ctx.data;
    if (!p) return this._layout('<div class="container text-center" style="padding:100px 0;"><h1>404 Not Found</h1></div>', '404', ctx);

    const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    
    // Hestia single posts usually have a large header image then the white card below.
    const headerHtml = `
      <div class="hero page-header" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${p.featured_image || 'https://placehold.co/1200x600/eee/999'}')">
         <div class="container text-center">
            <h1 class="hero-title">${p.title}</h1>
            <h4 class="hero-subtitle">By Admin &middot; ${dateStr}</h4>
         </div>
      </div>
    `;

    const contentHtml = `
      <div class="main main-raised">
         <div class="container">
            <div class="section">
               <div class="post-content">
                  ${p.body}
               </div>
            </div>
         </div>
      </div>
    `;

    return this._layout(headerHtml + contentHtml, p.title, ctx);
  },

  renderPage(ctx: ThemeContext) { 
     return this.renderSingle(ctx); 
  },
  
  render404(ctx: ThemeContext) { 
     return this._layout('<div class="container text-center" style="padding:150px 0;"><h1>404</h1><p>Page Not Found</p></div>', 'Not Found', ctx); 
  }
};

export default Hestia;
