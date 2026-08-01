export const css = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --primary: #059669;
  --bg-body: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #334155;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --header-bg: rgba(255, 255, 255, 0.95);
  --dropdown-bg: #ffffff;
  --hover-bg: #f1f5f9;
}

body.dark {
  --primary: #34d399;
  --bg-body: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
  --header-bg: rgba(15, 23, 42, 0.95);
  --dropdown-bg: #1e293b;
  --hover-bg: #334155;
}

* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

body { 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  background: var(--bg-body); 
  color: var(--text-main);
  padding-bottom: 120px;
  transition: background 0.3s;
}

.quran-container { max-width: 800px; margin: 0 auto; }

/* === HEADER === */
.header-wrapper {
  position: sticky; top: 0; z-index: 1000;
  background: var(--header-bg);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 800px; margin: 0 auto; padding: 12px 15px;
  display: flex; justify-content: space-between; align-items: center;
}

.brand-logo { 
  font-family: 'Amiri', serif; font-size: 1.5rem; font-weight: bold; 
  color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 8px; 
}

.header-right { display: flex; gap: 8px; align-items: center; }

/* DROPDOWN QARI */
.custom-dropdown { position: relative; display: inline-block; }
.dropdown-trigger {
  padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border);
  background: var(--bg-card); color: var(--text-main); font-size: 0.8rem;
  cursor: pointer; display: flex; align-items: center; gap: 5px; min-width: 130px; justify-content: space-between;
}
.dropdown-content {
  display: none; position: absolute; right: 0; top: 120%; 
  background-color: var(--dropdown-bg); min-width: 180px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15); border-radius: 12px;
  border: 1px solid var(--border); z-index: 3000; overflow: hidden;
}
.dropdown-content.show { display: block; animation: fadeIn 0.2s; }
.dropdown-item {
  padding: 10px 15px; text-decoration: none; display: block;
  color: var(--text-main); font-size: 0.85rem; cursor: pointer; border-bottom: 1px solid var(--border);
}
.dropdown-item:hover { background-color: var(--hover-bg); color: var(--primary); }

/* Buttons Header */
.btn-icon-head {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border);
  background: var(--bg-card); color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: 0.2s;
  font-size: 0.8rem; font-weight: bold;
}
.btn-icon-head.active { background: var(--primary); color: #fff; border-color: var(--primary); }

/* === CONTENT === */
.content-area { padding: 25px 15px; }

.search-box { width: 100%; padding: 12px 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); margin-bottom: 20px; }
.topic-list { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; margin-bottom: 20px; scrollbar-width: none; }
.topic-item { flex: 0 0 auto; background: var(--bg-card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 20px; text-decoration: none; color: var(--text-main); font-size: 0.85rem; transition: 0.2s; }
.topic-item:hover { border-color: var(--primary); color: var(--primary); }

.surat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
.surat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 15px; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 15px; transition: 0.2s; }
.surat-card:hover { transform: translateY(-3px); border-color: var(--primary); }
.nomor-surat { width: 40px; height: 40px; border-radius: 10px; background: rgba(5, 150, 105, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: bold; }

/* === AYAT CARD === */
.ayat-item { 
  background: var(--bg-card); border: 1px solid var(--border); 
  border-radius: 16px; padding: 25px; margin-bottom: 20px; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  position: relative; 
}

.ayat-meta-top { 
  display: flex; justify-content: space-between; align-items: center; 
  margin-bottom: 20px; border-bottom: 1px dashed var(--border); padding-bottom: 12px;
}
.ayat-badge { background: var(--text-main); color: var(--bg-card); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }

.ayat-actions { display: flex; flex-direction: row; gap: 8px; align-items: center; }

.btn-action { 
  width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); 
  background: transparent; color: var(--text-muted); cursor: pointer; 
  display: flex; align-items: center; justify-content: center; transition: 0.2s; font-size: 1rem;
}
.btn-action:hover { color: var(--primary); border-color: var(--primary); background: rgba(5, 150, 105, 0.05); }

/* === SHARE POPOVER === */
.share-wrapper { position: relative; }

.share-popover {
  display: none; position: absolute; right: 0; top: 115%;
  background: var(--dropdown-bg); min-width: 170px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15); border-radius: 12px;
  border: 1px solid var(--border); z-index: 50; padding: 5px;
}
.share-popover.show { display: block; animation: fadeIn 0.2s; }

.share-link {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; color: var(--text-main); text-decoration: none;
  font-size: 0.85rem; border-radius: 8px; transition: 0.2s; cursor: pointer;
}
.share-link:hover { background: var(--hover-bg); color: var(--primary); }
.share-link i { width: 18px; text-align: center; }

.c-wa { color: #25D366; } .c-fb { color: #1877F2; } .c-tw { color: #000; } 
body.dark .c-tw { color: #fff; } .c-tele { color: #0088cc; }

/* AYAT TEXT */
.ayat-arab { 
  font-family: 'Amiri', serif; font-size: 2.4rem; line-height: 2.4; 
  text-align: right; margin-bottom: 25px; color: var(--text-main); display: block; 
}
.trans-block { margin-top: 10px; line-height: 1.6; display: none; padding-left: 12px; border-left: 3px solid transparent; }
.trans-latin { color: var(--primary); font-weight: 600; font-size: 0.95rem; margin-bottom: 5px; }
.trans-id { color: var(--text-main); font-size: 1rem; border-left-color: var(--primary); }
.trans-en { color: var(--text-muted); font-size: 0.9rem; font-style: italic; border-left-color: var(--border); }

body.show-latin .trans-latin { display: block; }
body.show-id .trans-id { display: block; }
body.show-en .trans-en { display: block; }

.sticky-player { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 95%; max-width: 450px; background: var(--bg-card); padding: 10px 15px; border-radius: 50px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; z-index: 2000; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
`;