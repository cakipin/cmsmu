export interface ThemeContext {
  site: {
    title: string;
    description: string;
    url: string;
  };
  data?: any;           // Data Utama (Bisa Single Post atau List Post)
  sidebarPosts?: any[]; // <--- TAMBAHAN: Data Khusus Sidebar
}

export interface ThemeStructure {
  name: string;
  version: string;
  author: string;
  
  renderHome(ctx: ThemeContext): string;
  renderSingle(ctx: ThemeContext): string;
  renderPage(ctx: ThemeContext): string;
  render404(ctx: ThemeContext): string;
}