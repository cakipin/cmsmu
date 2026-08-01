import { Hono } from "hono";
import { ContentService } from "./contents.service";

export const contentsRouter = new Hono<{ Bindings: any }>();

// GET ALL
contentsRouter.get("/", async (c) => {
  try {
    const service = new ContentService(c.env.DB);
    const type = c.req.query("type");
    const results = await service.getAll(type);
    return c.json({ success: true, data: results });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// GET BY ID
contentsRouter.get("/:id", async (c) => {
  try {
    const service = new ContentService(c.env.DB);
    const id = c.req.param("id");
    const result = await service.getById(id);
    if (!result) return c.json({ success: false, error: "Not found" }, 404);
    return c.json({ success: true, data: result });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// CREATE (POST)
contentsRouter.post("/", async (c) => {
  try {
    const service = new ContentService(c.env.DB);
    const body = await c.req.json();
    const result = await service.create(body);
    return c.json({ success: true, data: result });
  } catch (e: any) {
    // Tangkap error database dan kirim sebagai JSON
    console.error("Router Create Error:", e);
    return c.json({ success: false, error: e.message || "Gagal membuat konten" }, 500);
  }
});

// UPDATE (PUT)
contentsRouter.put("/:id", async (c) => {
  try {
    const service = new ContentService(c.env.DB);
    const id = c.req.param("id");
    const body = await c.req.json();
    const result = await service.update(id, body);
    return c.json({ success: true, data: result });
  } catch (e: any) {
    console.error("Router Update Error:", e);
    return c.json({ success: false, error: e.message || "Gagal update konten" }, 500);
  }
});

// DELETE
contentsRouter.delete("/:id", async (c) => {
  try {
    const service = new ContentService(c.env.DB);
    const id = c.req.param("id");
    await service.delete(id);
    return c.json({ success: true, message: "Deleted" });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default contentsRouter;