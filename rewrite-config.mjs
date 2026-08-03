import fs from 'fs';

let configStr = fs.readFileSync('src/cms/themes/labmu-pro/puck/config.tsx', 'utf-8');

// The original file is clean now, let's inject SiteHeader and SiteFooter properly.
const headerProps = `
  SiteHeader: {
    siteTitle: string;
    logoUrl: string;
    menuItems: { label: string; url: string }[];
  };
`;

const footerProps = `
  SiteFooter: {
    siteTitle: string;
    description: string;
    links: { label: string; url: string }[];
  };
`;

configStr = configStr.replace('export type Props = {', `export type Props = {\n${headerProps}${footerProps}`);

const headerComponent = `
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
        }
      },
      defaultProps: {
        siteTitle: "CMSMu",
        logoUrl: "",
        menuItems: [
          { label: "Home", url: "/" }
        ]
      },
      render: ({ siteTitle, logoUrl, menuItems }) => (
        <header className="pro-header" style={{ position: 'relative' }}>
          <div className="container header-inner">
            <a href="/" className="logo">
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} style={{ maxHeight: '40px' }} />
              ) : (
                <><i className="fas fa-layer-group"></i> <span>{siteTitle}</span></>
              )}
            </a>
            <nav className="nav-menu">
              {menuItems.map((m, i) => (
                <a key={i} href={m.url} className="nav-link">{m.label}</a>
              ))}
              <button className="theme-toggle" aria-label="Toggle Dark Mode" style={{ background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer', marginLeft:'1rem' }}>
                 <i className="fas fa-moon icon-moon"></i>
                 <i className="fas fa-sun icon-sun" style={{ display:'none' }}></i>
              </button>
            </nav>
            <button className="burger-btn" aria-label="Toggle Menu">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </header>
      )
    },
`;

const footerComponent = `
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
        siteTitle: "CMSMu",
        description: "Website modern berbasis Cloudflare.",
        links: [
          { label: "Tentang Kami", url: "#" },
          { label: "Karir", url: "#" },
          { label: "Hubungi Kami", url: "#" }
        ]
      },
      render: ({ siteTitle, description, links }) => (
        <footer className="pro-footer">
          <div className="container">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 footer-grid">
              <div className="footer-col" style={{ gridColumn: 'span 1' }}>
                 <a href="/" className="logo" style={{ color:'white', marginBottom:'1rem', display:'inline-flex' }}>
                   <i className="fas fa-layer-group"></i> {siteTitle}
                 </a>
                 <p style={{ opacity:0.8, fontSize:'var(--text-sm)', marginBottom:'1rem' }}>{description}</p>
                 <div className="social-share" style={{ border:'none', padding:0, margin:0 }}>
                   <a href="#" className="share-btn share-fb" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                   <a href="#" className="share-btn share-tw" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                   <a href="#" className="share-btn share-wa" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                 </div>
              </div>
              <div className="footer-col">
                 <h4>Perusahaan</h4>
                 <ul className="footer-links">
                   {links.map((link, i) => (
                     <li key={i}><a href={link.url}>{link.label}</a></li>
                   ))}
                 </ul>
              </div>
              <div className="footer-col">
                 <h4>Bantuan</h4>
                 <ul className="widget-list footer-links" style={{ border:'none' }}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms-of-service">Terms of Service</a></li>
                    <li><a href="#">FAQ</a></li>
                 </ul>
              </div>
              <div className="footer-col">
                 <h4>Newsletter</h4>
                 <p style={{ marginBottom:'15px', fontSize:'var(--text-sm)' }}>Dapatkan update terbaru seputar pengembangan web.</p>
                 <form className="form-group" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" className="form-control" placeholder="Email Anda..." style={{ marginBottom:'10px' }} required />
                    <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Subscribe</button>
                 </form>
              </div>
            </div>
            <div className="footer-bottom">
               &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved. Built with LabMu CMS Framework.
            </div>
          </div>
        </footer>
      )
    },
`;

configStr = configStr.replace('components: {', `components: {\n${headerComponent}${footerComponent}`);
fs.writeFileSync('src/cms/themes/labmu-pro/puck/config.tsx', configStr);
