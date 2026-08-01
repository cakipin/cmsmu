import type { ThemeContext } from '../../themes/types';

// --- 1. HEADER DENGAN LOGO ---
export const renderHeader = (ctx: ThemeContext) => `
  <header class="pro-header">
    <div class="container header-inner">
      <a href="/" class="logo">
        <i class="fas fa-layer-group"></i> 
        <span>${ctx.site.title}</span>
      </a>
      <nav class="nav-menu">
        <a href="/">Home</a>
        <a href="#">Features</a>
        <a href="#">Blog</a>
        <a href="#">About</a>
        <a href="#" style="background:var(--primary); color:white; padding:8px 18px; border-radius:50px;">Contact</a>
      </nav>
    </div>
  </header>
`;

// --- 2. HERO SECTION (CUSTOM HOME) ---
export const renderHero = (ctx: ThemeContext) => `
  <section class="hero-section">
    <div class="container">
      <h1 class="hero-title">Bangun Web Impian dengan LabMu</h1>
      <p class="hero-subtitle">Tema profesional dengan desain modern, cepat, dan mudah disesuaikan. Cocok untuk blog, portofolio, dan bisnis.</p>
      <a href="#" class="btn-hero">Mulai Sekarang &rarr;</a>
    </div>
  </section>
`;

// --- 3. CUSTOM SIDEBAR ---
export const renderSidebar = (posts: any[]) => `
  <aside>
    <div class="widget">
      <div style="text-align:center;">
        <img src="https://ui-avatars.com/api/?name=Admin+LabMu&background=random" style="width:80px; height:80px; border-radius:50%; margin:0 auto 15px;">
        <h4 style="margin:0;">Admin LabMu</h4>
        <p style="font-size:0.9rem; color:#64748b; margin-top:5px;">Web Developer & Content Creator.</p>
      </div>
    </div>

    <div class="widget">
      <h4 class="widget-title">Terpopuler</h4>
      <ul class="widget-list">
        ${posts.slice(0, 3).map(p => `
          <li>
            <img src="${p.featured_image || 'https://via.placeholder.com/150'}" class="mini-thumb">
            <div>
              <a href="/${p.slug}" style="font-weight:600; line-height:1.2; display:block; font-size:0.9rem;">${p.title}</a>
              <small style="color:#94a3b8;">${new Date(p.created_at).toLocaleDateString()}</small>
            </div>
          </li>
        `).join('')}
      </ul>
    </div>

    <div class="widget">
      <h4 class="widget-title">Tags</h4>
      <div style="display:flex; flex-wrap:wrap; gap:5px;">
         <span style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Teknologi</span>
         <span style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Coding</span>
         <span style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Bisnis</span>
      </div>
    </div>
  </aside>
`;

// --- 4. FOOTER DENGAN 3 KOLOM ---
export const renderFooter = (ctx: ThemeContext) => `
  <footer class="pro-footer">
    <div class="container">
      <div class="grid-3 footer-grid">
        <div class="footer-col">
           <h4>Tentang Kami</h4>
           <p style="opacity:0.8; font-size:0.95rem;">${ctx.site.description}</p>
        </div>
        <div class="footer-col">
           <h4>Quick Links</h4>
           <ul class="widget-list footer-links" style="border:none;">
              <li><a href="/">Home</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
           </ul>
        </div>
        <div class="footer-col">
           <h4>Newsletter</h4>
           <p style="margin-bottom:15px; font-size:0.9rem;">Dapatkan update terbaru.</p>
           <input placeholder="Email Anda..." style="width:100%; padding:10px; border-radius:4px; border:none; margin-bottom:10px;">
           <button style="width:100%; padding:10px; background:var(--primary); color:white; border:none; border-radius:4px; cursor:pointer;">Subscribe</button>
        </div>
      </div>
      <div class="footer-bottom">
         &copy; ${new Date().getFullYear()} ${ctx.site.title}. All rights reserved. Built with LabMu CMS.
      </div>
    </div>
  </footer>
`;