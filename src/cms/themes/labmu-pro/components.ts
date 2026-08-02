import type { ThemeContext } from '../../themes/types';

// --- 1. HEADER (DENGAN BURGER MENU & DROPDOWN) ---
export const renderHeader = (ctx: ThemeContext) => {
  const logoContent = ctx.site?.header_logo_url 
    ? `<img src="${ctx.site.header_logo_url}" alt="${ctx.site.title} Logo" style="max-height: 40px;">` 
    : `<i class="fas fa-layer-group"></i> <span>${ctx.site.title}</span>`;
  
  const textStyle = `color: ${ctx.site?.header_text_color || 'var(--header-text)'} !important;`;
  
  let menuWrapperStyle = '';
  if (ctx.site?.header_menu_position === 'center') {
    menuWrapperStyle = 'margin: 0 auto;';
  } else if (ctx.site?.header_menu_position === 'left') {
    menuWrapperStyle = 'margin-right: auto; margin-left: 2rem;';
  }

  return `
  <header class="pro-header">
    <div class="container header-inner">
      <a href="/" class="logo" style="${textStyle}">
        ${logoContent}
      </a>
      
      <!-- Desktop Menu -->
      <nav class="nav-menu" style="${menuWrapperStyle}">
        <a href="/" class="nav-link" style="${textStyle}">Home</a>
        <div class="dropdown">
          <a href="#" class="nav-link" style="${textStyle}">Features <i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:4px;"></i></a>
          <div class="dropdown-content">
            <a href="#">Layout Options</a>
            <a href="#">UI Components</a>
            <a href="#">Typography</a>
          </div>
        </div>
        <a href="#" class="nav-link" style="${textStyle}">Blog</a>
        <a href="#" class="nav-link" style="${textStyle}">About</a>
        <a href="#" class="btn btn-primary" style="padding: 0.5rem 1.25rem; color: white !important;">Contact</a>
        <button class="theme-toggle" id="themeToggleBtn" aria-label="Toggle Dark Mode" style="${textStyle}; background:none; border:none; font-size:1.2rem; cursor:pointer;">
           <i class="fas fa-moon icon-moon"></i>
           <i class="fas fa-sun icon-sun" style="display:none;"></i>
        </button>
      </nav>

      <!-- Mobile Burger Button -->
      <button class="burger-btn" id="burgerBtn" aria-label="Toggle Menu" style="${textStyle}">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </header>

  <!-- Mobile Off-Canvas Menu -->
  <div class="mobile-menu" id="mobileMenu">
    <a href="/" class="nav-link">Home</a>
    <a href="#" class="nav-link">Features</a>
    <a href="#" class="nav-link">Blog</a>
    <a href="#" class="nav-link">About</a>
    <a href="#" class="btn btn-primary" style="text-align:center;">Contact</a>
    <button class="btn btn-outline theme-toggle" id="mobileThemeToggleBtn" style="justify-content:center;">
       <i class="fas fa-moon icon-moon"></i>
       <i class="fas fa-sun icon-sun"></i> 
       <span style="margin-left:8px;">Toggle Theme</span>
    </button>
  </div>
`;
};

// --- 2. HERO SECTION ---
export const renderHero = (ctx: ThemeContext) => `
  <section class="hero-section">
    <div class="container">
      <h1 class="hero-title">Starter Framework LabMu Pro</h1>
      <p class="hero-subtitle">Tema boilerplate modern dengan Grid, Dark Mode, Komponen UI interaktif, dan optimasi performa tinggi untuk membangun web yang cepat.</p>
      <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
         <a href="/admin" class="btn-hero">Mulai Sekarang &rarr;</a>
         <a href="#" class="btn btn-outline" style="color:white; border-color:white;">Lihat Dokumentasi</a>
      </div>
    </div>
  </section>
`;

