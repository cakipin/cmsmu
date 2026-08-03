const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/cms/themes/labmu-pro/puck/config.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update SiteHeader props
content = content.replace(
  'SiteHeader: {',
  'SiteHeader: {\n    logoImage: string;'
);

// Update SiteHeader fields
content = content.replace(
  'logoLetter: { type: "text" },',
  'logoLetter: { type: "text" },\n        logoImage: { type: "custom", render: ImageField },'
);

// Update SiteHeader defaultProps
content = content.replace(
  'logoLetter: "M",',
  'logoLetter: "M",\n        logoImage: "",'
);

// Update SiteHeader render
content = content.replace(
  'render: ({ siteTitle, siteTitleHighlight, logoLetter, menuItems, ctaText, ctaUrl }) => (',
  'render: ({ siteTitle, siteTitleHighlight, logoLetter, logoImage, menuItems, ctaText, ctaUrl }) => ('
);

content = content.replace(
  '<div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-lg">{logoLetter}</div>',
  '{logoImage ? <img src={logoImage} alt="Logo" className="h-8 w-auto" /> : <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-lg">{logoLetter}</div>}'
);

// Add HeroSlider props
content = content.replace(
  'Hero: {',
  `HeroSlider: {
    slides: { image: string; title: string; subtitle: string; buttonText: string; buttonLink: string }[];
  };
  Hero: {`
);

// Add HeroSlider components block before Hero
const heroSliderComponent = `
    HeroSlider: {
      fields: {
        slides: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            subtitle: { type: "textarea" },
            image: { type: "custom", render: ImageField },
            buttonText: { type: "text" },
            buttonLink: { type: "text" }
          }
        }
      },
      defaultProps: {
        slides: [
          {
            title: "Solusi Ekonomi Digital",
            subtitle: "Memberdayakan UMKM melalui teknologi yang amanah dan transparan.",
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000",
            buttonText: "Pelajari Lebih Lanjut",
            buttonLink: "#"
          }
        ]
      },
      render: ({ slides }) => (
        <section className="relative w-full h-[600px] overflow-hidden flex snap-x snap-mandatory overflow-x-auto">
          {slides.map((slide, idx) => (
            <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
              <div className="absolute inset-0 z-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              <div className="relative z-10 text-center px-4 max-w-4xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h2>
                <p className="text-xl text-slate-200 mb-8">{slide.subtitle}</p>
                {slide.buttonText && (
                  <a href={slide.buttonLink} className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg">
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )
    },
    Hero: {
`;

content = content.replace(
  '    Hero: {',
  heroSliderComponent.replace('    Hero: {\n', '    Hero: {')
);

fs.writeFileSync(file, content);
