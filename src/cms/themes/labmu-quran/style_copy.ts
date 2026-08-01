// src/themes/labmu-quran/style.ts

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --primary: #059669;
  --bg-body: #f1f5f9;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  
  --header-bg: linear-gradient(135deg, #1e3a8a 0%, #059669 100%);
  --header-text: #ffffff;
  
  --dropdown-bg: #ffffff;
  --hover-bg: #f8fafc;
  --footer-bg: #ffffff;
  --sidebar-bg: #ffffff;
}

body.dark {
  --primary: #34d399;
  --bg-body: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: #334155;
  
  --header-bg: linear-gradient(135deg, #020617 0%, #064e3b 100%);
  --header-text: #ffffff;
  
  --dropdown-bg: #1e293b;
  --hover-bg: #334155;
  --footer-bg: #1e293b;
  --sidebar-bg: #1e293b;
}

* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

body { 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  background: var(--bg-body); 
  color: var(--text-main);
  padding-bottom: 160px; 
  transition: background 0.3s;
  padding-top: 70px;
}

.quran-container { max-width: 900px; margin: 0 auto; }

/* === HEADER === */
.header-wrapper {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: var(--header-bg);
  color: var(--header-text);
  border-bottom: 1px solid var(--border);
  height: 70px;
  display: flex; align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.header-inner {
  max-width: 900px; width: 100%; margin: 0 auto; padding: 0 20px;
  display: flex; justify-content: space-between; align-items: center;
  position: relative; /* Untuk centering logo */
}

/* LOGO TENGAH */
.brand-logo { 
  position: absolute; left: 50%; transform: translateX(-50%);
  font-family: 'Amiri', serif; font-size: 1.8rem; font-weight: bold; 
  color: var(--header-text); text-decoration: none; 
  white-space: nowrap;
}

/* HEADER KANAN */
.header-right { margin-left: auto; display: flex; gap: 8px; align-items: center; }
.header-desktop { display: flex; gap: 8px; align-items: center; }

/* BURGER BUTTON */
.burger-btn {
    display: none;
    background: transparent; border: 1px solid rgba(255,255,255,0.3);
    color: #fff; width: 40px; height: 40px; border-radius: 8px;
    font-size: 1.2rem; cursor: pointer;
}

/* KALENDER DESKTOP */
.hijri-badge {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #ffffff; padding: 4px 12px; border-radius: 12px;
    display: flex; flex-direction: column;
    text-decoration: none; cursor: pointer; transition: all 0.2s;
    min-width: 120px;
}
.hijri-badge:hover { background: rgba(255, 255, 255, 0.25); }

/* === SIDEBAR === */
.sidebar-menu {
    position: fixed; top: 0; right: -300px; bottom: 0; width: 280px;
    background: var(--sidebar-bg); z-index: 5000;
    box-shadow: -5px 0 20px rgba(0,0,0,0.2);
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column; border-left: 1px solid var(--border);
}
.sidebar-menu.open { right: 0; }
.sidebar-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.sidebar-content { padding: 20px; overflow-y: auto; }
.sidebar-group { margin-bottom: 25px; }
.sidebar-group label { display: block; font-weight: bold; margin-bottom: 10px; color: var(--primary); }
.sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 4000; display: none; backdrop-filter: blur(2px); }
.sidebar-overlay.show { display: block; }

/* KALENDER DI SIDEBAR (MOBILE) */
.sidebar-calendar-box {
    background: var(--bg-body); border: 1px solid var(--primary);
    color: var(--primary); padding: 15px; border-radius: 10px;
    text-align: center; font-weight: bold;
}

/* UI ELEMENTS */
.mobile-select { width: 100%; padding: 12px; border-radius: 8px; background: var(--bg-body); color: var(--text-main); border: 1px solid var(--border); font-size: 1rem; }
.btn-sidebar-toggle { flex: 1; padding: 10px; border: 1px solid var(--border); background: var(--bg-body); color: var(--text-muted); border-radius: 8px; cursor: pointer; }
.btn-sidebar-toggle.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn-sidebar-block { width: 100%; padding: 12px; background: var(--bg-body); border: 1px solid var(--border); color: var(--text-main); border-radius: 8px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 10px; }

/* DROPDOWN & FOOTER */
.custom-dropdown { position: relative; }
.dropdown-trigger { padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #ffffff; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 130px; justify-content: space-between; }
.dropdown-content { display: none; position: absolute; right: 0; top: 120%; background-color: var(--dropdown-bg); min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 10px; border: 1px solid var(--border); z-index: 3000; overflow: hidden; }
.dropdown-content.show { display: block; animation: fadeIn 0.1s; }
.dropdown-item { padding: 12px 15px; display: block; color: var(--text-main); cursor: pointer; border-bottom: 1px solid var(--border); }
.dropdown-item:hover { background-color: var(--hover-bg); color: var(--primary); }
.btn-icon-head { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-icon-head.active { background: #ffffff; color: var(--primary); }
.labmu-footer { position: fixed; bottom: 0; left: 0; right: 0; width: 100%; height: 35px; background-color: var(--footer-bg) !important; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: center; text-align: center; color: var(--text-muted); font-size: 0.8rem; z-index: 2000; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); }

/* CONTENT & PLAYER */
.content-area { padding: 20px 15px; }
.search-box { width: 100%; padding: 14px 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); margin-bottom: 25px; font-size: 1rem; }
.surat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
.surat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 18px; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 15px; transition: transform 0.2s; }
.surat-card:hover { transform: translateY(-3px); border-color: var(--primary); }
.nomor-surat { width: 40px; height: 40px; border-radius: 8px; background: rgba(5, 150, 105, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: bold; }
.ayat-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 25px; margin-bottom: 20px; }
.ayat-meta-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px dashed var(--border); padding-bottom: 15px; }
.ayat-badge { background: var(--text-main); color: var(--bg-card); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
.ayat-actions { display: flex; gap: 8px; }
.btn-action { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-action:hover { color: var(--primary); border-color: var(--primary); background: rgba(5, 150, 105, 0.05); }
.ayat-arab { font-family: 'Amiri', serif; font-size: 2.2rem; line-height: 2.3; text-align: right; margin-bottom: 25px; color: var(--text-main); }
.trans-block { margin-top: 12px; line-height: 1.6; }
.trans-latin { color: var(--primary); font-weight: 600; display: none; }
.trans-id { display: none; color: var(--text-main); }
.trans-en { display: none; color: var(--text-muted); font-style: italic; border-left: 2px solid var(--border); padding-left: 12px; margin-top: 10px; }
body.show-latin .trans-latin { display: block; }
body.show-id .trans-id { display: block; }
body.show-en .trans-en { display: block; }
.sticky-player { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); width: 95%; max-width: 450px; background: var(--bg-card); padding: 10px 15px; border-radius: 50px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 12px; z-index: 2500; }
.share-popover { display: none; position: absolute; right: 0; top: 110%; background: var(--bg-card); min-width: 160px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); border-radius: 10px; border: 1px solid var(--border); z-index: 100; padding: 5px; }
.share-popover.show { display: block; animation: fadeIn 0.2s; }
.share-link { display: flex; align-items: center; gap: 10px; padding: 10px; color: var(--text-main); text-decoration: none; font-size: 0.85rem; border-radius: 6px; }
.share-link:hover { background: var(--hover-bg); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* === RESPONSIF MOBILE (HP) === */
@media (max-width: 768px) {
    /* 1. Sembunyikan Kalender Header & Menu Desktop */
    .desktop-only, .header-desktop { display: none !important; }
    
    /* 2. Tampilkan Burger */
    .burger-btn { display: block; }
    
    /* 3. Logo Tetap Tengah */
    .brand-logo { font-size: 1.5rem; }
}
`;