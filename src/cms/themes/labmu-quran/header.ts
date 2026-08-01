// src/themes/labmu-quran/header.ts
import type { ThemeContext } from '../types';

export function renderHeader(ctx?: ThemeContext) {
  return `
    <header class="header-wrapper">
      <div class="header-inner">
        
        <a href="https://khgt.muhammadiyah.or.id" target="_blank" id="hijri-badge-desktop" class="hijri-badge desktop-only" title="Cek Kalender KHGT">
          Loading...
        </a>

        <a href="/" class="brand-logo" style="font-family:'Amiri', serif;">
          QuranMu
        </a>

        <div class="header-right">
          
          <div class="header-desktop">
            <div class="custom-dropdown">
              <div class="dropdown-trigger" onclick="toggleQariMenu()">
                <span id="qari-label-desktop">Qari</span>
                <i class="fas fa-chevron-down" style="font-size:0.7rem"></i>
              </div>
              <div class="dropdown-content" id="qari-list">
                <a class="dropdown-item" onclick="selectQari('01', 'Abdullah Al-Juhany')">Abdullah Al-Juhany</a>
                <a class="dropdown-item" onclick="selectQari('02', 'Abdul Muhsin Al-Qasim')">Abdul Muhsin Al-Qasim</a>
                <a class="dropdown-item" onclick="selectQari('03', 'Abdurrahman As-Sudais')">Abdurrahman As-Sudais</a>
                <a class="dropdown-item" onclick="selectQari('04', 'Ibrahim Al-Akhdar')">Ibrahim Al-Akhdar</a>
                <a class="dropdown-item" onclick="selectQari('05', 'Misyari Rasyid')">Misyari Rasyid</a>
              </div>
            </div>
             
            <button class="btn-icon-head" id="btn-latin" onclick="toggleMode('latin')" title="Transliterasi Latin">
              <i class="fas fa-font"></i>
            </button>
            <button class="btn-icon-head" id="btn-id" onclick="toggleMode('id')" title="Terjemahan Indonesia">
              🇮🇩
            </button>
            <button class="btn-icon-head" id="btn-en" onclick="toggleMode('en')" title="Terjemahan Inggris">
              🇬🇧
            </button>
            <button class="btn-icon-head" id="btn-tajwid" onclick="window.toggleMode('tajwid')" title="Warna Tajwid">
            <i class="fas fa-palette"></i>
            </button>
            <button class="btn-icon-head" onclick="toggleMode('theme')" title="Mode Gelap">
              <i class="fas fa-adjust"></i>
            </button>
          </div>


          <button class="burger-btn" onclick="toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>

        </div>
      </div>
    </header>

    <div id="mobile-sidebar" class="sidebar-menu">
      <div class="sidebar-header">
        <span style="font-weight:bold; font-size:1.2rem;">Menu</span>
        <button onclick="toggleSidebar()" style="background:none; border:none; font-size:1.5rem; color:var(--text-main);">
          <i class="fas fa-times"></i>
        </button>
      </div>
        
      <div class="sidebar-content">
        <div class="sidebar-group">
          <div id="hijri-badge-mobile" class="sidebar-calendar-box">Loading...</div>
        </div>

        <div class="sidebar-group">
          <label>Pilih Qari</label>
          <select id="qari-select-mobile" onchange="selectQariMobile(this.value)" class="mobile-select">
            <option value="05" selected>Misyari Rasyid</option>
            <option value="01">Abdullah Al-Juhany</option>
            <option value="02">Abdul Muhsin Al-Qasim</option>
            <option value="03">Abdurrahman As-Sudais</option>
            <option value="04">Ibrahim Al-Akhdar</option>
          </select>
        </div>
            
        <div class="sidebar-group">
          <label>Tampilan Bahasa</label>
          <div style="display:flex; gap:10px;">
            <button class="btn-sidebar-toggle" id="btn-latin-m" onclick="toggleMode('latin')">
              <i class="fas fa-font"></i> Latin
            </button>
            <button class="btn-sidebar-toggle" id="btn-id-m" onclick="toggleMode('id')">
              🇮🇩 Indo
            </button>
            <button class="btn-sidebar-toggle" id="btn-en-m" onclick="toggleMode('en')">
              🇬🇧 Inggris
            </button>
          </div>
        </div>
            
        <div class="sidebar-group">
          <label>Tema</label>
          <button class="btn-sidebar-block" onclick="toggleMode('theme')">
            <i class="fas fa-adjust"></i> Ganti Mode Gelap/Terang
          </button>
        </div>
      </div>
    </div>

    <div id="sidebar-overlay" class="sidebar-overlay" onclick="toggleSidebar()"></div>
  `;
}