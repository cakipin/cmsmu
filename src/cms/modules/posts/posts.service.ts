// src/modules/posts/posts.service.ts
import { nusaHooks } from '../../core/hooks' 

export class PostService {
  constructor(private db: D1Database) {}

  /**
   * Mengambil semua data dari tabel posts untuk ditampilkan di List Post
   */
async findAll() {
    const query = "SELECT id, title, slug, status, category, tags, created_at FROM posts ORDER BY created_at DESC";
    const { results } = await this.db.prepare(query).all();
    return results;
}
  /**
   * Membuat post baru di tabel 'posts'
   */
  async create(data: any) {
    // [HOOK] Sebelum save, data boleh diubah oleh plugin
    const processedData = await nusaHooks.applyFilters('before_post_create', data);

    // [FIX] Query diarahkan ke tabel 'posts' dan variabel .bind() didefinisikan secara eksplisit
    const query = "INSERT INTO posts (title, slug, body, status, author, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))";
    
    // Pastikan urutan variabel di .bind() sama dengan urutan tanda tanya (?) di query
    const result = await this.db.prepare(query).bind(
      processedData.title,
      processedData.slug,
      processedData.body || '',
      processedData.status || 'draft',
      processedData.author || 'Admin'
    ).run();

    // [HOOK] Setelah save, lakukan sesuatu (Action)
    await nusaHooks.doAction('after_post_create', { 
      id: result.meta.last_row_id, 
      ...processedData 
    });

    return result;
  }
}