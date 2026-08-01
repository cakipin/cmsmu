import type { D1Database } from "@cloudflare/workers-types";

export class ContentService {
  constructor(private db: D1Database) {}

  private getSafeTime(dateInput: any): number {
    const now = Math.floor(Date.now() / 1000);
    if (!dateInput) return now;
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return now;
        return Math.floor(d.getTime() / 1000);
    } catch { return now; }
  }

  // Fungsi vital untuk mencegah D1_TYPE_ERROR (Undefined)
  private clean(val: any, fallback: any = "") {
    return (val === undefined || val === null) ? fallback : val;
  }

  async getAll(type?: string) {
    let query = "SELECT * FROM contents";
    const params: any[] = [];
    if (type) {
        query += " WHERE type = ?";
        params.push(type);
    }
    query += " ORDER BY created_at DESC";
    const { results } = await this.db.prepare(query).bind(...params).all();
    return results;
  }

  async getById(id: string) {
    const result: any = await this.db.prepare("SELECT * FROM contents WHERE id = ?").bind(id).first();
    if (!result) return null;
    if (!result.attributes) result.attributes = "{}";
    return result;
  }

  async create(data: any) {
    const now = Math.floor(Date.now() / 1000);
    const createdAt = this.getSafeTime(data.date);
    const safeSlug = this.clean(data.slug, `post-${now}`);
    
    const attributes = JSON.stringify({
        featured_image: this.clean(data.featured_image),
        category: this.clean(data.category),
        tags: this.clean(data.tags)
    });

    try {
      return await this.db.prepare(`
        INSERT INTO contents (title, slug, body, type, status, category, tags, attributes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `).bind(
        this.clean(data.title, "(No Title)"), safeSlug, this.clean(data.body), 
        this.clean(data.type, "post"), this.clean(data.status, "draft"),
        this.clean(data.category), this.clean(data.tags), attributes, createdAt, now
      ).first();
    } catch (e: any) {
      return await this.db.prepare(`
        INSERT INTO contents (title, slug, body, type, status, attributes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `).bind(
        this.clean(data.title, "(No Title)"), safeSlug, this.clean(data.body), 
        this.clean(data.type, "post"), this.clean(data.status, "draft"),
        attributes, createdAt, now
      ).first();
    }
  }

  async update(id: string, data: any) {
    const now = Math.floor(Date.now() / 1000);
    const createdAt = data.date ? this.getSafeTime(data.date) : now;

    const attributes = JSON.stringify({
        featured_image: this.clean(data.featured_image),
        category: this.clean(data.category),
        tags: this.clean(data.tags)
    });

    try {
      // Percobaan 1: Update Full (Tanpa Backslash yang bikin error)
      return await this.db.prepare(`
        UPDATE contents SET title=?, slug=?, body=?, type=?, status=?, category=?, tags=?, attributes=?, created_at=?, updated_at=?
        WHERE id=?
      `).bind(
        this.clean(data.title), this.clean(data.slug), this.clean(data.body), 
        this.clean(data.type), this.clean(data.status), this.clean(data.category),
        this.clean(data.tags), attributes, createdAt, now, id
      ).run();
    } catch (e: any) {
       // Percobaan 2: Fallback (Tanpa Backslash)
       try {
          return await this.db.prepare(`
            UPDATE contents SET title=?, slug=?, body=?, type=?, status=?, attributes=?, updated_at=?
            WHERE id=?
          `).bind(
            this.clean(data.title), this.clean(data.slug), this.clean(data.body), 
            this.clean(data.type), this.clean(data.status), attributes, now, id
          ).run();
       } catch(e2: any) {
           throw new Error("DB Update Fatal: " + e2.message);
       }
    }
  }

  async delete(id: string) {
    return await this.db.prepare("DELETE FROM contents WHERE id = ?").bind(id).run();
  }
}