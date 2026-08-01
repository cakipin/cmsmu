export const css = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600&display=swap');

:root {
  --primary: #c02626; /* Merah Berita (Mirip Detik/CNN) */
  --dark: #111827;
  --gray: #6b7280;
  --light: #f3f4f6;
  --white: #ffffff;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Inter', sans-serif; background: var(--light); color: var(--dark); line-height: 1.6; }
h1, h2, h3, h4 { font-family: 'Merriweather', serif; font-weight: 700; line-height: 1.3; color: var(--dark); }
a { text-decoration: none; color: inherit; transition: color 0.2s; }
a:hover { color: var(--primary); }

.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* HEADER */
.main-header { background: var(--white); border-bottom: 2px solid var(--primary); padding: 20px 0; position: sticky; top:0; z-index:100; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.8rem; font-weight: 900; color: var(--primary); letter-spacing: -1px; }
.nav-menu { display: flex; gap: 20px; font-weight: 600; font-size: 0.95rem; }

/* HERO SECTION */
.hero-section { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 30px; }
.hero-card { position: relative; border-radius: 12px; overflow: hidden; height: 400px; }
.hero-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.hero-card:hover .hero-img { transform: scale(1.05); }
.hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: 30px; color: white; }
.hero-cat { background: var(--primary); color: white; padding: 4px 10px; font-size: 0.7rem; text-transform: uppercase; font-weight: bold; border-radius: 4px; margin-bottom: 10px; display: inline-block; }
.hero-title { font-size: 1.8rem; margin-bottom: 10px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

/* LATEST NEWS GRID */
.section-title { margin: 40px 0 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; }
.section-title span { background: var(--dark); color: white; padding: 5px 15px; margin-bottom: -11px; }

.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
.news-card { background: var(--white); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
.news-thumb { height: 200px; width: 100%; object-fit: cover; }
.news-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.news-meta { font-size: 0.8rem; color: var(--gray); margin-bottom: 10px; }
.news-title { font-size: 1.1rem; margin-bottom: 10px; flex: 1; }
.read-more { font-size: 0.85rem; font-weight: 600; color: var(--primary); margin-top: 15px; }

/* SINGLE POST */
.single-container { background: var(--white); padding: 40px; margin-top: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 800px; margin-left: auto; margin-right: auto; }
.post-header { text-align: center; margin-bottom: 30px; }
.post-title { font-size: 2.5rem; margin-bottom: 15px; }
.post-meta { color: var(--gray); font-size: 0.9rem; }
.post-img { width: 100%; height: auto; border-radius: 8px; margin-bottom: 30px; }
.post-content { font-size: 1.1rem; line-height: 1.8; color: #374151; }
.post-content p { margin-bottom: 20px; }

/* FOOTER */
footer { background: var(--dark); color: white; padding: 40px 0; margin-top: 60px; text-align: center; }
`;