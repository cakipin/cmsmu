const html = `<nav id="navbar">Nav</nav><section id="berita"><h2>Berita</h2><div class="recent-posts-placeholder"><div class="grid"><div></div></div></div></section><section id="gabung">CTA</section>`;
console.log(html.replace(/<div[^>]*class="[^"]*recent-posts-placeholder[^"]*"[^>]*>.*?<\/div>/g, "REPLACED"));
