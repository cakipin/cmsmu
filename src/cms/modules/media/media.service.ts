import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

export class MediaService {
  constructor(private bucket: R2Bucket, private db: D1Database) {}

  async upload(key: string, file: File | Blob) {
    await this.bucket.put(key, file, { httpMetadata: { contentType: file.type } });
    return { key };
  }

  // UPDATE LIST: Ambil field caption
  async list() {
    const list = await this.bucket.list({ limit: 500 });
    const { results } = await this.db.prepare("SELECT * FROM media_meta").all();
    
    return list.objects.map(obj => {
      const meta: any = results.find((m: any) => m.key === obj.key) || {};
      return {
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        alt: meta.alt || '',
        title: meta.title || '',
        description: meta.description || '',
        caption: meta.caption || '' // <--- BARU
      };
    });
  }

  async get(key: string) { return await this.bucket.get(key); }

  async delete(key: string) {
    await this.bucket.delete(key);
    await this.db.prepare("DELETE FROM media_meta WHERE key = ?").bind(key).run();
  }

  // UPDATE SAVE: Simpan caption
  async saveMeta(key: string, data: { alt?: string, description?: string, title?: string, caption?: string }) {
    return await this.db.prepare(`
      INSERT INTO media_meta (key, alt, description, title, caption) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET 
        alt=excluded.alt, 
        description=excluded.description, 
        title=excluded.title,
        caption=excluded.caption
    `).bind(
        key, 
        data.alt || '', 
        data.description || '', 
        data.title || '', 
        data.caption || '' // <--- BARU
    ).run();
  }

  async rename(oldKey: string, newName: string) {
    const oldObject = await this.bucket.get(oldKey);
    if (!oldObject) throw new Error("File lama tidak ditemukan");
    
    const parts = oldKey.split('/');
    const cleanNewName = newName.replace(/[^a-zA-Z0-9.-]/g, '_'); 
    const newKey = parts.length > 1 ? `${parts.slice(0, -1).join('/')}/${cleanNewName}` : cleanNewName;

    await this.bucket.put(newKey, oldObject.body, {
        httpMetadata: oldObject.httpMetadata,
        customMetadata: oldObject.customMetadata
    });
    await this.bucket.delete(oldKey);
    await this.db.prepare("UPDATE media_meta SET key = ? WHERE key = ?").bind(newKey, oldKey).run();

    return { oldKey, newKey };
  }
}