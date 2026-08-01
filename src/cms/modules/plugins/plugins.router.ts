import { Hono } from 'hono';

const plugins = new Hono<{ Bindings: any }>();

// GET: List Plugins
plugins.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM plugins").all();
    return c.json({ success: true, data: results || [] });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// POST: Toggle Plugin Status (Activate/Deactivate)
plugins.post('/toggle', async (c) => {
  try {
    const body = await c.req.json();
    const targetId = body.plugin_id || body.pluginId;
    const active = body.active ? 1 : 0;

    if (!targetId) return c.json({ success: false, message: 'ID Plugin kosong' }, 400);

    // Update the plugin's active status
    const result = await c.env.DB.prepare("UPDATE plugins SET active = ? WHERE id = ?")
      .bind(active, targetId)
      .run();

    if (result.success) {
      return c.json({ success: true, message: "Plugin " + (active ? 'Diaktifkan' : 'Dinonaktifkan') + "!" });
    }
    
    return c.json({ success: false, message: 'Gagal mengupdate status plugin' }, 400);
  } catch (e: any) {
    console.error(e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// POST: Add mock plugin (For testing)
plugins.post('/', async (c) => {
  try {
    const body = await c.req.json();
    await c.env.DB.prepare(`
      INSERT INTO plugins (id, name, description, author, version, active) 
      VALUES (?, ?, ?, ?, ?, 0)
    `).bind(body.id, body.name, body.description, body.author, body.version).run();
    return c.json({ success: true, message: 'Plugin ditambahkan' });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// DELETE: Delete Plugin
plugins.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare("DELETE FROM plugins WHERE id = ?").bind(id).run();
    return c.json({ success: true, message: 'Plugin berhasil dihapus' });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default plugins;
