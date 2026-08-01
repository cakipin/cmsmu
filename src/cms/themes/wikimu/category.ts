import { renderLayout } from "./layout";

export const renderCategory = (ctx: any) => {
    const title = ctx.categoryName || "Arsip";
    const posts = ctx.data || [];

    let listHtml = "";
    
    if (posts.length === 0) {
        listHtml = `<div style="padding: 40px 0; text-align: center; color: #666;">Belum ada artikel di kategori ini.</div>`;
    } else {
        listHtml = posts.map((p: any) => {
            const excerpt = (p.body || "").replace(/<[^>]+>/g, "").substring(0, 160) + "...";
            return `
            <div style="display: flex; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 25px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px 0; font-family: 'Linux Libertine', serif; font-size: 1.3rem;">
                        <a href="/${p.slug}" style="color: #0645ad; text-decoration: none;">${p.title}</a>
                    </h3>
                    <div style="font-size: 0.8rem; color: #666; margin-bottom: 8px;">
                        <i class="far fa-clock"></i> ${new Date(p.created_at).toLocaleDateString("id-ID", {year:'numeric', month:'short', day:'numeric'})}
                    </div>
                    <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: #333;">${excerpt}</p>
                </div>
            </div>`;
        }).join("");
    }

    const content = `
        <div class="category-header" style="margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 15px;">
            <span style="font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Kumpulan Artikel</span>
            <h1 style="margin: 5px 0 0 0; font-family: 'Linux Libertine', serif; font-size: 2.2rem; color: #333;">${title}</h1>
        </div>
        <div class="category-list">
            ${listHtml}
        </div>
    `;

    return renderLayout(title, content, true);
};