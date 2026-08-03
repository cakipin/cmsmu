import fs from 'fs';

let configStr = fs.readFileSync('src/cms/themes/labmu-pro/puck/config.tsx', 'utf-8');

// I will just use regex to replace SiteHeader and SiteFooter completely
const headerRegex = /SiteHeader: \{[\s\S]*?\},[\s\n]*SiteFooter:/;

const headerReplacement = `SiteHeader: {
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
              <button className="md:hidden text-slate-600 hover:text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </nav>
      )
    },
    SiteFooter:`;

configStr = configStr.replace(headerRegex, headerReplacement);


const footerRegex = /SiteFooter: \{[\s\S]*?\},[\s\n]*Hero:/;

const footerReplacement = `SiteFooter: {
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
        description: "Membangun ekosistem UMKM dan ekonomi kreatif yang tangguh, inovatif, dan berdaya saing global melalui teknologi dan kolaborasi.",
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
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-colors"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
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
                  <li><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm">Syarat & Ketentuan</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm">Kebijakan Privasi</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-6">Hubungi Kami</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-400 text-sm">
                    <i className="fas fa-map-marker-alt mt-1 text-green-500"></i>
                    <span>Gedung Pusat Dakwah,<br/>Jl. Menteng Raya No.62,<br/>Jakarta Pusat 10340</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm">
                    <i className="fas fa-envelope text-green-500"></i>
                    <a href="mailto:halo@ekrafmu.id" className="hover:text-green-400 transition-colors">halo@ekrafmu.id</a>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400 text-sm">
                    <i className="fas fa-phone text-green-500"></i>
                    <span>021 - 390 3021</span>
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
    Hero:`;

configStr = configStr.replace(footerRegex, footerReplacement);

fs.writeFileSync('src/cms/themes/labmu-pro/puck/config.tsx', configStr);
