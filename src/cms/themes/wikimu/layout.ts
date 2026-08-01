// src/themes/wikimu/layout.ts
import { css } from './style';
import { renderTools } from './components';
import { renderHeader } from './header';
// 1. Import Widget Chat Baru
import { renderChatWidget } from './chat-widget'; 

export const renderLayout = (title: string, content: string, showTools: boolean = true, metaData: any = {}) => {
  const siteTitle = "Ensiklopedia Tarjih";
  const description = metaData.description || "Ensiklopedia digital Fatwa, Kajian, dan Manhaj Tarjih Muhammadiyah.";
  const image = metaData.image || "https://muhammadiyah.or.id/wp-content/uploads/2022/03/Logo-Muhammadiyah-Png-Warna.png";
  const url = metaData.url || "";

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${title} - ${siteTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">

    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="${siteTitle}">

    <style>${css}</style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Linux+Libertine:wght@400;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>

    ${renderHeader()}

    <div class="wiki-container">
        
        <aside class="wiki-sidebar" id="wiki-sidebar">
            <nav>
                <div class="wiki-nav-header">Navigasi</div>
                <a href="/" class="wiki-nav-link"><i class="fas fa-home"></i> Halaman Utama</a>
                <a href="/daftar-isi" class="wiki-nav-link"><i class="fas fa-list"></i> Daftar Isi</a>
                <a href="/indeks-fatwa" class="wiki-nav-link"><i class="fas fa-book"></i> Indeks Fatwa</a>
                
                <div class="wiki-nav-header">Kajian</div>
                <a href="/aqidah" class="wiki-nav-link">Aqidah</a>
                <a href="/ibadah" class="wiki-nav-link">Ibadah</a>
                <a href="/akhlak" class="wiki-nav-link">Akhlak</a>
                <a href="/muamalah" class="wiki-nav-link">Muamalah</a>

                <div class="wiki-nav-header">Majelis</div>
                <a href="/tentang" class="wiki-nav-link">Tentang Tarjih</a>
                <a href="/manhaj" class="wiki-nav-link">Manhaj</a>
            </nav>
        </aside>

        <main class="wiki-main">
            ${content}
        </main>

        ${showTools ? renderTools() : ''}

    </div>

    <footer class="wiki-footer">
        <p>Halaman ini terakhir diubah pada ${new Date().toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}.</p>
        <p><a href="#">Kebijakan Privasi</a> • <a href="/">Tentang Tarjih Muhammadiyah</a></p>
        <div class="footer-credit">Ditenagai oleh LabMu CMS</div>
    </footer>

    ${renderChatWidget()}

    <script>
        // Script untuk Mobile Menu
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const sidebar = document.getElementById('wiki-sidebar');
            if(sidebar) sidebar.classList.toggle('active');
        });
    </script>

</body>
</html>`;
};