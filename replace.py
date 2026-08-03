import re

with open('src/cms/themes/labmu-pro/index.ts', 'r') as f:
    content = f.read()

# Define the new renderHome block
new_block = """  // 2. TAMPILAN HOME (Landing Page EkrafMu / Visual Builder Pages)
  renderHome(ctx: ThemeContext) {
    let puckData: any = { content: [] };
    if (ctx.pageData && ctx.pageData.body) {
      try {
        puckData = JSON.parse(ctx.pageData.body);
      } catch (e) {
        puckData = {
          content: [
            { type: "CustomHTML", props: { id: "RawHTML", html: ctx.pageData.body } }
          ],
          root: {},
          zones: {}
        };
      }
    }

    // Generate inner content via PuckRender
    let renderedContent = '';
    try {
      renderedContent = ReactDOMServer.renderToString(
        React.createElement(PuckRender, {
          config: puckConfig as any,
          data: puckData
        })
      );
    } catch (err) {
      console.error("Error rendering Puck:", err);
      renderedContent = '<p class="text-red-500 text-center p-8">Gagal merender halaman visual.</p>';
    }

    // Dynamic posts replacement for RecentPosts block
    if (renderedContent.includes('recent-posts-placeholder')) {
      const posts = ctx.data || [];
      const recentPosts = posts.slice(0, 3);
      let dynamicPostsHtml = '';
      
      if (recentPosts.length > 0) {
        dynamicPostsHtml = recentPosts.map((p: any) => `
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-100 transition-all duration-300 flex flex-col group cursor-pointer" onclick="window.location.href='/${p.slug}'">
              <div class="h-48 w-full bg-slate-200 relative overflow-hidden">
                  <img src="${p.featured_image || 'https://placehold.co/800x400/eee/ccc?text=No+Image'}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                  <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">${p.category || 'Berita'}</div>
              </div>
              <div class="p-6 flex flex-col flex-grow">
                  <span class="text-sm text-slate-500 mb-2">${new Date(p.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</span>
                  <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition duration-300">${p.title}</h3>
                  <p class="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">${(p.body || '').replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                  <a href="/${p.slug}" class="text-green-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                      Baca Selengkapnya <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
              </div>
          </div>
        `).join('');
      } else {
        dynamicPostsHtml = '<p class="text-slate-500 col-span-3 text-center">Belum ada artikel yang diterbitkan.</p>';
      }

      // Regex replace to inject real posts instead of placeholder
      renderedContent = renderedContent.replace(
        /<div[^>]*class="[^"]*recent-posts-placeholder[^"]*"[^>]*>.*?<\/div>/g,
        `<div class="grid md:grid-cols-3 gap-8">${dynamicPostsHtml}</div>`
      );
    }

    // Determine if it's a standard page or landing page based on database layout
    const layout = ctx.pageData?.layout || 'standard';
    const isLandingPage = layout === 'landing';
    const layoutType = isLandingPage ? 'landing-page' : 'layout-fullwidth';
    
    const title = ctx.pageData?.title || ctx.site?.site_title || 'Halaman';
    
    // Pass everything to the master layout wrapper
    return this._layout(renderedContent, title, ctx, layoutType);
  },"""

# Use regex to find renderHome up to its closing brace before `// 3. TAMPILAN POST TUNGGAL`
pattern = r"  // 2\. TAMPILAN HOME \(Landing Page EkrafMu\)\s*\n\s*renderHome.*?return this\._layout\(html, 'Beranda EkrafMu', ctx, 'landing-page'\);\s*\n\s*},"

new_content = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open('src/cms/themes/labmu-pro/index.ts', 'w') as f:
    f.write(new_content)

