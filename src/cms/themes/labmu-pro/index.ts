import type { ThemeStructure, ThemeContext } from '../types';
import { css } from './style';
import { renderHeader, renderFooter, renderSidebar, renderHero, renderBreadcrumbs, renderShareButtons } from './components';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Render as PuckRender } from '@puckeditor/core';
import { puckConfig } from './puck/config';

const LabMuPro: ThemeStructure = {
  name: 'LabMu Pro Framework',
  version: '3.0.0', // Major update to boilerplate framework
  author: 'LabMu Team',

  // 1. LAYOUT MASTER
  _layout(content: string, title: string, ctx: ThemeContext, layoutType: string = 'layout-right-sidebar') {
    
    // LOGIC PINTAR MEMILIH DATA SIDEBAR
    let sidebarData: any[] = [];
    if (ctx.sidebarPosts && Array.isArray(ctx.sidebarPosts)) {
        sidebarData = ctx.sidebarPosts;
    } else if (Array.isArray(ctx.data)) {
        sidebarData = ctx.data;
    }

    const isLandingPage = layoutType === 'landing-page';

    // Vanilla JS for Interactive Components
    const modularJs = `
      <script>
        // DOM Ready
        document.addEventListener('DOMContentLoaded', () => {
          
          // 1. Theme Toggle (Dark/Light Mode)
          const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
          
          const toggles = document.querySelectorAll('.theme-toggle');
          toggles.forEach(btn => {
            btn.addEventListener('click', () => {
              const currentTheme = document.documentElement.getAttribute('data-theme');
              const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);
            });
          });

          // 2. Burger Menu (Mobile)
          const burgerBtn = document.getElementById('burgerBtn');
          const mobileMenu = document.getElementById('mobileMenu');
          if(burgerBtn && mobileMenu) {
            burgerBtn.addEventListener('click', () => {
              mobileMenu.classList.toggle('active');
            });
          }

          // 3. Accordion
          const accordions = document.querySelectorAll('.accordion-header');
          accordions.forEach(acc => {
            acc.addEventListener('click', function() {
              this.classList.toggle('active');
              const panel = this.nextElementSibling;
              if (panel.classList.contains('active')) {
                panel.classList.remove('active');
              } else {
                panel.classList.add('active');
              }
            });
          });

          // 4. Tabs
          const tabBtns = document.querySelectorAll('.tab-btn');
          tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
              const target = this.getAttribute('data-target');
              const tabGroup = this.closest('.tabs').parentElement;
              
              tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
              this.classList.add('active');
              
              tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
              tabGroup.querySelector(target).classList.add('active');
            });
          });

        });
      </script>
    `;

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${ctx.site.site_title || 'CMSMu'}</title>
        <meta name="description" content="${ctx.data?.excerpt || ctx.site.site_desc || ''}">
        
        <!-- Open Graph / Social Media Meta Tags -->
        <meta property="og:title" content="${title} - ${ctx.site.site_title || 'CMSMu'}">
        <meta property="og:description" content="${ctx.data?.excerpt || ctx.site.site_desc || ''}">
        <meta property="og:image" content="${ctx.data?.featured_image || ctx.site?.site_logo || ''}">
        <meta property="og:type" content="${ctx.data?.type === 'post' ? 'article' : 'website'}">
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title} - ${ctx.site.site_title || 'CMSMu'}">
        <meta name="twitter:description" content="${ctx.data?.excerpt || ctx.site.site_desc || ''}">
        <meta name="twitter:image" content="${ctx.data?.featured_image || ctx.site?.site_logo || ''}">
        
        <!-- Preconnect & Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        ${isLandingPage ? '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">' : ''}
        
        <!-- Icons -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        
        ${isLandingPage ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
        
        <style>
          :root {
            --primary: ${ctx.site?.theme_primary || '#2563eb'};
            --bg-body: ${ctx.site?.theme_bg || '#f8fafc'};
            --bg-card: ${ctx.site?.theme_bg || '#ffffff'};
            --text-main: ${ctx.site?.theme_text || '#334155'};
            --accent: ${ctx.site?.theme_accent || '#f59e0b'};
            --header-text: ${ctx.site?.header_text_color || '#334155'};
          }
          ${css}
        </style>
      </head>
      <body>
        <!-- Hook: before_header -->
        ${!isLandingPage ? renderHeader(ctx) : ''}
        
        <!-- Hook: before_main_content -->
        ${layoutType === 'home' ? renderHero(ctx) : ''}

        ${isLandingPage ? `
          <main id="main-content" role="main">
            ${content}
          </main>
        ` : `
        <div class="container main-wrapper ${layoutType}">
          ${layoutType === 'layout-left-sidebar' ? renderSidebar(sidebarData, parseInt(ctx.site?.sidebar_popular_limit as any) || 5) : ''}

          <main id="main-content" role="main">
            ${content}
          </main>

          ${layoutType === 'layout-right-sidebar' ? renderSidebar(sidebarData, parseInt(ctx.site?.sidebar_popular_limit as any) || 5) : ''}
        </div>
        `}

        <!-- Hook: after_main_content -->
        ${!isLandingPage ? renderFooter(ctx) : ''}

        ${modularJs}
        <!-- Hook: wp_footer equivalent -->
      </body>
      </html>
    `;
  },

  // 2. TAMPILAN HOME (Landing Page EkrafMu)
  renderHome(ctx: ThemeContext) {
    const posts = ctx.data || [];
    
    // Build dynamic posts HTML (up to 3 posts)
    let dynamicPostsHtml = '';
    if (posts.length > 0) {
      const recentPosts = posts.slice(0, 3);
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

    const html = `
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .hero-pattern { background-color: #f8fafc; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
    
    <div class="text-slate-800 antialiased">
        <!-- Navbar -->
        <nav id="navbar" class="fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b-[1px] border-green-200 rounded-b-[40px]">
            <div class="w-full px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <a href="/" class="flex-shrink-0 flex items-center gap-2 decoration-transparent">
                        ${ctx.site?.site_logo 
                          ? `<img src="${ctx.site.site_logo}" alt="${ctx.site?.site_title || 'Logo'}" class="h-10 w-auto">` 
                          : `<div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">${(ctx.site?.site_title || 'E').charAt(0)}</div>
                             <span class="font-bold text-xl text-slate-900">${ctx.site?.site_title || 'Ekraf<span class="text-green-600">Mu</span>'}</span>`
                        }
                    </a>
                    <div class="hidden md:flex space-x-6 lg:space-x-8">
                        <a href="#manfaat" class="text-slate-600 hover:text-green-600 font-medium transition">Keunggulan</a>
                        <a href="#testimoni" class="text-slate-600 hover:text-green-600 font-medium transition">Kisah Sukses</a>
                        <a href="#berita" class="text-slate-600 hover:text-green-600 font-medium transition">Berita & Artikel</a>
                        <a href="#gabung" class="text-slate-600 hover:text-green-600 font-medium transition">Daftar Inkubasi</a>
                    </div>
                    <div class="hidden md:flex">
                        <a href="#gabung" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold transition shadow-lg shadow-green-600/30">
                            Mulai Bergabung
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <!-- Background Image & Overlay -->
            <div class="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" alt="Ekosistem Digital EkrafMu" class="w-full h-full object-cover object-center">
                <div class="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50"></div>
            </div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div class="inline-block mb-4 px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm border border-green-200">
                    🚀 Mendorong Kemandirian Umat
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                    Bangun Bisnis Kreatif Anda <br class="hidden md:block">
                    Menuju Ekosistem <span class="text-green-600">Berkemajuan</span>
                </h1>
                <p class="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                    Lembaga Ekonomi Kreatif Muhammadiyah hadir untuk mendampingi pelaku UMKM, kreator, dan inovator digital dengan pendekatan syariah, teknologi modern, dan jaringan global.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="#gabung" class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-green-600/30 flex items-center justify-center gap-2">
                        Daftar Inkubasi Sekarang
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                    <a href="#berita" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg transition flex items-center justify-center">
                        Baca Berita Terbaru
                    </a>
                </div>
                
                <!-- Social Proof / Mitra -->
                <div class="mt-16 pt-8 border-t border-slate-200">
                    <p class="text-sm text-slate-500 font-medium mb-6 uppercase tracking-wider">Dipercaya & Berkolaborasi Dengan</p>
                    <div class="flex justify-center flex-wrap gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition duration-300">
                        <div class="text-xl font-bold">SatuMu</div>
                        <div class="text-xl font-bold">Suara Muhammadiyah</div>
                        <div class="text-xl font-bold">BTM</div>
                        <div class="text-xl font-bold">Lazismu</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Manfaat Section -->
        <section id="manfaat" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Mengapa Bergabung Bersama Kami?</h2>
                    <p class="text-slate-600 text-lg">Kami memadukan prinsip ekonomi Islam dengan literasi digital untuk memastikan bisnis Anda tumbuh secara etis dan eksponensial.</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 group">
                        <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Akselerasi Digital</h3>
                        <p class="text-slate-600 leading-relaxed">Pendampingan integrasi sistem, dari pengelolaan server awan, otomasi database, hingga optimasi antarmuka digital UMKM.</p>
                    </div>
                    <!-- Feature 2 -->
                    <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 group">
                        <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Jaringan Saudagar</h3>
                        <p class="text-slate-600 leading-relaxed">Akses eksklusif ke ribuan pelaku usaha dalam ekosistem persyarikatan untuk kolaborasi silang dan rantai pasok.</p>
                    </div>
                    <!-- Feature 3 -->
                    <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-500 hover:shadow-lg transition-all duration-300 group">
                        <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-3">Pendampingan Syariah</h3>
                        <p class="text-slate-600 leading-relaxed">Memastikan model bisnis, pendanaan, dan operasional Anda sesuai dengan prinsip ekonomi Islam yang amanah.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimoni Slider Section -->
        <section id="testimoni" class="py-20 bg-slate-50 border-t border-slate-200 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div class="max-w-2xl">
                        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Mereka yang Tumbuh Bersama Kami</h2>
                        <p class="text-slate-600 text-lg">Bukti nyata dari pelaku ekonomi kreatif dan UMKM yang telah merasakan manfaat dari program inkubasi dan jaringan EkrafMu.</p>
                    </div>
                    <div class="flex gap-3">
                        <button id="prevBtn" class="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition duration-300">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button id="nextBtn" class="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition duration-300">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>

                <div id="sliderContainer" class="flex items-stretch gap-6 overflow-x-auto hide-scroll snap-x snap-mandatory pb-8">
                    <!-- Testimoni 1 -->
                    <div class="snap-start shrink-0 w-full sm:w-[calc(100%)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition flex flex-col">
                        <div class="flex text-yellow-400 mb-4">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        </div>
                        <p class="text-slate-700 italic mb-8 flex-grow leading-relaxed">"Program inkubasi ini luar biasa. Startup SaaS kami kini terintegrasi dengan jaringan Amal Usaha Muhammadiyah. Omzet bulanan naik hingga 300% dalam waktu 6 bulan."</p>
                        <div class="flex items-center gap-5 mt-auto pt-6 border-t border-slate-100">
                            <img src="https://ui-avatars.com/api/?name=Hasan+AlBanna&background=16a34a&color=fff" alt="Avatar" class="w-20 h-20 rounded-full object-cover border-[3px] border-green-50 shadow-md">
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">Hasan Al-Banna</h4>
                                <p class="text-sm text-slate-500">Founder EduTech Islam</p>
                            </div>
                        </div>
                    </div>

                    <!-- Testimoni 2 -->
                    <div class="snap-start shrink-0 w-full sm:w-[calc(100%)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition flex flex-col">
                        <div class="flex text-yellow-400 mb-4">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        </div>
                        <p class="text-slate-700 italic mb-8 flex-grow leading-relaxed">"Awalnya laporan keuangan butik kami sangat berantakan. Setelah didampingi mentor dari EkrafMu, kami berhasil digitalisasi aset dan mendapatkan pendanaan syariah dari BTM."</p>
                        <div class="flex items-center gap-5 mt-auto pt-6 border-t border-slate-100">
                            <img src="https://ui-avatars.com/api/?name=Siti+Aisyah&background=16a34a&color=fff" alt="Avatar" class="w-20 h-20 rounded-full object-cover border-[3px] border-green-50 shadow-md">
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">Siti Aisyah</h4>
                                <p class="text-sm text-slate-500">Pemilik Modest Fashion</p>
                            </div>
                        </div>
                    </div>

                    <!-- Testimoni 3 -->
                    <div class="snap-start shrink-0 w-full sm:w-[calc(100%)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition flex flex-col">
                        <div class="flex text-yellow-400 mb-4">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        </div>
                        <p class="text-slate-700 italic mb-8 flex-grow leading-relaxed">"Pengetahuan tentang pemasaran digital yang diajarkan oleh mentor EkrafMu sangat aplikatif. Omzet kerajinan tangan kami meningkat pesat dan bisa menyerap lebih banyak tenaga kerja sekitar."</p>
                        <div class="flex items-center gap-5 mt-auto pt-6 border-t border-slate-100">
                            <img src="https://ui-avatars.com/api/?name=Fatimah+Azzahra&background=16a34a&color=fff" alt="Avatar" class="w-20 h-20 rounded-full object-cover border-[3px] border-green-50 shadow-md">
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">Fatimah Azzahra</h4>
                                <p class="text-sm text-slate-500">Pengrajin & Sociopreneur</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Berita / Blog Section -->
        <section id="berita" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div class="max-w-2xl">
                        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kabar & Wawasan Terbaru</h2>
                        <p class="text-slate-600 text-lg">Ikuti perkembangan terbaru, kisah inspiratif, dan wawasan seputar ekonomi kreatif di ekosistem digital.</p>
                    </div>
                    <div>
                        <a href="/info" class="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2 transition-all">
                            Lihat Semua Artikel
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    ${dynamicPostsHtml}
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section id="gabung" class="py-20 bg-slate-900 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 via-transparent to-transparent"></div>
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Siap Mengelevasi Skala Bisnis Anda?</h2>
                <p class="text-slate-300 text-lg mb-10">Bergabunglah dengan ratusan inovator lainnya. Pendaftaran batch inkubasi bulan ini segera ditutup.</p>
                
                <form class="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto text-left" onsubmit="event.preventDefault(); alert('Pendaftaran berhasil disimulasikan!');">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                            <input type="text" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" placeholder="Cth: Ahmad Dahlan">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp</label>
                            <input type="tel" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" placeholder="0812-xxxx-xxxx">
                        </div>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-slate-700 mb-2">Sektor Usaha Kreatif</label>
                        <select class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                            <option>Pengembangan Perangkat Lunak & IT</option>
                            <option>Desain Grafis & Multimedia</option>
                            <option>Kuliner & F&B</option>
                            <option>Kriya & Fashion</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition duration-300 text-lg shadow-lg shadow-green-600/30">
                        Kirim Profil Usaha
                    </button>
                    <p class="text-center text-sm text-slate-500 mt-4">Data Anda aman dan dikelola secara rahasia.</p>
                </form>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-white py-10 border-t border-slate-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center gap-2 mb-4 md:mb-0">
                    ${ctx.site?.header_logo_url 
                      ? `<img src="${ctx.site.header_logo_url}" alt="${ctx.site?.site_title || 'Logo'}" class="h-8 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition">` 
                      : `<div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${(ctx.site?.site_title || 'E').charAt(0)}</div>
                         <span class="font-bold text-lg text-slate-900">${ctx.site?.site_title || 'Ekraf<span class="text-green-600">Mu</span>'}</span>`
                    }
                </div>
                <p class="text-slate-500 text-sm text-center md:text-left">
                    &copy; 2026 Lembaga Ekonomi Kreatif Muhammadiyah. Hak Cipta Dilindungi.
                </p>
            </div>
        </footer>
    </div>
    
    <script>
        // DOM Ready handling that works within the SPA layout
        setTimeout(() => {
            // Efek transisi pada Navbar saat di-scroll
            window.addEventListener('scroll', () => {
                const nav = document.getElementById('navbar');
                if (nav) {
                    if (window.scrollY > 20) {
                        nav.classList.add('shadow-md', 'py-2');
                        nav.classList.remove('py-4');
                    } else {
                        nav.classList.remove('shadow-md', 'py-2');
                        nav.classList.add('py-4');
                    }
                }
            });

            // Logika Slider Testimoni
            const sliderContainer = document.getElementById('sliderContainer');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');

            if (sliderContainer && prevBtn && nextBtn) {
                // Fungsi scroll ke kanan
                nextBtn.addEventListener('click', () => {
                    if (sliderContainer.firstElementChild) {
                        const slideWidth = sliderContainer.firstElementChild.clientWidth + 24;
                        sliderContainer.scrollBy({ left: slideWidth, behavior: 'smooth' });
                    }
                });

                // Fungsi scroll ke kiri
                prevBtn.addEventListener('click', () => {
                    if (sliderContainer.firstElementChild) {
                        const slideWidth = sliderContainer.firstElementChild.clientWidth + 24;
                        sliderContainer.scrollBy({ left: -slideWidth, behavior: 'smooth' });
                    }
                });
            }
        }, 100);
    </script>
    `;
    
    return this._layout(html, 'Beranda EkrafMu', ctx, 'landing-page');
  },

  // 4. TAMPILAN KATEGORI & PENCARIAN
  renderCategory(ctx: ThemeContext) {
    const posts = ctx.data || [];
    const title = ctx.categoryName || 'Kategori';
    
    let html = '';
    
    if (posts.length === 0) {
      html = `<div style="text-align: center; padding: 50px 20px;">
        <h2 style="font-size: var(--text-xl); color: var(--text-main);">Belum ada artikel ditemukan.</h2>
      </div>`;
    } else {
      html = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size:var(--text-2xl); border-bottom: 2px solid var(--primary); padding-bottom:10px; display:inline-block;">${title}</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-2">
        ${posts.map((p: any) => `
          <article class="card post-card">
            <a href="/${p.slug}">
              <img src="${p.featured_image || 'https://placehold.co/600x400/eee/ccc?text=No+Image'}" class="post-thumb" alt="${p.title}" loading="lazy">
            </a>
            <div class="post-content">
              <span class="badge badge-primary" style="align-self: flex-start; margin-bottom: 10px;">${p.category || p.type}</span>
              <h3 class="post-title"><a href="/${p.slug}">${p.title}</a></h3>
              <p class="post-excerpt">${(p.body || '').replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
              
              <div class="post-meta">
                <span><i class="far fa-calendar"></i> ${new Date(p.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}</span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>`;

      // Tambahkan Pagination Jika Ada
      if (ctx.pagination && ctx.pagination.totalPages > 1) {
          const p = ctx.pagination;
          const baseUrl = p.baseUrl || `/search?q=${ctx.query || ''}`;
          
          html += `<div style="margin-top: 40px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">`;
          
          if (p.hasPrev) {
              html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${p.currentPage - 1}" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-weight: 500; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='var(--primary)'; this.style.color='white'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text-main)'; this.style.borderColor='var(--border-color)';">&laquo; Sebelumnya</a>`;
          }
          
          for (let i = 1; i <= p.totalPages; i++) {
              if (i === p.currentPage) {
                  html += `<span style="padding: 8px 16px; background: var(--primary); color: white; border-radius: 8px; font-weight: bold;">${i}</span>`;
              } else {
                  html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${i}" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-weight: 500; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='var(--primary)'; this.style.color='white'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text-main)'; this.style.borderColor='var(--border-color)';">${i}</a>`;
              }
          }

          if (p.hasNext) {
              html += `<a href="${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${p.currentPage + 1}" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-weight: 500; text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='var(--primary)'; this.style.color='white'; this.style.borderColor='var(--primary)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text-main)'; this.style.borderColor='var(--border-color)';">Selanjutnya &raquo;</a>`;
          }
          
          html += `</div>`;
      }
    }
    
    return this._layout(html, title, ctx, 'layout-right-sidebar');
  },

  renderSearch(ctx: ThemeContext) {
      if (ctx.query === '_') {
          ctx.categoryName = 'Semua Artikel';
      } else {
          ctx.categoryName = `Hasil Pencarian: "${ctx.query}"`;
      }
      return this.renderCategory(ctx);
  },

  // 3. TAMPILAN SINGLE POST
  renderSingle(ctx: ThemeContext) {
    const post = ctx.data;
    if (!post) return this.render404(ctx);
    
    // Breadcrumbs
    const breadcrumbs = renderBreadcrumbs([
      { label: post.category || 'Blog', url: post.category ? '/' + post.category.toLowerCase().replace(/\s+/g, '-') : '/blog' },
      { label: post.title }
    ]);

    // Social Share
    const baseUrl = ctx.site?.url || 'https://cmsmu.pages.dev';
    const fullUrl = `${baseUrl}/${post.slug}`;
    const shareButtons = renderShareButtons(fullUrl, post.title);

    // Render list tags HTML
    const tagsHtml = post.tags 
      ? post.tags.split(',').map((t: string) => `<a href="/search?q=${encodeURIComponent(t.trim())}" class="badge" style="margin-right:5px; text-decoration:none;">#${t.trim()}</a>`).join('')
      : '';

    // Structured Data (Schema.org)
    const schemaOrg = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "image": post.featured_image ? [post.featured_image] : [],
      "datePublished": new Date(post.created_at).toISOString(),
      "author": [{
          "@type": "Person",
          "name": "Admin",
          "url": baseUrl
        }]
    };

    const html = `
      <article>
        ${breadcrumbs}
        
        <div class="entry-header">
           <h1 class="entry-title">${post.title}</h1>
           <div class="entry-meta">
              <span><i class="far fa-calendar"></i> ${new Date(post.created_at).toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
              <span><i class="far fa-folder"></i> ${post.category || post.type}</span>
              <span><i class="far fa-user"></i> Admin</span>
           </div>
        </div>

        ${post.featured_image ? `<img src="${post.featured_image}" class="entry-image" alt="${post.title}" loading="lazy">` : ''}

        <div class="entry-content">
          <!-- Hook: before_content -->
          ${post.body || '<p>Isi konten belum ditulis...</p>'}
          <!-- Hook: after_content -->
        </div>

        ${tagsHtml ? `
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-color);">
             <strong style="margin-right:10px; color:var(--text-main);">Tags:</strong> ${tagsHtml}
          </div>
        ` : ''}

        ${shareButtons}
        
        <!-- Schema Markup -->
        <script type="application/ld+json">
          ${JSON.stringify(schemaOrg)}
        </script>
      </article>
    `;
    return this._layout(html, post.title, ctx, 'layout-right-sidebar');
  },

  // 4. PAGE & 404
  renderPage(ctx: ThemeContext) {
    const post = ctx.data;
    if (!post) return this.render404(ctx);

    const breadcrumbs = renderBreadcrumbs([
      { label: 'Halaman', url: '#' },
      { label: post.title }
    ]);

    let contentHtml = post.body || '<p>Isi konten belum ditulis...</p>';

    // Deteksi apakah body adalah JSON Puck
    if (contentHtml.trim().startsWith('{') && contentHtml.trim().endsWith('}')) {
      try {
        const puckData = JSON.parse(contentHtml);
        if (puckData.content) {
          // Render SSR dengan React
          contentHtml = ReactDOMServer.renderToString(
            React.createElement(PuckRender, {
              config: puckConfig,
              data: puckData
            })
          );
        }
      } catch (e) {
        console.error("Gagal parse Puck JSON di renderPage:", e);
      }
    }

    // Halaman biasanya menggunakan layout full width (tanpa sidebar)
    const html = `
      <article>
        ${breadcrumbs}
        <div class="entry-header">
           <h1 class="entry-title">${post.title}</h1>
        </div>
        ${post.featured_image ? `<img src="${post.featured_image}" class="entry-image" alt="${post.title}" loading="lazy">` : ''}
        <div class="entry-content">
          ${contentHtml}
        </div>
      </article>
    `;
    
    return this._layout(html, post.title, ctx, 'layout-full-width');
  },

  render404(ctx: ThemeContext) {
    const html = `
      <div style="text-align:center; padding: 100px 0; max-width:600px; margin:0 auto;">
        <h1 style="font-size:6rem; color:var(--primary); margin-bottom:0;">404</h1>
        <h2 style="font-size:2rem; margin-bottom:1rem;">Halaman Tidak Ditemukan</h2>
        <p style="color:var(--text-muted); margin-bottom:2rem;">Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak pernah ada.</p>
        <a href="/" class="btn btn-primary"><i class="fas fa-home"></i> Kembali ke Beranda</a>
      </div>
    `;
    return this._layout(html, 'Not Found', ctx, 'layout-full');
  }
};

export default LabMuPro;