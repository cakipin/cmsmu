import type { D1Database } from '@cloudflare/workers-types'

export class SettingsService {
  constructor(private db: D1Database) {}

  // Ambil semua settingan
  async getAll() {
    try {
      const result = await this.db.prepare("SELECT * FROM options").all();
      const settings: any = {};
      
      // Ubah dari array baris DB jadi object { key: value }
      if (result.results) {
        result.results.forEach((row: any) => {
          settings[row.key] = row.value;
        });
      }
      
      return {
        site_title: 'LabMu CMS', 
        site_desc: 'Just another LabMu site',
        ...settings // Gabungkan default dengan data DB
      };
    } catch (e) {
      console.error(e);
      return {}; // Return kosong kalau tabel belum ada
    }
  }

  // Simpan settingan (Upsert: Update kalau ada, Insert kalau belum)
  async updateMany(data: Record<string, string>) {
    const stmt = this.db.prepare("INSERT INTO options (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
    
    const batch = [];
    for (const [key, value] of Object.entries(data)) {
      // Pastikan value string biar aman
      batch.push(stmt.bind(key, String(value)));
    }
    
    return await this.db.batch(batch);
  }
}