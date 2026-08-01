// FUNGSI HOMEPAGE
export function renderHome(settings: any, posts: any[], menus: any[] = []) {
    const title = settings.site_title || 'LabMu CMS';
    const desc = settings.site_desc || 'Welcome';
    const favicon = settings.site_favicon || ''; 
    const logo = settings.site_logo || ''; 
    const safeMenus = Array.isArray(menus) ? menus : [];

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <meta name="description" content="${desc}">
        ${favicon ? `<link rel="icon" href="${favicon}">` : ''}

        <style>
            /* Reset & Global */
            * { box-sizing: border-box; }
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 1000px; margin: 0 auto; background: #f4f6f8; color: #333; line-height: 1.6; }
            a { text-decoration: none; color: inherit; transition: 0.3s; }
            
            header { background: #fff; padding: 15px 30px; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
            
            .brand { display: flex; align-items: center; gap: 15px; }
            .brand img { height: 40px; width: auto; }
            .brand h1 { font-size: 20px; font-weight: 700; margin: 0; color: #2c3e50; }
            
            nav ul { list-style: none; padding: 0; margin: 0; display: flex; gap: 20px; }
            nav a { font-size: 14px; font-weight: 600; color: #555; text-transform: uppercase; padding: 8px 0; }
            nav a:hover { color: #3498db; border-bottom: 2px solid #3498db; }

            .hero { text-align: center; padding: 60px 20px; background: #fff; margin-bottom: 30px; border-radius: 0 0 10px 10px; }
            .hero h2 { font-size: 2.5rem; margin: 0 0 10px 0; color: #2c3e50; }
            .hero p { color: #7f8c8d; font-size: 1.1rem; }

            main { padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; margin-bottom: 60px; }
            
            article { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 15px rgba(0,0,0,0.05); transition: transform 0.2s; display: flex; flex-direction: column; }
            article:hover { transform: translateY(-5px); }
            
            .thumb { width: 100%; height: 200px; object-fit: cover; }
            .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
            .card-body h2 { font-size: 18px; margin: 0 0 10px 0; line-height: 1.4; }
            .card-body h2 a:hover { color: #3498db; }
            .card-meta { font-size: 12px; color: #999; margin-bottom: 15px; }
            .card-excerpt { font-size: 14px; color: #666; margin-bottom: 20px; flex: 1; }
            .btn-read { margin-top: auto; display: inline-block; font-size: 13px; font-weight: bold; color: #3498db; }

            footer { text-align: center; padding: 40px; color: #999; font-size: 13px; border-top: 1px solid #ddd; background: #fff; margin-top: 40px; }

            @media (max-width: 768px) {
                header { flex-direction: column; gap: 15px; padding: 20px; }
                nav ul { flex-wrap: wrap; justify-content: center; }
            }
        </style>
    </head>
    <body>

        <header>
            <div class="brand">
                ${logo ? `<img src="${logo}" alt="${title}">` : ''}
                ${!logo ? `<h1>${title}</h1>` : ''}
            </div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    ${safeMenus.map((m: any) => `<li><a href="${m.url}">${m.label}</a></li>`).join('')}
                </ul>
            </nav>
        </header>

        <div class="hero">
            ${logo ? '' : `<h2>${title}</h2>`} 
            <p>${desc}</p>
        </div>

        <main>
            ${posts && posts.length > 0 ? posts.map((p: any) => `
                <article>
                    ${p.featured_image ? `<a href="/${p.slug}"><img src="${p.featured_image}" class="thumb" loading="lazy"></a>` : ''}
                    <div class="card-body">
                        <h2><a href="/${p.slug}">${p.title}</a></h2>
                        <div class="card-meta">${new Date(p.created_at).toLocaleDateString()}</div>
                        <div class="card-excerpt">${p.body.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</div>
                        
                        <a href="/${p.slug}" class="btn-read">BACA SELENGKAPNYA &rarr;</a>
                    </div>
                </article>
            `).join('') : '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#999;">Belum ada postingan.</div>'}
        </main>

        <footer>
            &copy; ${new Date().getFullYear()} ${title}. Powered by LabMu CMS.
        </footer>
    </body>
    </html>
    `;
}

// FUNGSI DETAIL POST
export function renderSingle(settings: any, post: any, menus: any[] = []) {
    const title = settings.site_title || 'LabMu CMS';
    const favicon = settings.site_favicon || '';
    const logo = settings.site_logo || '';
    const safeMenus = Array.isArray(menus) ? menus : [];

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title} - ${title}</title>
        ${favicon ? `<link rel="icon" href="${favicon}">` : ''}
        <style>
             * { box-sizing: border-box; }
             body { font-family: 'Segoe UI', Roboto, sans-serif; max-width: 1000px; margin: 0 auto; background: #f4f6f8; color: #333; line-height: 1.8; }
             a { text-decoration: none; color: inherit; }

             header { background: #fff; padding: 15px 30px; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
             .brand { display: flex; align-items: center; gap: 15px; }
             .brand img { height: 40px; width: auto; }
             .brand h1 { font-size: 20px; font-weight: 700; margin: 0; color: #2c3e50; }
             nav ul { list-style: none; padding: 0; margin: 0; display: flex; gap: 20px; }
             nav a { font-size: 14px; font-weight: 600; color: #555; text-transform: uppercase; }
             nav a:hover { color: #3498db; border-bottom: 2px solid #3498db; }

             .post-container { max-width: 800px; margin: 30px auto; background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
             
             h1.post-title { font-size: 32px; margin: 0 0 10px 0; color: #2c3e50; line-height: 1.2; }
             .post-meta { font-size: 14px; color: #999; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
             
             .featured-img { width: 100%; height: auto; border-radius: 8px; margin-bottom: 30px; display: block; }
             
             .content { font-size: 18px; color: #444; }
             .content p { margin-bottom: 20px; }
             .content img { max-width: 100%; height: auto; border-radius: 5px; margin: 20px 0; }
             
             footer { text-align: center; padding: 40px; color: #999; font-size: 13px; margin-top: 50px; border-top: 1px solid #ddd; }
             
             @media (max-width: 768px) {
                header { flex-direction: column; gap: 15px; }
                .post-container { padding: 20px; margin: 15px; }
                h1.post-title { font-size: 24px; }
             }
        </style>
    </head>
    <body>
        
        <header>
            <div class="brand">
                <a href="/">
                    ${logo ? `<img src="${logo}" alt="${title}">` : `<h1>${title}</h1>`}
                </a>
            </div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    ${safeMenus.map((m: any) => `<li><a href="${m.url}">${m.label}</a></li>`).join('')}
                </ul>
            </nav>
        </header>

        <article class="post-container">
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                Oleh Admin • ${new Date(post.created_at).toLocaleDateString()}
            </div>

            ${post.featured_image ? `
                <img src="${post.featured_image}" class="featured-img" alt="${post.title}">
            ` : ''}

            <div class="content">
                ${post.body}
            </div>
        </article>

        <footer>
            &copy; ${new Date().getFullYear()} ${title}.
        </footer>
    </body>
    </html>
    `;
}