const html = `<div class="recent-posts-placeholder">
  <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-slate-100 animate-pulse h-80 rounded-2xl"></div>
      <div class="bg-slate-100 animate-pulse h-80 rounded-2xl hidden md:block"></div>
      <div class="bg-slate-100 animate-pulse h-80 rounded-2xl hidden md:block"></div>
  </div>
</div><section id="gabung">...CTA...</section>`;
const replaced = html.replace(/<div[^>]*class="[^"]*recent-posts-placeholder[^"]*"[^>]*>.*?<\/div>/g, "REPLACED");
console.log(replaced);
