// src/themes/labmu-quran/footer.ts
import type { ThemeContext } from '../types';

export function renderFooter(ctx: ThemeContext) {
  const year = new Date().getFullYear();
  const siteName = ctx.site.site_title || 'LabMu CMS';

  // PERHATIKAN: Ada class "labmu-footer" disini
  return `
    <footer class="labmu-footer">
      <span>&copy; ${year} <strong>${siteName}$dev cak iPin</strong></span>
    </footer>
  `;
}