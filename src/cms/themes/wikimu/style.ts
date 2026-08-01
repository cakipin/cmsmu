export const css = `
  :root {
      /* --- COLOR PALETTE (Fixed) --- */
      --mu-green-primary: #006C45;
      --mu-green-dark: #004d32;
      --mu-gold-accent: #FFD700;
      
      /* --- THEME VARIABLES (Dynamic) --- */
      --wiki-bg: #f6f7f8;
      --wiki-content-bg: #ffffff;
      --wiki-text: #202122;
      --wiki-text-muted: #54595d;
      --wiki-border: #a2a9b1;
      --wiki-link: #0645ad;
      --wiki-input-bg: rgba(255, 255, 255, 0.9);
      --wiki-sidebar-bg: #ffffff;
      --wiki-footer-bg: #f6f7f8;
      --shadow-color: rgba(0,0,0,0.05);
      --mobile-menu-color: #ffffff;
  }

  /* --- DARK MODE CONFIG (Optimized for Deep Black) --- */
  [data-theme="dark"] {
      --wiki-bg: #000000;            /* Hitam Pekat */
      --wiki-content-bg: #121212;    /* Abu-abu sangat gelap untuk kontainer utama */
      --wiki-text: #ffffff;          /* Putih murni */
      --wiki-text-muted: #a0a0a0;
      --wiki-border: #333333;        /* Border halus gelap */
      --wiki-link: #8ab4f8;          /* Biru terang agar kontras di hitam */
      --wiki-input-bg: #2d2d2d;
      --wiki-sidebar-bg: #121212;
      --wiki-footer-bg: #000000;
      --shadow-color: rgba(255,255,255,0.05);
  }

  /* BASE */
  body { 
      background-color: var(--wiki-bg); 
      font-family: sans-serif; 
      font-size: 0.9375rem; 
      color: var(--wiki-text); 
      margin: 0; 
      line-height: 1.6; 
      transition: background-color 0.3s ease, color 0.3s ease;
  }
  * { box-sizing: border-box; }

  /* TYPOGRAPHY */
  h1, h2, h3, h4 { 
      font-family: 'Linux Libertine', 'Georgia', serif; 
      color: var(--wiki-text);
      margin-top: 1em; margin-bottom: 0.5em; 
      font-weight: normal; line-height: 1.3;
  }
  h1 { font-size: 2rem; border-bottom: 1px solid var(--wiki-border); padding-bottom: 5px; margin-top: 0; }
  h2 { font-size: 1.5rem; border-bottom: 1px solid var(--wiki-border); padding-bottom: 5px; }
  
  a { color: var(--wiki-link); text-decoration: none; }
  a:hover { text-decoration: underline; }
  
  /* --- HEADER (GRADIENT) --- */
  .wiki-header {
      background: linear-gradient(90deg, #1B3A57 0%, #006C45 100%);
      border-bottom: 1px solid #004d32;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 55px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      color: white; 
  }

  /* Logo */
  .wiki-logo { display: flex; align-items: center; gap: 10px; color: #ffffff !important; text-decoration: none!important; }
  .brand-main { font-family: 'Linux Libertine', serif; font-size: 1.4rem; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .brand-sub { font-size: 0.6rem; text-transform: uppercase; color: var(--mu-gold-accent); letter-spacing: 0.5px; }
  
  /* Search */
  .wiki-search-container { flex-grow: 1; max-width: 400px; margin: 0 2rem; position: relative; }
  .wiki-search-input { 
      width: 100%; padding: 6px 12px 6px 32px; 
      border: 1px solid var(--wiki-border); border-radius: 4px; 
      font-size: 0.9rem; background: var(--wiki-input-bg); color: var(--wiki-text);
      outline: none;
  }
  .wiki-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--wiki-text-muted); font-size: 0.8rem; }

  /* Actions & Toggle */
  .header-actions { font-size: 0.8rem; display: flex; align-items: center; gap: 10px; }
  
  .theme-toggle {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
  }
  .signup-btn { 
      background: var(--mu-gold-accent); color: #004d32 !important; 
      padding: 5px 12px; border-radius: 3px; font-weight: bold; 
      text-decoration: none; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  /* LAYOUT */
  .wiki-container {
      display: grid;
      grid-template-columns: 176px minmax(0, 1fr) 250px; 
      gap: 1.5rem; max-width: 1400px; margin: 0 auto; padding: 1rem 1.5rem; align-items: start;
  }

  /* SIDEBAR (Desktop) */
  .wiki-sidebar nav { position: sticky; top: 70px; font-size: 0.85rem; }
  .wiki-nav-header { 
      font-weight: bold; color: var(--wiki-text-muted); 
      margin: 1rem 0 0.5rem 0; padding-bottom: 3px; border-bottom: 1px solid var(--wiki-border); 
  }
  .wiki-nav-link { display: block; padding: 4px 0; color: var(--wiki-link); }
  
  /* MAIN */
  .wiki-main { 
      background: var(--wiki-content-bg); padding: 1.5rem 2rem; 
      border: 1px solid var(--wiki-border); min-height: 80vh; 
      box-shadow: 0 1px 3px var(--shadow-color);
      color: var(--wiki-text); 
  }
  
  /* FOOTER */
  .wiki-footer { 
      margin-top: 2rem; padding: 2rem; border-top: 1px solid var(--wiki-border); 
      text-align: center; font-size: 0.8rem; color: var(--wiki-text-muted); background: var(--wiki-footer-bg); 
  }

  /* --- MOBILE FIXES --- */
  .mobile-menu-btn { 
      display: none; background: none; border: none; 
      font-size: 1.4rem; cursor: pointer; padding: 0 10px 0 0; 
      color: var(--mobile-menu-color); 
  }

  @media (max-width: 1024px) {
      .wiki-container { grid-template-columns: 1fr; padding: 0; gap: 0; }
      .wiki-header { padding: 0 1rem; }
      .brand-main { font-size: 1.2rem; }
      .brand-sub { display: none; }
      .wiki-search-container { display: none; }
      .mobile-menu-btn { display: block; }
      
      .wiki-sidebar { 
          display: none; 
          position: fixed; 
          top: 55px;
          left: 0; bottom: 0; width: 260px; 
          background: var(--wiki-sidebar-bg);
          z-index: 999; 
          padding: 20px; 
          border-right: 1px solid var(--wiki-border); 
          overflow-y: auto;
          box-shadow: 4px 0 10px rgba(0,0,0,0.1);
      }
      .wiki-sidebar.active { display: block; animation: slideIn 0.3s ease; }
      .wiki-main { border: none; padding: 1.5rem 1rem; }
  }

  @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
  }

  /* --- GLOBAL DARK MODE OPTIMIZATION (HOME, CATEGORY, TAG) --- */

  /* Judul Laman & Arsip */
  .archive-header h1, .page-header h1, .category-title, .tag-title, .entry-title, h1.entry-title {
      color: var(--wiki-text) !important;
      border-bottom: 1px solid var(--wiki-border) !important;
      padding-bottom: 10px;
  }

  /* Teks Deskripsi & Meta */
  .post-excerpt, .article-summary, .archive-description, .post-meta, .entry-meta, .article-meta, .wiki-main span, span.text-muted {
      color: var(--wiki-text-muted) !important;
  }

  /* Judul Artikel di List */
  .post-item h2 a, .article-list-item h2 a, .entry-title a, .wiki-main a h2, .wiki-main h2 a {
      color: var(--wiki-link) !important;
  }

  /* Garis Pemisah List */
  .post-item, .article-list-item, .archive-header, .page-header {
      border-bottom: 1px solid var(--wiki-border) !important;
  }

  /* Pagination */
  .pagination a, .nav-links a {
      background-color: var(--wiki-content-bg);
      color: var(--wiki-text);
      border: 1px solid var(--wiki-border);
  }
`;