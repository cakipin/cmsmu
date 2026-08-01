import { renderLayout } from "./layout";

export const renderHome = (ctx: any) => {
    const posts = ctx.data || [];
    
    // Generate List Artikel
    const postsHtml = posts.map((p: any) => {
        const excerpt = (p.body || "").replace(/<[^>]+>/g, "").substring(0, 150) + "...";
        const category = p.category || "Umum";
        const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        return `
        <div class="post-card" style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <div style="font-size: 0.8rem; color: #006C45; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">
                <a href="/${catSlug}" style="text-decoration:none; color:inherit;">${category}</a>
            </div>
            <h3 style="font-family: 'Linux Libertine', serif; font-size: 1.4rem; margin: 0 0 10px 0;">
                <a href="/${p.slug}" style="text-decoration: none; color: #0645ad;">${p.title}</a>
            </h3>
            <p style="color: #444; font-size: 0.95rem; line-height: 1.6; margin: 0;">${excerpt}</p>
            <div style="font-size: 0.8rem; color: #888; margin-top: 8px;">
                ${new Date(p.created_at).toLocaleDateString("id-ID", {year:'numeric', month:'long', day:'numeric'})}
            </div>
        </div>
        `;
    }).join("");

    const content = `
        <div class="home-wrapper">
            <div style="background: #f0f7f4; padding: 30px; border-radius: 8px; margin-bottom: 40px; border-left: 5px solid #006C45;">
                <h1 style="margin: 0 0 10px 0; color: #006C45; font-family: 'Linux Libertine', serif;">Selamat Datang di Portal Tarjih</h1>
                <p style="margin: 0; font-size: 1.1rem; color: #333;">Ensiklopedia Digital Majelis Tarjih Muhammadiyah. Rujukan Islam berkemajuan.</p>
            </div>
            
            <h2 style="border-bottom: 2px solid #006C45; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.2rem;">Terbaru</h2>
            <div class="posts-list">
                ${postsHtml}
            </div>
        </div>
    `;

    return renderLayout("Halaman Utama", content, true);
};