export const css = `
:root {
  --primary: #2563eb;
  --secondary: #1e293b;
  --accent: #f59e0b;
  --bg-body: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #334155;
  --text-muted: #64748b;
  --container-width: 1200px;
  --header-height: 70px;
  --font-main: 'Inter', sans-serif;
}

/* RESET & BASE */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-main); background: var(--bg-body); color: var(--text-main); line-height: 1.6; }
a { text-decoration: none; color: inherit; transition: 0.2s; }
a:hover { color: var(--primary); }
img { max-width: 100%; height: auto; display: block; }
.container { max-width: var(--container-width); margin: 0 auto; padding: 0 20px; }

/* UTILITY GRID */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.gap-20 { gap: 20px; }

/* HEADER PRO */
.pro-header { background: var(--bg-card); height: var(--header-height); display: flex; align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.header-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }
.nav-menu { display: flex; gap: 25px; font-weight: 500; font-size: 0.95rem; }

/* HERO SECTION (Homepage) */
.hero-section { background: var(--secondary); color: white; padding: 80px 0; text-align: center; margin-bottom: 40px; }
.hero-title { font-size: 3rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; }
.hero-subtitle { font-size: 1.2rem; opacity: 0.8; max-width: 600px; margin: 0 auto 30px auto; }
.btn-hero { background: var(--primary); color: white; padding: 12px 30px; border-radius: 50px; font-weight: 600; display: inline-block; }
.btn-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3); }

/* MAIN LAYOUT */
.main-wrapper { padding: 40px 0; display: grid; gap: 40px; }
.layout-right-sidebar { grid-template-columns: 1fr 300px; }
.layout-left-sidebar { grid-template-columns: 300px 1fr; }
.layout-full { grid-template-columns: 1fr; }

/* CARDS (Posts) */
.post-card { background: var(--bg-card); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: 0.3s; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.post-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.post-thumb { height: 200px; object-fit: cover; width: 100%; background: #eee; }
.post-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.post-tag { background: #dbeafe; color: var(--primary); font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; font-weight: 600; align-self: start; margin-bottom: 10px; text-transform: uppercase; }
.post-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 10px; line-height: 1.3; }
.post-excerpt { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; flex: 1; }
.post-meta { font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; display: flex; justify-content: space-between; }

/* SINGLE POST */
.entry-header { text-align: center; margin-bottom: 40px; }
.entry-title { font-size: 2.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 20px; }
.entry-image { width: 100%; height: 400px; object-fit: cover; border-radius: 16px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.entry-content { font-size: 1.15rem; line-height: 1.8; color: #475569; max-width: 800px; margin: 0 auto; }
.entry-content h2 { margin-top: 40px; margin-bottom: 20px; color: var(--secondary); }

/* SIDEBAR WIDGETS */
.widget { background: var(--bg-card); padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
.widget-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--primary); display: inline-block; }
.widget-list { list-style: none; }
.widget-list li { padding: 10px 0; border-bottom: 1px dashed #e2e8f0; display: flex; align-items: center; gap: 10px; }
.widget-list li:last-child { border-bottom: none; }
.mini-thumb { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }

/* FOOTER PRO */
.pro-footer { background: var(--secondary); color: #cbd5e1; padding: 60px 0 20px; margin-top: 60px; }
.footer-grid { margin-bottom: 40px; }
.footer-col h4 { color: white; margin-bottom: 20px; font-size: 1.1rem; }
.footer-links li { margin-bottom: 10px; }
.footer-bottom { border-top: 1px solid #334155; padding-top: 20px; text-align: center; font-size: 0.9rem; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4, .layout-right-sidebar { grid-template-columns: 1fr; }
  .nav-menu { display: none; } /* Mobile menu simplified */
  .hero-title { font-size: 2rem; }
}
`;