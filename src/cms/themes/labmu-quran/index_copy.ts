import { renderHeader } from './header';
import { renderHome, renderSearch, renderSingle } from './pages';
import { clientScripts } from './scripts';
// Import 'css' dari style.ts
import { css } from './style'; 

// --- LAYOUT UTAMA (SHELL HTML) ---
const _layout = (content: string, title: string, ctx: any) => {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - QuranMu</title>
  <meta name="description" content="Al-Quran Digital Lengkap dengan Terjemahan dan Audio">
  
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    ${css || ''}
  </style>
</head>
<body class="${ctx.site?.theme === 'dark' ? 'dark' : ''}">
  
  ${renderHeader(ctx)}

  <main class="main-content">
    <div class="quran-container">
       ${content}
    </div>
  </main>

  <footer class="labmu-footer">
    &copy; 2026 LabMu CMS • Quran Digital
  </footer>

  ${clientScripts}

</body>
</html>`;
};

// --- RENDERER 404 ---
const render404 = (ctx: any) => _layout(`
  <div style="text-align:center; padding:80px 20px;">
    <h1 style="font-size:3rem; color:var(--primary); margin-bottom:10px;">404</h1>
    <p style="color:var(--text-muted); margin-bottom:30px;">Halaman yang Anda cari tidak ditemukan.</p>
    <a href="/" style="display:inline-block; padding:10px 25px; background:var(--primary); color:#fff; text-decoration:none; border-radius:30px; font-weight:bold;">Kembali ke Beranda</a>
  </div>
`, 'Tidak Ditemukan', ctx);

// --- EXPORT DEFAULT (INI YANG HILANG SEBELUMNYA) ---
const LabMuQuran = {
  renderHome: (ctx: any) => renderHome(ctx, _layout),
  renderSearch: (results: any, q: string, ctx: any) => renderSearch(results, q, ctx, _layout),
  renderSingle: (ctx: any) => renderSingle(ctx, _layout),
  render404: (ctx: any) => render404(ctx)
};

export default LabMuQuran;