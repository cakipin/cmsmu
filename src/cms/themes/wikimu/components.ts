// wikimu/components.ts

export const renderWelcomeBanner = (count: number) => `
    <div class="welcome-banner" role="banner">
        <div style="flex-shrink: 0; text-align: center;">
            <i class="fas fa-book-open-reader" style="font-size: 3rem; color: var(--mu-green-primary); opacity: 0.9;"></i>
        </div>
        <div>
            <h1 class="welcome-title">Selamat datang di Portal Tarjih,</h1>
            <div class="welcome-subtitle">
                Ensiklopedia digital <b>Majelis Tarjih Muhammadiyah</b>. 
                Platform rujukan Islam berkemajuan yang memuat fatwa, kajian, dan tuntunan ibadah.
            </div>
            <div style="font-size: 0.85rem; margin-top: 8px; color: #54595d;">
                <i class="fas fa-database"></i> Indeks saat ini: <b style="color: var(--mu-green-primary);">${count}</b> artikel rujukan.
            </div>
        </div>
    </div>
`;

export const renderInfobox = (post: any) => {
    const image = post.featured_image;
    return `
    <aside class="infobox" style="border: 1px solid #a2a9b1; background-color: #f8f9fa; float: right; clear: right; margin: 0 0 1em 1em; width: 300px; max-width: 100%; font-size: 0.9rem;">
        <div style="background: #e8f5e9; color: #000; text-align: center; font-weight: bold; padding: 0.5em; border-bottom: 1px solid #a2a9b1; font-family: serif; font-size: 1.1em;">${post.title}</div>
        ${image ? `<div style="text-align: center; padding: 5px; background:#fff;"><img src="${image}" alt="${post.title}" style="max-width: 100%; height: auto;"></div>` : ''}
        <table style="width: 100%; border-collapse: collapse;">
            <tr><th style="text-align: left; padding: 5px 10px;">Bidang</th><td style="padding: 5px 10px;">${post.category || 'Fatwa'}</td></tr>
            <tr><th style="text-align: left; padding: 5px 10px;">Status</th><td style="padding: 5px 10px;">Putusan Tarjih</td></tr>
            <tr><th style="text-align: left; padding: 5px 10px;">Tahun</th><td style="padding: 5px 10px;">${new Date(post.created_at).getFullYear()}</td></tr>
        </table>
    </aside>
    `;
};

export const renderArticleCard = (p: any) => {
    const excerpt = (p.body || '').replace(/<[^>]*>?/gm, '').substring(0, 160);
    const href = p.slug ? `/${p.slug}` : `/post/${p.id}`;
    const category = p.category || 'Fatwa';
    // Buat slug kategori
    const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return `
    <article class="article-card">
        <h3 style="font-size: 1.2rem; margin: 0; font-family: 'Linux Libertine', serif;">
            <a href="${href}" title="${p.title}" style="color: #0645ad;">${p.title}</a>
        </h3>
        <div class="article-meta" style="font-size: 0.8rem; color: #54595d; margin-bottom:5px;">
           <a href="/${catSlug}" style="color: #006C45; font-weight:600; text-decoration:none;">${category}</a> 
           &ndash; ${new Date(p.created_at).toLocaleDateString('id-ID', {year:'numeric', month:'short', day:'numeric'})}
        </div>
        <p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #202122;">
            ${excerpt}...
        </p>
    </article>
    `;
};

export const renderTools = () => `
    <aside class="wiki-tools" style="width: 250px;">
        <div class="tool-box">
            <span class="tool-header"><i class="fas fa-book"></i> Pustaka Tarjih</span>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem; line-height: 1.8;">
                <li><a href="https://muhammadiyah.or.id" target="_blank">Muhammadiyah Pusat</a></li>
                <li><a href="https://tarjih.or.id" target="_blank">Majelis Tarjih</a></li>
            </ul>
        </div>
        
        
    </aside>
`;