import type { ThemeContext } from '../../themes/types';

export const renderHeader = (ctx: ThemeContext) => `
  <header class="quran-header">
    <a href="/quran" class="brand-quran">
       <i class="fas fa-quran"></i> <span style="display:none; @media(min-width:640px){display:inline;}">QuranMu</span>
    </a>

    <div class="header-controls">
        
        <select id="qari-switcher" class="control-select" onchange="changeQari(this.value)" title="Pilih Qari">
            <option value="05">Syeikh Misyari Rasyid</option>
            <option value="01">Syeikh Abdullah Al-Juhany</option>
            <option value="02">Syeikh Abdul Muhsin</option>
            <option value="03">Syeikh Ahmed Al-Ajmy</option>
            <option value="04">Syeikh Ibrahim Al-Dossari</option>
        </select>

        <select id="lang-switcher" class="control-select" onchange="changeLanguage(this.value)" title="Pilih Bahasa">
            <option value="id">🇮🇩 ID</option>
            <option value="en">🇬🇧 EN</option>
        </select>

        <button class="btn-icon" onclick="toggleTheme()" title="Ganti Mode Siang/Malam">
            <i class="fas fa-moon" id="theme-icon"></i>
        </button>
    </div>
  </header>
`;