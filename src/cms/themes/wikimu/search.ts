import { renderLayout } from "./layout";

export const renderSearch = (ctx: any) => {
    const query = ctx.query || "";
    const posts = ctx.data || [];
    const pag = ctx.pagination || { currentPage: 1, totalPages: 1 };
    
    const metaData = {
        title: `Pencarian: ${query} - Halaman ${pag.currentPage}`,
        description: `Hasil pencarian untuk kata kunci ${query}`,
        url: `/search?q=${encodeURIComponent(query)}`
    };

    // --- JIKA KOSONG ---
    if (posts.length === 0) {
        // (Kode bagian kosong TETAP SAMA seperti sebelumnya, copy paste saja bagian "JIKA TIDAK ADA HASIL")
        const emptyHtml = `
        <div style="max-width: 600px; margin: 50px auto; text-align: center;">
            <div style="font-size: 4rem; color: #ddd; margin-bottom: 20px;"><i class="fas fa-search"></i></div>
            <h2 style="margin-bottom: 10px; color: #333;">Tidak ditemukan</h2>
            <p style="color: #666; margin-bottom: 30px;">Tidak ada hasil untuk <strong>"${query}"</strong>.</p>
            <form action="/search" method="GET" style="position: relative;">
                <input type="text" name="q" value="${query}" style="width: 100%; padding: 12px 20px; border: 2px solid #eee; border-radius: 50px; outline: none;">
                <button type="submit" style="position: absolute; right: 5px; top: 5px; background: var(--mu-green-primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;"><i class="fas fa-arrow-right"></i></button>
            </form>
        </div>`;
        return renderLayout(`Tidak Ditemukan: ${query}`, emptyHtml, true, metaData);
    }

    // --- RENDER LIST ARTIKEL ---
    const resultsHtml = posts.map((p: any) => {
        const rawBody = p.body || "";
        const cleanBody = rawBody.replace(/<[^>]+>/g, "").substring(0, 180) + "...";
        const href = `/${p.slug}`;
        const category = p.category || "Umum";
        const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return `
        <div class="search-result-item" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #eee;">
            <div style="font-size: 0.85rem; color: #006C45; margin-bottom: 4px;">
                <a href="/${catSlug}" style="text-decoration: none; color: inherit;">${category}</a> 
                <span style="color: #ccc;">&rsaquo;</span> 
                <span style="color: #666;">${new Date(p.created_at).toLocaleDateString("id-ID", {year:'numeric', month:'short', day:'numeric'})}</span>
            </div>
            <h3 style="margin: 0 0 8px 0; font-family: 'Linux Libertine', serif; font-size: 1.3rem;">
                <a href="${href}" style="color: #1a0dab; text-decoration: none;">${p.title}</a>
            </h3>
            <p style="margin: 0; color: #4d5156; font-size: 0.95rem; line-height: 1.6;">${cleanBody}</p>
        </div>
        `;
    }).join("");

    // --- PAGINATION CONTROLS (BARU) ---
    let paginationHtml = '';
    if (pag.totalPages > 1) {
        const prevLink = pag.hasPrev ? `/search?q=${encodeURIComponent(query)}&page=${pag.currentPage - 1}` : '#';
        const nextLink = pag.hasNext ? `/search?q=${encodeURIComponent(query)}&page=${pag.currentPage + 1}` : '#';
        
        paginationHtml = `
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 15px;">
            ${pag.hasPrev ? 
                `<a href="${prevLink}" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; background: #fff;">&laquo; Sebelumnya</a>` 
                : 
                `<span style="padding: 8px 16px; border: 1px solid #eee; border-radius: 4px; color: #ccc; cursor: not-allowed;">&laquo; Sebelumnya</span>`
            }
            
            <span style="font-size: 0.9rem; color: #666;">
                Halaman <strong>${pag.currentPage}</strong> dari <strong>${pag.totalPages}</strong>
            </span>

            ${pag.hasNext ? 
                `<a href="${nextLink}" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; background: #fff;">Berikutnya &raquo;</a>` 
                : 
                `<span style="padding: 8px 16px; border: 1px solid #eee; border-radius: 4px; color: #ccc; cursor: not-allowed;">Berikutnya &raquo;</span>`
            }
        </div>
        `;
    }

    const content = `
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                <h1 style="font-size: 1.5rem; margin: 0; color: #333;">
                    Hasil pencarian: <span style="color: var(--mu-green-primary); font-style: italic;">"${query}"</span>
                </h1>
                <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #777;">
                    Ditemukan sekira ${pag.totalItems} artikel.
                </p>
            </div>

            <div class="search-results-list">
                ${resultsHtml}
            </div>
            
            ${paginationHtml}
        </div>
    `;

    return renderLayout(`Pencarian: ${query}`, content, true, metaData);
};