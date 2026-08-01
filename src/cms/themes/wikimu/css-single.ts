export const singleCss = `
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Scheherazade+New:wght@400;700&family=Amiri:wght@400;700&display=swap");

.article-wrapper {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  /* Menggunakan variabel agar otomatis gelap/terang */
  background: var(--wiki-content-bg);
  color: var(--wiki-text);
  transition: background 0.3s ease, color 0.3s ease;
}

.article-title {
  font-family: 'Linux Libertine', 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 10px;
  line-height: 1.2;
  color: var(--wiki-text);
}

.article-meta {
  font-size: 0.9rem;
  color: var(--wiki-text-muted);
  margin-bottom: 30px;
  border-bottom: 1px solid var(--wiki-border);
  padding-bottom: 20px;
}

/* KONTEN LATIN (DEFAULT) */
.article-content p {
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--wiki-text); /* Menyesuaikan tema */
  text-align: justify;
}

/* --- PERBAIKAN ARABIC STYLE (FORCE RIGHT) --- */

/* 1. Arabic Block (Paragraf Full Arab) */
p.arabic-block {
  font-family: "Scheherazade New", "Amiri", serif;
  font-size: 2.2rem;       
  line-height: 2.2;
  
  direction: rtl;
  text-align: right !important; 
  
  /* Mode Malam: Background lebih gelap, Mode Terang: Background abu halus */
  background-color: var(--wiki-bg); 
  border-right: 5px solid var(--mu-green-primary); 
  padding: 15px 20px 15px 20px;
  margin: 2rem 0;
  border-radius: 4px;
  color: var(--wiki-text);
  display: block;
}

/* --- Tambahan untuk Disclaimer (Sinkron Mode Malam) --- */
.wiki-post-disclaimer {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: var(--wiki-bg); /* Mengikuti background luar agar tidak silau */
    border: 1px solid var(--wiki-border);
    border-radius: 8px;
    transition: background-color 0.3s ease, border 0.3s ease;
}

.wiki-post-disclaimer p {
    margin: 0;
    font-size: 0.85rem;
    font-style: italic;
    color: var(--wiki-text-muted) !important; /* Memaksa warna teks tidak biru/putih terang */
    line-height: 1.6;
    text-align: left; /* Biasanya disclaimer lebih rapi rata kiri */
}

.wiki-post-disclaimer strong {
    color: var(--wiki-text);
}

/* 2. Arabic Inline (Campuran dalam teks latin) */
.arabic-inline {
  font-family: "Scheherazade New", serif;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--mu-green-primary); /* Tetap Hijau agar menonjol */
  margin: 0 3px;
}

/* TOC & Lainnya */
.toc-box {
  background: var(--wiki-bg);
  border: 1px solid var(--wiki-border);
  padding: 15px 20px;
  display: table;
  margin-bottom: 20px;
  border-radius: 4px;
  color: var(--wiki-text);
}
.toc-title { 
  font-weight: bold; 
  text-align: center; 
  border-bottom: 1px solid var(--wiki-border); 
  margin-bottom: 10px; 
  color: var(--wiki-text);
}
.toc-box ul { list-style: none; padding: 0; margin: 0; }
.toc-box li { margin: 5px 0; font-size: 0.9rem; }
.toc-level-3 { margin-left: 20px; font-size: 0.85rem; }
.toc-box a { text-decoration: none; color: var(--wiki-link); }
.toc-box a:hover { text-decoration: underline; }

.edit-btn {
  font-size: 0.8rem; 
  background: var(--wiki-bg); 
  padding: 4px 10px; 
  border: 1px solid var(--wiki-border);
  border-radius: 4px; 
  color: var(--wiki-text-muted); 
  text-decoration: none; 
  margin-left: 10px;
  transition: 0.2s;
}

.edit-btn:hover {
  background: var(--wiki-border);
  color: var(--wiki-text);
}

/* Biar link di dalam konten artikel tidak mati saat mode malam */
.article-content a {
  color: var(--wiki-link);
}
`;