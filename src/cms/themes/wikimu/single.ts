import { renderLayout } from "./layout";
import { singleCss } from "./css-single";
// ... (Helper Breadcrumbs, Schema, Arab Formatter SAMA SEPERTI SEBELUMNYA) ...
// (Saya persingkat kodenya agar fokus ke bagian Tag di bawah)

/* --- HELPER SAMA SEPERTI SEBELUMNYA (TIDAK PERLU DIUBAH) --- */
const generateBreadcrumbs = (slug: string, title: string, category: string) => { /* ...kode lama... */ return `<nav aria-label="Breadcrumb" style="font-size:0.85rem; margin-bottom:15px; color:#54595d;"><ol style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap;"><li><a href="/" style="color:#0645ad; text-decoration:none;">Beranda</a></li><li style="margin:0 5px; color:#999;">&rsaquo;</li><li><a href="/${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" style="color:#0645ad; text-decoration:none;">${category}</a></li><li style="margin:0 5px; color:#999;">&rsaquo;</li><li aria-current="page" style="color:#333;">${title}</li></ol></nav>`; };
const generateSchemaOrg = (post: any) => { /* ...kode lama... */ return ``; }; // Anggap kode lama ada di sini
const formatInlineArabic = (content: string) => { /* ...kode lama... */ return content; }; // Anggap kode lama ada
const processContent = (html: string) => { /* ...kode lama... */ return html; }; // Anggap kode lama ada
const generateTOC = (html: string) => { /* ...kode lama... */ return ``; }; // Anggap kode lama ada

/* --- MAIN RENDERER --- */
export const renderSingle = (ctx: any) => {
  const post = ctx.data;
  if (!post) return renderLayout("404", "<h1>Tidak Ditemukan</h1>", false);

  const title = post.title || "Artikel Tarjih";
  const category = post.category || "Fatwa";
  const slug = post.slug || post.id;
  const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // [PERBAIKAN] GENERATE TAGS LINK
  // Format: /tag/nama-tag (menggunakan dash pengganti spasi)
  const tagsHtml = post.tags 
    ? post.tags.split(',').map((t: string) => {
        const cleanTag = t.trim();
        const tagSlug = cleanTag.toLowerCase().replace(/\s+/g, '-');
        return `<a href="/tag/${tagSlug}" style="display:inline-block; background:#eef; padding:4px 10px; border-radius:4px; font-size:0.8rem; color:#0645ad; text-decoration:none; margin:0 5px 5px 0; border:1px solid #dde;">#${cleanTag}</a>`;
      }).join('')
    : '';

  const metaData = {
      description: (post.body || "").substring(0, 160).replace(/<[^>]*>?/gm, ''),
      image: post.featured_image || "",
      url: `https://wikimu.id/${slug}`,
      title: `${title} - ${category}` 
  };

  // Pipeline Content
  let contentRaw = post.body || post.content || "";
  // Auto Link removed
  let bodyContent = processContent(contentRaw); // Arab formatting
  
  const toc = generateTOC(bodyContent);
  const breadcrumbs = generateBreadcrumbs(slug, title, category);
  const schema = generateSchemaOrg(post); // Pastikan function ini ada dari kode sebelumnya
  const canEdit = !!(ctx.user || ctx.var?.user);

  const htmlContent = `
    ${schema}
    <style>${singleCss}</style>

    <article class="article-wrapper" itemscope itemtype="https://schema.org/Article">
        ${breadcrumbs}
        
        <header>
            <h1 class="article-title" itemprop="headline">${title}</h1>
            <div class="article-meta">
                <a href="/${catSlug}" style="color:#006C45; font-weight:bold; text-decoration:none;">${category}</a> 
                &bull; 
                <time itemprop="datePublished" datetime="${new Date(post.created_at).toISOString()}">
                    ${new Date(post.created_at).toLocaleDateString("id-ID", {year:'numeric', month:'long', day:'numeric'})}
                </time>
                ${canEdit ? ` &bull; <a href="/admin/post/${post.id}/edit" class="edit-btn">Sunting</a>` : ''}
            </div>
        </header>

        ${toc}

        <div class="article-content" itemprop="articleBody">
            ${bodyContent}
        </div>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #777;">
            ${tagsHtml ? `
            <div style="margin-bottom: 20px;">
                <strong style="display:block; margin-bottom:8px; color:#333;">Topik Terkait:</strong>
                ${tagsHtml}
            </div>` : ''}
            
            <p><strong>Kategori:</strong> <a href="/${catSlug}" style="color:#0645ad;">${category}</a></p>
            
            <div style="background:#f9f9f9; padding:15px; border-left:4px solid #006C45; margin-top:20px; font-size:0.85rem;">
                <em><strong>Disclaimer:</strong> Konten ini disajikan dari pangkalan data Ensiklopedia Tarjih Muhammadiyah. Rujuklah ke buku asli HPT untuk referensi resmi.</em>
            </div>
        </footer>
    </article>
  `;

  return renderLayout(title, htmlContent, true, metaData);
};