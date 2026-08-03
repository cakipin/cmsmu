import React from "react";
import type { Config } from "@puckeditor/core";

// Komponen-komponen Dasar yang akan dipakai oleh Puck

export type Props = {
  Hero: {
    title: string;
    description: string;
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
  };
  HeroSlider: {
    slides: { image: string; title: string; subtitle: string; buttonText: string; buttonLink: string }[];
  };
  FeatureGrid: {
    title: string;
    features: { title: string; description: string; icon: string }[];
  };
  Testimonial: {
    title: string;
    testimonials: { name: string; role: string; content: string; avatar: string }[];
  };
  ContactForm: {
    heading: string;
    emailTo: string;
  };
  RichText: {
    content: string;
  };
  CustomHTML: {
    html: string;
  };
  GoogleMap: {
    iframeUrl: string;
    height: number;
  };
  Spacer: {
    height: number;
  };
};

export const puckConfig: Config<Props> = {
  components: {
    Hero: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        backgroundImage: { type: "text" },
        buttonText: { type: "text" },
        buttonLink: { type: "text" },
      },
      defaultProps: {
        title: "Selamat Datang di Halaman Baru",
        description: "Tambahkan deskripsi halaman Anda di sini.",
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
          { title: "Inovasi", description: "Deskripsi inovasi", icon: "🚀" },
          { title: "Kolaborasi", description: "Deskripsi kolaborasi", icon: "🤝" },
        ],
      },
      render: ({ title, features }) => (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">{title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },
    ContactForm: {
      fields: {
        heading: { type: "text" },
        emailTo: { type: "text" },
      },
      defaultProps: {
        heading: "Hubungi Kami",
        emailTo: "kontak@ekrafmu.id",
      },
      render: ({ heading, emailTo }) => (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">{heading}</h2>
            <form className="space-y-6" action={`mailto:${emailTo}`} method="GET">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nama Depan</label>
                  <div className="mt-1">
                    <input type="text" className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-slate-300 rounded-md border" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Nama Belakang</label>
                  <div className="mt-1">
                    <input type="text" className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-slate-300 rounded-md border" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <div className="mt-1">
                  <input type="email" className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-slate-300 rounded-md border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Pesan</label>
                <div className="mt-1">
                  <textarea rows={4} className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border border-slate-300 rounded-md"></textarea>
                </div>
              </div>
              <div>
                <button type="submit" className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </section>
      ),
    },
    RichText: {
      fields: {
        content: { type: "textarea" },
      },
      defaultProps: {
        content: "<h2>Judul Halaman</h2><p>Tulis teks lengkap Anda di sini. Mendukung tag HTML sederhana.</p>",
      },
      render: ({ content }) => (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-green lg:prose-lg" dangerouslySetInnerHTML={{ __html: content }} />
        </section>
      ),
    },
    HeroSlider: {
      fields: {
        slides: {
          type: "array",
          arrayFields: {
            image: { type: "text" },
            title: { type: "text" },
            subtitle: { type: "textarea" },
            buttonText: { type: "text" },
            buttonLink: { type: "text" },
          },
        },
      },
      defaultProps: {
        slides: [
          {
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070",
            title: "Selamat Datang",
            subtitle: "Kami siap membantu Anda",
            buttonText: "Pelajari Lebih Lanjut",
            buttonLink: "#",
          }
        ],
      },
      render: ({ slides }) => (
        <section className="relative w-full overflow-hidden bg-slate-900 group" style={{ minHeight: '60vh', maxHeight: '80vh' }}>
          {slides.map((slide, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === 0 ? 'opacity-100 relative z-10' : 'opacity-0 z-0 hidden'}`}>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-4xl">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-2xl text-slate-200 mb-8">{slide.subtitle}</p>
                  {slide.buttonText && (
                    <a href={slide.buttonLink} className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                      {slide.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Note: In a real slider, you would include a client-side script to cycle through slides. For Puck SSR, we show the first slide. */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {slides.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
            ))}
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                  <div className="text-green-500 text-4xl absolute top-4 right-6 opacity-20">"</div>
                  <p className="text-slate-600 italic mb-6 relative z-10">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900">{t.name}</h4>
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
    GoogleMap: {
      fields: {
        iframeUrl: { type: "text" },
        height: { type: "number" }
      },
      defaultProps: {
        iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24058206412!2d106.7583637119043!3d-6.229746499878206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta!5e0!3m2!1sen!2sid!4v1700000000000",
        height: 400
      },
      render: ({ iframeUrl, height }) => (
        <section className="w-full">
          {iframeUrl.startsWith('<iframe') ? (
            // Jika user memasukkan seluruh tag <iframe>
            <div style={{ height: `${height}px`, width: '100%' }} dangerouslySetInnerHTML={{ __html: iframeUrl }} />
          ) : (
            // Jika user hanya memasukkan URL src
            <iframe 
              src={iframeUrl} 
              width="100%" 
              height={height} 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          )}
        </section>
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
