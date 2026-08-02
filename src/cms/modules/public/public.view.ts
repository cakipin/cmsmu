import type { D1Database } from '@cloudflare/workers-types'
import { getActiveTheme } from '../../themes/registry' 
import LabMuQuran from '../../themes/labmu-quran'

export const renderPublicPage = async (db: D1Database, content: any = null, posts: any[] = []) => {
  
  // 1. Ambil Settingan
  const { results } = await db.prepare("SELECT key, value FROM options").all();
  const opts: any = {};
  results.forEach((row: any) => opts[row.key] = row.value);

  const siteInfo = {
    title: opts.site_title || 'LabMu CMS',
    description: opts.site_desc || 'Welcome to LabMu',
    url: '/'
  };

  // 2. LOGIC ROUTING QURAN (PERBAIKAN DISINI)
  
  // KASUS A: HALAMAN DAFTAR SURAT (/quran)
  if (content && content.slug === 'quran') {
     // Panggil renderHome milik tema Quran
     // Masukkan 'posts' (List Surat) ke dalam 'data'
     return LabMuQuran.renderHome({ site: siteInfo, data: posts });
  }
  
  // KASUS B: HALAMAN BACA SURAT (/quran/1)
  if (content && content.slug.startsWith('quran/')) {
     // Panggil renderSingle milik tema Quran
     // Masukkan 'content' (Detail Surat) ke dalam 'data'
     return LabMuQuran.renderSingle({ site: siteInfo, data: content });
  }

  // 3. LOGIC WEBSITE BIASA (Artikel/Page)
  const activeThemeId = opts.active_theme || 'labmu-default';
  const CurrentTheme = getActiveTheme(activeThemeId);

  const themeConfig = {
    header: {
      logoUrl: opts.header_logo_url || '',
      menuPosition: opts.header_menu_position || 'right',
      backgroundColor: opts.theme_bg || '',
      textColor: opts.theme_text || ''
    },
    colors: {
      primary: opts.theme_primary,
      primaryDark: opts.theme_primary_dark,
      background: opts.theme_bg,
      text: opts.theme_text,
      accent: opts.theme_accent
    }
  };

  if (!content) {
    return CurrentTheme.renderHome({
      site: siteInfo,
      themeConfig: themeConfig,
      data: posts,
      sidebarPosts: posts 
    });
  } else {
    return CurrentTheme.renderSingle({
      site: siteInfo,
      themeConfig: themeConfig,
      data: content,
      sidebarPosts: posts
    });
  }
};