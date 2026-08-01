import { Hono } from 'hono';
import { availableThemes } from '../../themes/registry';

const theme = new Hono<{ Bindings: any }>();

// GET: List Themes
theme.get('/', async (c) => {
  try {
    const { results: dbThemes } = await c.env.DB.prepare("SELECT id, active FROM themes").all();
    
    let data = availableThemes.map(t => {
      const dbEntry = dbThemes?.find((d: any) => d.id === t.id);
      return {
        ...t,
        active: dbEntry ? dbEntry.active === 1 : false,
        deleted: dbEntry ? dbEntry.active === -1 : false,
        thumbnail: `https://placehold.co/600x400/2563eb/ffffff?text=${encodeURIComponent(t.name)}`
      };
    });

    data = data.filter(t => !t.deleted);

    return c.json({ success: true, data });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// POST: Activate Theme (FIXED LOGIC)
theme.post('/activate', async (c) => {
  try {
    const body = await c.req.json();
    const targetId = body.theme_id || body.themeId;

    if (!targetId) return c.json({ success: false, message: 'ID Tema kosong' }, 400);

    // 1. Matikan semua tema dulu (Set active = 0)
    await c.env.DB.prepare("UPDATE themes SET active = 0").run();

    // 2. Cek apakah tema target sudah ada di DB?
    const exists = await c.env.DB.prepare("SELECT id FROM themes WHERE id = ?").bind(targetId).first();

    if (!exists) {
       // KASUS OM SEKARANG: Belum ada di DB, jadi kita INSERT manual
       const info = availableThemes.find(t => t.id === targetId);
       
       if(info) {
          // Masukkan ke DB
          await c.env.DB.prepare(`
            INSERT INTO themes (id, name, description, author, version, active) 
            VALUES (?, ?, ?, ?, ?, 1)
          `).bind(info.id, info.name, info.description || '', info.author || '', info.version || '').run();
       } else {
          return c.json({ success: false, message: 'Tema tidak ditemukan di registry' }, 404);
       }
    } else {
       // Kalau sudah ada, tinggal switch jadi ON
       await c.env.DB.prepare("UPDATE themes SET active = 1 WHERE id = ?").bind(targetId).run();
    }

    return c.json({ success: true, message: 'Tema Berhasil Diaktifkan!' });
  } catch (e: any) {
    console.error(e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// DELETE: Delete Theme
theme.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if theme is active
    const activeCheck = await c.env.DB.prepare("SELECT active FROM themes WHERE id = ?").bind(id).first();
    if (activeCheck && activeCheck.active === 1) {
      return c.json({ success: false, message: 'Tidak bisa menghapus tema yang sedang aktif' }, 400);
    }

    // Insert or replace with active = -1 (soft delete)
    const info = availableThemes.find(t => t.id === id);
    if(info) {
        // Hapus hard dari DB dulu kalau ada (untuk jaga-jaga) lalu insert ulang sebagai deleted
        await c.env.DB.prepare("DELETE FROM themes WHERE id = ?").bind(id).run();
        await c.env.DB.prepare(`
          INSERT INTO themes (id, name, description, author, version, active) 
          VALUES (?, ?, ?, ?, ?, -1)
        `).bind(info.id, info.name, info.description || '', info.author || '', info.version || '').run();
    }
    
    return c.json({ success: true, message: 'Tema berhasil dihapus' });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default theme;