// --- 3. CUSTOM SIDEBAR ---
export const renderSidebar = (posts: any[]) => `
  <aside>
    <!-- Hook: before_sidebar -->
    <div class="widget">
      <div style="text-align:center;">
        <img src="https://ui-avatars.com/api/?name=Admin+LabMu&background=random" style="width:80px; height:80px; border-radius:50%; margin:0 auto 15px;" loading="lazy" alt="Admin Profile">
        <h4 style="margin:0;">Admin LabMu</h4>
        <p style="font-size:var(--text-sm); color:var(--text-muted); margin-top:5px;">Web Developer & Content Creator.</p>
      </div>
    </div>

    <div class="widget">
      <h4 class="widget-title">Terpopuler</h4>
      <ul class="widget-list">
        ${posts.slice(0, 3).map(p => `
          <li>
            <img src="${p.featured_image || 'https://placehold.co/150'}" class="mini-thumb" loading="lazy" alt="${p.title}">
            <div>
              <a href="/${p.slug}" style="font-weight:600; line-height:1.2; display:block; font-size:var(--text-sm);">${p.title}</a>
              <small style="color:var(--text-muted);">${new Date(p.created_at).toLocaleDateString()}</small>
            </div>
          </li>
        `).join('')}
      </ul>
    </div>

    <div class="widget">
      <h4 class="widget-title">Tags</h4>
      <div style="display:flex; flex-wrap:wrap; gap:5px;">
         <a href="/search?q=teknologi" style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Teknologi</a>
         <a href="/search?q=coding" style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Coding</a>
         <a href="/search?q=bisnis" style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Bisnis</a>
      </div>
    </div>
    <!-- Hook: after_sidebar -->
  </aside>
`;

// --- 4. FOOTER ---
export const renderFooter = (ctx: ThemeContext) => `
  <footer class="pro-footer">
    <!-- Hook: before_footer -->
    <div class="container">
      <div class="grid lg:grid-cols-4 md:grid-cols-2 footer-grid">
        <div class="footer-col" style="grid-column: span 1;">
           <a href="/" class="logo" style="color:white; margin-bottom:1rem; display:inline-flex;">
             <i class="fas fa-layer-group"></i> LabMu Pro
           </a>
           <p style="opacity:0.8; font-size:var(--text-sm); margin-bottom:1rem;">${ctx.site.description}</p>
           <div class="social-share" style="border:none; padding:0; margin:0;">
             <a href="#" class="share-btn share-fb" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
             <a href="#" class="share-btn share-tw" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
             <a href="#" class="share-btn share-wa" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
           </div>
        </div>
        
        <div class="footer-col">
           <h4>Perusahaan</h4>
           <ul class="footer-links">
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Karir</a></li>
              <li><a href="#">Hubungi Kami</a></li>
              <li><a href="#">Mitra</a></li>
           </ul>
        </div>

        <div class="footer-col">
           <h4>Bantuan</h4>
           <ul class="widget-list footer-links" style="border:none;">
              <li><a href="/">Home</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-of-service">Terms of Service</a></li>
           </ul>   <li><a href="#">FAQ</a></li>
           </ul>
        </div>
        
        <div class="footer-col">
           <h4>Newsletter</h4>
           <p style="margin-bottom:15px; font-size:var(--text-sm);">Dapatkan update terbaru seputar pengembangan web.</p>
           <form class="form-group" onsubmit="event.preventDefault(); alert('Ini adalah dummy newsletter form.');">
              <input type="email" class="form-control" placeholder="Email Anda..." style="margin-bottom:10px;" required>
              <button type="submit" class="btn btn-primary" style="width:100%;">Subscribe</button>
           </form>
        </div>
      </div>
      
      <div class="footer-bottom">
         &copy; ${new Date().getFullYear()} ${ctx.site.title}. All rights reserved. Built with LabMu CMS Framework.
      </div>
    </div>
    <!-- Hook: after_footer -->
  </footer>
`;

// --- 5. BREADCRUMBS HELPER ---
export const renderBreadcrumbs = (items: {label: string, url?: string}[]) => `
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/"><i class="fas fa-home"></i> Home</a>
    ${items.map(item => `
      <span class="breadcrumb-separator"><i class="fas fa-chevron-right" style="font-size:0.7em;"></i></span>
      ${item.url ? `<a href="${item.url}">${item.label}</a>` : `<span style="color:var(--text-main); font-weight:600;" aria-current="page">${item.label}</span>`}
    `).join('')}
  </nav>
`;

// --- 6. SOCIAL SHARE HELPER ---
export const renderShareButtons = (url: string, title: string) => `
  <div class="social-share">
    <span style="font-weight:600; font-size:var(--text-sm); margin-right:10px;">Share:</span>
    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-btn share-fb" aria-label="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" class="share-btn share-tw" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></a>
    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}" target="_blank" class="share-btn share-wa" aria-label="Share on WhatsApp"><i class="fab fa-whatsapp"></i></a>
  </div>
`;