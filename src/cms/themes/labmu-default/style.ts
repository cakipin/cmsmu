export const css = `
  /* === GOOGLE FONTS === */
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  /* === CSS VARIABLES (bisa dioverride dari Settings) === */
  :root {
    --primary: var(--cms-primary, #2271b1);
    --primary-dark: var(--cms-primary-dark, #135e96);
    --bg: var(--cms-bg, #ffffff);
    --text: var(--cms-text, #1a1a2e);
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --surface: #f9fafb;
    --surface-hover: #f3f4f6;
    --accent: var(--cms-accent, #f0f7ff);
    --radius: 10px;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
    --shadow-hover: 0 4px 12px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.06);
  }

  /* === RESET & BASE === */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: var(--text);
    background: var(--surface);
    -webkit-font-smoothing: antialiased;
  }

  /* === LAYOUT === */
  .site-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
  .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  main { flex: 1; padding: 40px 0 60px; }

  /* === HEADER === */
  .site-header {
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 1px 8px rgba(0,0,0,0.05);
  }
  .header-inner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; gap: 20px;
  }
  .site-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .site-brand img { height: 40px; width: auto; border-radius: 6px; }
  .site-brand-text {}
  .site-title {
    font-size: 1.2rem; font-weight: 800; color: var(--primary);
    text-decoration: none; letter-spacing: -0.3px; display: block;
    transition: color 0.2s;
  }
  .site-title:hover { color: var(--primary-dark); }
  .site-tagline { font-size: 0.78rem; color: var(--text-muted); margin-top: 1px; }

  /* === NAVIGATION === */
  .main-nav { display: flex; align-items: center; }
  .nav-menu { list-style: none; display: flex; gap: 4px; align-items: center; }
  .menu-item a {
    display: block; padding: 7px 14px;
    text-decoration: none; color: var(--text-muted);
    font-size: 0.9rem; font-weight: 600; border-radius: 8px;
    transition: all 0.15s;
  }
  .menu-item a:hover { background: var(--accent); color: var(--primary); }

  /* === HERO (Home) === */
  .home-hero {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: #fff; padding: 50px 0 40px; margin-bottom: 40px;
  }
  .home-hero h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
  .home-hero p { font-size: 1rem; opacity: 0.85; }

  /* === POST GRID === */
  .post-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }
  .post-card {
    background: var(--bg); border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex; flex-direction: column;
  }
  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }
  .post-card-img {
    width: 100%; height: 200px; object-fit: cover;
    background: var(--surface);
    display: block;
  }
  .post-card-img-placeholder {
    width: 100%; height: 200px; background: linear-gradient(135deg, var(--accent), var(--surface));
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; color: var(--primary); opacity: 0.4;
  }
  .post-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
  .post-card-cat {
    display: inline-block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px; color: var(--primary); background: var(--accent);
    padding: 3px 9px; border-radius: 20px; margin-bottom: 10px;
  }
  .post-card-title {
    font-size: 1.05rem; font-weight: 700; line-height: 1.4;
    color: var(--text); margin-bottom: 10px; letter-spacing: -0.2px;
  }
  .post-card-title a { text-decoration: none; color: inherit; }
  .post-card-title a:hover { color: var(--primary); }
  .post-card-excerpt { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; flex: 1; margin-bottom: 16px; }
  .post-card-meta {
    display: flex; align-items: center; gap: 12px; padding-top: 14px;
    border-top: 1px solid var(--border); font-size: 0.8rem; color: var(--text-muted);
    margin-top: auto;
  }
  .post-card-meta a {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.8rem; font-weight: 600; color: var(--primary);
    text-decoration: none; margin-left: auto;
  }
  .post-card-meta a:hover { color: var(--primary-dark); }

  /* === SINGLE POST === */
  .single-wrap { max-width: 740px; margin: 0 auto; }
  .breadcrumb { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 24px; }
  .breadcrumb a { color: var(--primary); text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }
  .single-header { margin-bottom: 28px; }
  .single-category {
    display: inline-block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px; color: var(--primary); background: var(--accent);
    padding: 3px 10px; border-radius: 20px; margin-bottom: 14px;
  }
  .single-title {
    font-size: 2.1rem; font-weight: 800; line-height: 1.25;
    letter-spacing: -0.8px; color: var(--text); margin-bottom: 16px;
  }
  .single-meta {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    font-size: 0.84rem; color: var(--text-muted);
    padding-bottom: 20px; border-bottom: 1px solid var(--border);
  }
  .single-meta span { display: flex; align-items: center; gap: 5px; }
  .single-featured-img {
    width: 100%; max-height: 450px; object-fit: cover;
    border-radius: var(--radius); margin: 24px 0;
    box-shadow: var(--shadow);
  }
  .entry-content { font-size: 1.05rem; line-height: 1.8; color: #374151; }
  .entry-content h2 { font-size: 1.6rem; font-weight: 700; margin: 2em 0 0.6em; color: var(--text); letter-spacing: -0.4px; }
  .entry-content h3 { font-size: 1.3rem; font-weight: 700; margin: 1.8em 0 0.5em; color: var(--text); }
  .entry-content h4 { font-size: 1.1rem; font-weight: 700; margin: 1.5em 0 0.4em; color: var(--text); }
  .entry-content p { margin-bottom: 1.2em; }
  .entry-content a { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
  .entry-content a:hover { color: var(--primary-dark); }
  .entry-content img { max-width: 100%; height: auto; border-radius: var(--radius); margin: 1em 0; display: block; }
  .entry-content ul, .entry-content ol { padding-left: 1.5em; margin-bottom: 1.2em; }
  .entry-content li { margin-bottom: 0.4em; }
  .entry-content blockquote {
    border-left: 4px solid var(--primary); padding: 14px 20px;
    background: var(--accent); border-radius: 0 var(--radius) var(--radius) 0;
    margin: 1.5em 0; font-style: italic; color: var(--text-muted);
  }
  .entry-content code {
    background: var(--surface); border: 1px solid var(--border);
    padding: 2px 7px; border-radius: 4px; font-size: 0.9em;
  }
  .entry-content pre {
    background: #1e293b; color: #e2e8f0; padding: 20px;
    border-radius: var(--radius); overflow-x: auto; margin: 1.5em 0;
  }

  /* === POST TAGS === */
  .post-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
  .post-tag {
    font-size: 0.8rem; padding: 5px 13px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 20px; color: var(--text-muted);
    text-decoration: none; transition: all 0.15s;
  }
  .post-tag:hover { background: var(--accent); color: var(--primary); border-color: var(--primary); }

  /* === PAGE === */
  .page-wrap { max-width: 740px; margin: 0 auto; }
  .page-title {
    font-size: 2rem; font-weight: 800; letter-spacing: -0.5px;
    margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 2px solid var(--primary);
  }

  /* === 404 === */
  .error-page { text-align: center; padding: 80px 0; }
  .error-code { font-size: 6rem; font-weight: 800; color: var(--primary); opacity: 0.15; line-height: 1; }
  .error-title { font-size: 1.5rem; font-weight: 700; margin: -10px 0 10px; }
  .error-page p { color: var(--text-muted); margin-bottom: 24px; }

  /* === CATEGORY PAGE === */
  .cat-header { margin-bottom: 30px; }
  .cat-header h1 { font-size: 1.6rem; font-weight: 800; }
  .cat-header p { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; }

  /* === FOOTER === */
  .site-footer {
    background: var(--bg); border-top: 1px solid var(--border);
    padding: 28px 0; text-align: center;
    font-size: 0.85rem; color: var(--text-muted);
  }
  .site-footer a { color: var(--primary); text-decoration: none; }
  .site-footer a:hover { text-decoration: underline; }

  /* === BACK LINK === */
  .back-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--primary); text-decoration: none;
    font-size: 0.87rem; font-weight: 600;
    padding: 7px 14px; background: var(--accent);
    border-radius: 8px; margin-bottom: 28px; transition: all 0.15s;
  }
  .back-link:hover { background: var(--primary); color: #fff; }

  /* === EMPTY STATE === */
  .empty-state { text-align: center; padding: 60px 0; color: var(--text-muted); }
  .empty-state p { font-size: 1rem; }

  /* === RESPONSIVE === */
  @media (max-width: 768px) {
    .post-grid { grid-template-columns: 1fr; }
    .single-title { font-size: 1.6rem; }
    .header-inner { padding: 12px 0; }
    .nav-menu { gap: 0; }
    .menu-item a { padding: 6px 10px; font-size: 0.85rem; }
  }
`;