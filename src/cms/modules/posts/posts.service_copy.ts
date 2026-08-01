// src/modules/posts/posts.service.ts
import { nusaHooks } from '../../core/hooks' 

export class PostService {
  // ... constructor ...

  async create(data: any) {
    // [HOOK] Sebelum save, data boleh diubah oleh plugin
    // Misal: Plugin SEO mau auto-generate meta description
    const processedData = await nusaHooks.applyFilters('before_post_create', data);

    const query = "INSERT INTO contents (title, slug, body, type, attributes) VALUES (?, ?, ?, ?, ?)"
    
    // ... proses insert ke DB ...
    const result = await this.db.prepare(query).bind(...).run();

    // [HOOK] Setelah save, lakukan sesuatu
    // Misal: Plugin Notifikasi mau kirim Telegram ke admin
    await nusaHooks.doAction('after_post_create', { 
      id: result.meta.last_row_id, 
      ...processedData 
    });

    return result;
  }
}