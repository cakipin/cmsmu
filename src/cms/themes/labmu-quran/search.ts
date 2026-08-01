import type { ThemeContext } from '../types';

export const SearchLogic = {
  // Fungsi untuk eksekusi Query ke D1
  async execute(env: any, keyword: string) {
    if (!keyword || keyword.length < 3) return [];
    
    // Cari di teks Indonesia, Latin, atau Arab
    const { results } = await env.DB.prepare(`
      SELECT * FROM ayat 
      WHERE teksIndonesia LIKE ? 
      OR teksLatin LIKE ?
      LIMIT 50
    `).bind(`%${keyword}%`, `%${keyword}%`).all();
    
    return results;
  },

  // Fungsi untuk render tampilan hasil cari
  render(results: any[], keyword: string, ctx: ThemeContext, layout: any) {
    const html = `
      <div class="search-results-page">
        <div style="margin-bottom: 30px; border-bottom: 2px solid var(--primary); padding-bottom: 10px;">
            <h2 style="margin:0;">Hasil Pencarian: <span style="color:var(--primary);">"${keyword}"</span></h2>
            <p style="font-size:0.9rem; opacity:0.8;">Ditemukan ${results.length} ayat</p>
        </div>

        ${results.map((a: any) => `
          <div class="search-item" style="background:var(--bg-card); padding:20px; border-radius:12px; margin-bottom:20px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                <span class="ayat-badge" style="background:var(--primary); color:#fff; padding:2px 10px; border-radius:20px; font-size:0.8rem;">
                    Surah ${a.surahId} : Ayat ${a.nomorAyat}
                </span>
                <a href="/${a.surahId}#ayat-${a.nomorAyat}" style="text-decoration:none; color:var(--primary); font-weight:bold; font-size:0.8rem;">
                    Buka Surat <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
            <div class="ayat-arab" dir="rtl" style="font-size:1.6rem; line-height:2.5; margin-bottom:15px;">${a.teksArab}</div>
            <div style="font-size:0.9rem; color:var(--text-main); line-height:1.6;">${a.teksIndonesia}</div>
          </div>
        `).join('')}

        ${results.length === 0 ? `
          <div style="text-align:center; padding:50px 0;">
            <i class="fas fa-search" style="font-size:3rem; opacity:0.2; margin-bottom:20px;"></i>
            <p>Tema "${keyword}" tidak ditemukan di database ayat.</p>
            <a href="/" style="color:var(--primary); text-decoration:none;">Kembali ke Beranda</a>
          </div>
        ` : `
          <div style="text-align:center; margin-top:30px;">
            <a href="/" style="background:var(--primary); color:#fff; padding:10px 20px; border-radius:30px; text-decoration:none; font-weight:bold;">Selesai Mencari</a>
          </div>
        `}
      </div>
    `;
    return layout(html, `Cari: ${keyword}`, ctx);
  }
};