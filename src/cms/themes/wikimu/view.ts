// wikimu/view.ts
import { renderLayout } from './layout';
import { renderInfobox } from './components';

export const renderPage = (data: any) => {
  // Handle jika data dibungkus {post: ...} atau langsung object
  const post = data.post || data; 
  
  if (!post || !post.title) {
     return renderLayout('Tidak Ditemukan', '<div style="padding:2rem;">Artikel tidak ditemukan.</div>');
  }

  // HTML Konten Artikel
  const content = `
    <h1 style="font-size: 1.8rem; font-family: 'Linux Libertine', serif; border-bottom: 1px solid #a2a9b1; margin-bottom: 0.5rem; padding-bottom: 0.2rem;">
        ${post.title}
    </h1>

    <div class="mw-parser-output" style="font-size: 0.95rem; line-height: 1.6; color: #202122;">
        
        ${renderInfobox(post)}

        <div style="font-size: 0.85rem; color: #54595d; margin-bottom: 1.5rem; font-style: italic;">
             Dari Ensiklopedia Tarjih Muhammadiyah (WikiMu)
        </div>

        <div class="wiki-text" style="margin-top: 1rem;">
            ${post.content || post.body || '<p style="font-style:italic; color:#777;">Konten artikel belum tersedia.</p>'}
        </div>

        <div style="margin-top: 3rem; border-top: 1px solid #ccc; padding-top: 1rem; font-size: 0.8rem;">
            Kategori: <b>${post.category || 'Umum'}</b> | Penulis: ${post.author || 'Admin'}
        </div>
    </div>
  `;

  return renderLayout(post.title, content);
};

// Alias agar kompatibel
export const renderPost = renderPage;