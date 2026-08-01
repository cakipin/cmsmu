import type { Context } from 'hono';
import type { Bindings } from '../utils';

// Konfigurasi
const WP_API_URL = "https://fatwatarjih.or.id/wp-json/wp/v2/posts?_embed&per_page=5"; // Ambil 5 terbaru dulu biar worker gak timeout
const R2_PUBLIC_DOMAIN = "https://pub-xxxxxxxx.r2.dev"; // GANTI DENGAN DOMAIN R2 OM (Cek di Dashboard R2)

export const syncLatest = async (c: Context<{ Bindings: Bindings }>) => {
    const logs: string[] = [];
    let savedCount = 0;

    try {
        logs.push("🚀 Memulai sinkronisasi dengan FatwaTarjih.or.id...");

        // 1. Ambil Data dari WordPress API
        const response = await fetch(WP_API_URL);
        if (!response.ok) throw new Error("Gagal koneksi ke server Fatwa Tarjih");
        
        const posts: any[] = await response.json();
        logs.push(`📦 Berhasil mengambil ${posts.length} data mentah.`);

        // 2. Loop setiap postingan
        for (const p of posts) {
            const originalId = p.id;
            const title = p.title.rendered;
            const slug = p.slug; // Kita pakai slug asli mereka
            const content = p.content.rendered; // KONTEN LENGKAP (HTML)
            const date = new Date(p.date).toISOString();

            // Cek apakah artikel sudah ada di D1 (Biar gak duplikat)
            const existing = await c.env.DB.prepare("SELECT id FROM posts WHERE slug = ?").bind(slug).first();
            
            if (existing) {
                logs.push(`⏩ Skip: "${title}" (Sudah ada)`);
                continue;
            }

            // 3. PROSES GAMBAR (Upload ke R2)
            let localImageUrl = '';
            
            // Cek apakah ada Featured Image
            if (p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]) {
                const sourceUrl = p._embedded['wp:featuredmedia'][0].source_url;
                
                try {
                    // Download Gambar dari Server Asli
                    const imgRes = await fetch(sourceUrl);
                    if (imgRes.ok) {
                        const imgBlob = await imgRes.arrayBuffer();
                        const fileExt = sourceUrl.split('.').pop() || 'jpg';
                        const r2FileName = `tarjih/img-${originalId}.${fileExt}`; // Nama file di R2

                        // Upload ke R2 Bucket
                        await c.env.MY_BUCKET.put(r2FileName, imgBlob, {
                            httpMetadata: { contentType: imgRes.headers.get('content-type') || 'image/jpeg' }
                        });

                        // Set URL Publik R2
                        localImageUrl = `${R2_PUBLIC_DOMAIN}/${r2FileName}`;
                        logs.push(`   📸 Gambar terupload ke R2: ${r2FileName}`);
                    }
                } catch (imgErr) {
                    logs.push(`   ⚠️ Gagal download gambar: ${sourceUrl}`);
                }
            }

            // 4. SIMPAN KE D1 DATABASE
            // Pastikan tabel 'posts' punya kolom yang sesuai. Sesuaikan query ini.
            await c.env.DB.prepare(
                "INSERT INTO posts (title, slug, content, image, created_at, status) VALUES (?, ?, ?, ?, ?, 'published')"
            ).bind(title, slug, content, localImageUrl, date).run();

            savedCount++;
            logs.push(`✅ Disimpan: "${title}"`);
        }

    } catch (e: any) {
        logs.push(`❌ ERROR CRITICAL: ${e.message}`);
        return c.json({ success: false, logs }, 500);
    }

    return c.json({
        success: true,
        message: `Sinkronisasi Selesai. ${savedCount} artikel baru disimpan.`,
        logs: logs
    });
};