import { Hono } from 'hono'
import { authMiddleware } from '../../middleware/auth'
import { Bindings } from '../../types'

const theme = new Hono<{ Bindings: Bindings }>()

// 1. LIST THEMES (Cek Status Aktif dari DB)
theme.get('/', async (c) => {
  // Ambil tema yang sedang aktif dari DB
  let currentActiveId = 'labmu-default';
  try {
    const activeOption = await c.env.DB.prepare("SELECT value FROM options WHERE key = 'active_theme'").first();
    if(activeOption) currentActiveId = activeOption.value as string;
  } catch(e) {}

  const themeList = [
      { 
        id: 'labmu-default', 
        name: 'LabMu Default', 
        active: currentActiveId === 'labmu-default', 
        thumbnail: 'https://placehold.co/600x400/2563eb/ffffff?text=Default' 
      },
      { 
        id: 'labmu-pro', 
        name: 'LabMu Pro', 
        active: currentActiveId === 'labmu-pro', 
        thumbnail: 'https://placehold.co/600x400/16a34a/ffffff?text=Pro' 
      },
      { 
        id: 'labmu-quran', 
        name: 'LabMu Quran', 
        active: currentActiveId === 'labmu-quran', 
        thumbnail: 'https://placehold.co/600x400/d97706/ffffff?text=Quran' 
      }
  ];
  return c.json({ success: true, data: themeList });
})

// 2. ACTIVATE THEME (SIMPAN KE DB)
theme.post('/activate', authMiddleware, async (c) => {
  try {
    const { themeId } = await c.req.json();
    
    // Upsert ke tabel options
    await c.env.DB.prepare(`
      INSERT INTO options (key, value) VALUES ('active_theme', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).bind(themeId).run();

    return c.json({ success: true, message: `Tema ${themeId} aktif!` });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})

export default theme