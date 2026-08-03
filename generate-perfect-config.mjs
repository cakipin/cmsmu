import fs from 'fs';

const configCode = `
import React from "react";
import type { Config } from "@puckeditor/core";

export type Props = {
  SiteHeader: {
    siteTitle: string;
    logoUrl: string;
    menuItems: { label: string; url: string }[];
    ctaText: string;
    ctaUrl: string;
  };
  Hero: {
    title: string;
    description: string;
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
  };
  FeatureGrid: {
    title: string;
    features: { title: string; description: string; icon: string }[];
  };
  Testimonial: {
    title: string;
    testimonials: { name: string; role: string; content: string; avatar: string }[];
  };
  RecentPosts: {
    title: string;
    subtitle: string;
    viewAllText: string;
    viewAllLink: string;
  };
  CallToAction: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  SiteFooter: {
    siteTitle: string;
    description: string;
    links: { label: string; url: string }[];
  };
  RichText: {
    content: string;
  };
  CustomHTML: {
    html: string;
  };
  Spacer: {
    height: number;
  };
};

export const puckConfig: Config<Props> = {
  components: {
    SiteHeader: {
      fields: {
        siteTitle: { type: "text" },
        logoUrl: { type: "text" },
        menuItems: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            url: { type: "text" }
          }
        },
        ctaText: { type: "text" },
        ctaUrl: { type: "text" }
      },
      defaultProps: {
        siteTitle: "EkrafMu",
        logoUrl: "",
        menuItems: [
          { label: "Program", url: "#program" },
          { label: "Mentor", url: "#mentor" },
          { label: "Berita", url: "#berita" }
        ],
        ctaText: "Masuk / Daftar",
        ctaUrl: "/login"
      },
      render: ({ siteTitle, logoUrl, menuItems, ctaText, ctaUrl }) => (
        <nav className="bg-white/90 backdrop-blur-md z-40 relative w-full border-b border-slate-100 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <a href="/" className="flex items-center gap-2">
                {logoUrl ? (
                   <img src={logoUrl} alt={siteTitle} className="h-10" />
                ) : (
                   <>
                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-500/30">
                       {siteTitle.charAt(0)}
                     </div>
                     <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                       {siteTitle}
                     </span>
                   </>
                )}
              </a>
              <div className="hidden md:flex items-center gap-8">
                {menuItems.map((item, i) => (
                  <a key={i} href={item.url} className="text-slate-600 hover:text-green-600 font-medium transition-colors">
                    {item.label}
                  </a>
                ))}
                {ctaText && (
                  <a href={ctaUrl} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    {ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>
      )
    },
    Hero: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        backgroundImage: { type: "text" },
        buttonText: { type: "text" },
        buttonLink: { type: "text" },
      },
      defaultProps: {
        title: "Selamat Datang di EkrafMu",
        description: "Membangun ekosistem UMKM dan ekonomi kreatif yang tangguh, inovatif, dan berdaya saing global melalui teknologi dan kolaborasi.",
        backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        buttonText: "Hubungi Kami",
        buttonLink: "/kontak",
      },
      render: ({ title, description, backgroundImage, buttonText, buttonLink }) => (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
            <img src={backgroundImage} alt={title} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-50"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              {title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              {description}
            </p>
            {buttonText && (
              <a href={buttonLink} className="inline-flex bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-green-600/30 items-center justify-center">
                {buttonText}
              </a>
            )}
          </div>
        </section>
      ),
    },
    FeatureGrid: {
      fields: {
        title: { type: "text" },
        features: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            icon: { type: "text" },
          },
        },
      },
      defaultProps: {
        title: "Layanan Kami",
        features: [
          { title: "Inovasi", description: "Mendorong kreativitas dan inovasi di bidang IT.", icon: "🚀" },
          { title: "Kolaborasi", description: "Membangun kerja sama strategis antar pelaku ekonomi kreatif.", icon: "🤝" },
        ],
      },
      render: ({ title, features }) => (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">{title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-2xl text-green-600 mb-6 mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },
    Testimonial: {
      fields: {
        title: { type: "text" },
        testimonials: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            role: { type: "text" },
            content: { type: "textarea" },
            avatar: { type: "text" },
          }
        }
      },
      defaultProps: {
        title: "Apa Kata Mereka",
        testimonials: [
          { name: "Ahmad", role: "Pengusaha", content: "Layanan sangat memuaskan dan profesional.", avatar: "https://placehold.co/100x100?text=A" }
        ]
      },
      render: ({ title, testimonials }) => (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">{title}</h2>
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory">
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-[300px] md:min-w-[400px] snap-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group transition-all hover:shadow-xl hover:shadow-green-900/5">
                  <div className="text-green-500 text-6xl absolute top-4 right-6 opacity-10 font-serif leading-none">"</div>
                  <p className="text-slate-600 text-lg italic mb-8 relative z-10">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-green-50" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    },
    RecentPosts: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        viewAllText: { type: "text" },
        viewAllLink: { type: "text" }
      },
      defaultProps: {
        title: "Kabar & Wawasan Terbaru",
        subtitle: "Ikuti perkembangan terbaru, kisah inspiratif, dan wawasan seputar ekonomi kreatif di ekosistem digital.",
        viewAllText: "Lihat Semua Artikel",
        viewAllLink: "/info"
      },
      render: ({ title, subtitle, viewAllText, viewAllLink }) => (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
                <p className="text-slate-600 text-lg">{subtitle}</p>
              </div>
              <div>
                <a href={viewAllLink} className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2 transition-all">
                  {viewAllText}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
              </div>
            </div>
            
            {/* INJECT POSTS HERE: This div will be replaced by the dynamicPostsHtml in index.ts */}
            <div className="recent-posts-placeholder">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-100 animate-pulse h-64 rounded-2xl"></div>
                <div className="bg-slate-100 animate-pulse h-64 rounded-2xl hidden md:block"></div>
                <div className="bg-slate-100 animate-pulse h-64 rounded-2xl hidden md:block"></div>
              </div>
            </div>
          </div>
        </section>
      )
    },
    CallToAction: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        buttonText: { type: "text" }
      },
      defaultProps: {
        title: "Siap Mengelevasi Skala Bisnis Anda?",
        subtitle: "Bergabunglah dengan ratusan inovator lainnya. Pendaftaran batch inkubasi bulan ini segera ditutup.",
        buttonText: "Kirim Profil Usaha"
      },
      render: ({ title, subtitle, buttonText }) => (
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
            <p className="text-slate-300 text-lg mb-10">{subtitle}</p>
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto text-left opacity-75">
              <p className="text-center text-slate-500 mb-6">Formulir pendaftaran interaktif (Simulasi Canvas)</p>
              <button disabled className="w-full bg-slate-300 text-white font-bold py-4 rounded-xl text-lg cursor-not-allowed">
                  {buttonText}
              </button>
            </div>
          </div>
        </section>
      )
    },
    SiteFooter: {
      fields: {
        siteTitle: { type: "text" },
        description: { type: "textarea" },
        links: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            url: { type: "text" }
          }
        }
      },
      defaultProps: {
        siteTitle: "EkrafMu",
        description: "Membangun ekosistem UMKM dan ekonomi kreatif yang tangguh, inovatif, dan berdaya saing global.",
        links: [
          { label: "Inkubasi Bisnis", url: "#" },
          { label: "Pendanaan Digital", url: "#" },
          { label: "Sertifikasi Halal", url: "#" },
          { label: "Pemasaran Global", url: "#" }
        ]
      },
      render: ({ siteTitle, description, links }) => (
        <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 lg:col-span-1">
                <a href="/" className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30">{siteTitle.charAt(0)}</div>
                  <span className="text-xl font-bold text-white">{siteTitle}</span>
                </a>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">f</div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">t</div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">i</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-6">Program Kami</h3>
                <ul className="space-y-4">
                  {links.map((link, i) => (
                    <li key={i}><a href={link.url} className="text-slate-400 hover:text-green-400 transition-colors text-sm">{link.label}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-6">Pusat Bantuan</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm">FAQ</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm">Panduan Pengguna</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm">Kebijakan Privasi</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-6">Hubungi Kami</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-400 text-sm">
                    <span>Jakarta Pusat 10340</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm">
                    <a href="mailto:halo@ekrafmu.id" className="hover:text-green-400 transition-colors">halo@ekrafmu.id</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:text-left">
              <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
              <div className="mt-4 md:mt-0 space-x-4">
                <span className="text-slate-600 text-sm">Built with LabMu Framework</span>
              </div>
            </div>
          </div>
        </footer>
      )
    },
    RichText: {
      fields: {
        content: { type: "textarea" },
      },
      defaultProps: {
        content: "<h2>Judul Halaman</h2><p>Tulis teks lengkap Anda di sini.</p>",
      },
      render: ({ content }) => (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-green" dangerouslySetInnerHTML={{ __html: content }} />
        </section>
      ),
    },
    CustomHTML: {
      fields: {
        html: { type: "textarea" }
      },
      defaultProps: {
        html: "<div class='text-center p-8 bg-slate-100 rounded-lg'>Halo, ini Custom HTML!</div>"
      },
      render: ({ html }) => (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )
    },
    Spacer: {
      fields: {
        height: { type: "number" },
      },
      defaultProps: {
        height: 40,
      },
      render: ({ height }) => (
        <div style={{ height: `${height}px` }} aria-hidden="true" />
      ),
    }
  },
};
`
fs.writeFileSync('src/cms/themes/labmu-pro/puck/config.tsx', configCode);
