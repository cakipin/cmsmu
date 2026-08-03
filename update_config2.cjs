const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/cms/themes/labmu-pro/puck/config.tsx');
let content = fs.readFileSync(file, 'utf8');

// ==== 1. Update SiteHeader props ====
const siteHeaderPropsOld = `  SiteHeader: {
    logoImage: string;
    siteTitle: string;
    siteTitleHighlight: string;
    logoLetter: string;
    menuItems: { label: string; url: string }[];
    ctaText: string;
    ctaUrl: string;
  };`;

const siteHeaderPropsNew = `  SiteHeader: {
    logoImage: string;
    siteTitle: string;
    siteTitleHighlight: string;
    logoLetter: string;
    menuItems: { label: string; url: string }[];
    ctaText: string;
    ctaUrl: string;
    headerBgColor1: string;
    headerBgColor2: string;
    textColor: string;
    fontFamily: string;
    menuPosition: string;
    headerPadding: string;
  };`;

content = content.replace(siteHeaderPropsOld, siteHeaderPropsNew);

// ==== 2. Update SiteHeader Config ====
const siteHeaderFieldsOld = `        logoImage: { type: "custom", render: ImageField },
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
        siteTitle: "Ekraf",
        siteTitleHighlight: "Mu",
        logoLetter: "M",
        logoImage: "",
        menuItems: [
          { label: "Keunggulan", url: "#manfaat" },
          { label: "Kisah Sukses", url: "#testimoni" },
          { label: "Berita & Artikel", url: "#berita" },
          { label: "Daftar Inkubasi", url: "#gabung" }
        ],
        ctaText: "Mulai Bergabung",
        ctaUrl: "#gabung"
      },
      render: ({ siteTitle, siteTitleHighlight, logoLetter, logoImage, menuItems, ctaText, ctaUrl }) => (
        <nav id="navbar" className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">`;

const siteHeaderFieldsNew = `        logoImage: { type: "custom", render: ImageField },
        menuItems: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            url: { type: "text" }
          }
        },
        ctaText: { type: "text" },
        ctaUrl: { type: "text" },
        headerBgColor1: { type: "text" },
        headerBgColor2: { type: "text" },
        textColor: { type: "text" },
        fontFamily: { type: "select", options: [{label: "Sans (Default)", value: "sans-serif"}, {label: "Serif", value: "serif"}, {label: "Mono", value: "monospace"}] },
        menuPosition: { type: "radio", options: [{label: "Kiri", value: "start"}, {label: "Tengah", value: "center"}, {label: "Kanan", value: "end"}] },
        headerPadding: { type: "select", options: [{label: "Normal", value: "h-20"}, {label: "Kecil", value: "h-16"}, {label: "Besar", value: "h-24"}] }
      },
      defaultProps: {
        siteTitle: "Ekraf",
        siteTitleHighlight: "Mu",
        logoLetter: "M",
        logoImage: "",
        menuItems: [
          { label: "Keunggulan", url: "#manfaat" },
          { label: "Kisah Sukses", url: "#testimoni" },
          { label: "Berita & Artikel", url: "#berita" },
          { label: "Daftar Inkubasi", url: "#gabung" }
        ],
        ctaText: "Mulai Bergabung",
        ctaUrl: "#gabung",
        headerBgColor1: "#ffffff",
        headerBgColor2: "#ffffff",
        textColor: "#1e293b",
        fontFamily: "sans-serif",
        menuPosition: "center",
        headerPadding: "h-20"
      },
      render: ({ siteTitle, siteTitleHighlight, logoLetter, logoImage, menuItems, ctaText, ctaUrl, headerBgColor1, headerBgColor2, textColor, fontFamily, menuPosition, headerPadding }) => (
        <nav id="navbar" className={\`fixed w-full z-50 transition-all duration-300 backdrop-blur-md border-b border-gray-100\`} style={{ background: \`linear-gradient(90deg, \${headerBgColor1}, \${headerBgColor2})\`, color: textColor, fontFamily: fontFamily }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={\`flex justify-between items-center \${headerPadding}\`}>`;

content = content.replace(siteHeaderFieldsOld, siteHeaderFieldsNew);

content = content.replace(
  '<span className="font-bold text-xl text-slate-900">{siteTitle}<span className="text-green-600">{siteTitleHighlight}</span></span>',
  '<span className="font-bold text-xl" style={{ color: textColor }}>{siteTitle}<span className="text-green-600 ml-1">{siteTitleHighlight}</span></span>'
);

content = content.replace(
  '<div className="hidden md:flex space-x-6 lg:space-x-8">',
  '<div className={`hidden md:flex space-x-6 lg:space-x-8 flex-1 mx-8 justify-${menuPosition}`}>'
);

content = content.replace(
  'className="text-slate-600 hover:text-green-600 font-medium transition"',
  'className="hover:text-green-600 font-medium transition" style={{ color: textColor }}'
);

// ==== 3. Update HeroSlider props ====
const heroSliderPropsOld = `  HeroSlider: {
    slides: { image: string; title: string; subtitle: string; buttonText: string; buttonLink: string }[];
  };`;

const heroSliderPropsNew = `  HeroSlider: {
    slides: { image: string; title: string; subtitle: string; buttonText: string; buttonLink: string }[];
    sliderHeight: string;
    textPosition: string;
    overlayOpacity: number;
    titleColor: string;
    titleSize: string;
  };`;
content = content.replace(heroSliderPropsOld, heroSliderPropsNew);

// ==== 4. Update HeroSlider config ====
const heroSliderConfigOld = `    HeroSlider: {
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
                <p className="text-xl text-slate-200 mb-8">{slide.subtitle}</p>`;

const heroSliderConfigNew = `    HeroSlider: {
      fields: {
        sliderHeight: { type: "select", options: [{label: "Medium (600px)", value: "h-[600px]"}, {label: "Large (800px)", value: "h-[800px]"}, {label: "Full Screen", value: "h-screen"}] },
        textPosition: { type: "radio", options: [{label: "Kiri", value: "items-start text-left"}, {label: "Tengah", value: "items-center text-center"}, {label: "Kanan", value: "items-end text-right"}] },
        overlayOpacity: { type: "number" },
        titleColor: { type: "text" },
        titleSize: { type: "select", options: [{label: "Normal", value: "text-4xl md:text-6xl"}, {label: "Besar", value: "text-5xl md:text-7xl"}] },
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
        sliderHeight: "h-[600px]",
        textPosition: "items-center text-center",
        overlayOpacity: 50,
        titleColor: "#ffffff",
        titleSize: "text-4xl md:text-6xl",
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
      render: ({ slides, sliderHeight, textPosition, overlayOpacity, titleColor, titleSize }) => (
        <section className={\`relative w-full \${sliderHeight} overflow-hidden flex snap-x snap-mandatory overflow-x-auto\`}>
          {slides.map((slide, idx) => (
            <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
              <div className="absolute inset-0 z-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ backgroundColor: \`rgba(0,0,0,\${overlayOpacity / 100})\` }}></div>
              </div>
              <div className={\`relative z-10 px-8 max-w-7xl w-full flex flex-col \${textPosition}\`}>
                <h2 className={\`\${titleSize} font-bold mb-4\`} style={{ color: titleColor }}>{slide.title}</h2>
                <p className="text-xl text-slate-200 mb-8 max-w-2xl">{slide.subtitle}</p>`;
content = content.replace(heroSliderConfigOld, heroSliderConfigNew);

fs.writeFileSync(file, content);
