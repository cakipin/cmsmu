import React, { useState, useEffect } from "react";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { puckConfig } from "../cms/themes/labmu-pro/puck/config";

interface ThemeEditorAppProps {
  slug: string;
}

export default function ThemeEditorApp({ slug }: ThemeEditorAppProps) {
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState<{id: number, title: string, slug: string}[]>([]);

  // Default empty data
  const defaultData = {
    content: [],
    root: {},
    zones: {},
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('labmu_token') || '' : '';
    
    // Fetch page list
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/theme-editor/pages', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          if (result.data) setPages(result.data);
        }
      } catch (e) {
        console.error("Gagal mengambil daftar halaman", e);
      }
    };

    // Fetch data from database
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/theme-editor/page?slug=${encodeURIComponent(slug)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          // Jika ada body JSON, parsing
          if (result.data && result.data.body) {
            try {
              const parsed = JSON.parse(result.data.body);
              setInitialData(parsed);
            } catch (e) {
              console.error("Gagal parse body JSON", e);
              setInitialData(defaultData);
            }
          } else {
            setInitialData(defaultData);
          }
        } else {
          setInitialData(defaultData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setInitialData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
    fetchData();
  }, [slug]);

  const handlePublish = async (data: any) => {
    try {
      const payload = {
        slug: slug,
        body: JSON.stringify(data),
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('labmu_token') || '' : '';
      const response = await fetch("/api/theme-editor/page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Halaman berhasil disimpan!");
      } else {
        const err = await response.json();
        alert("Gagal menyimpan halaman: " + (err.error || response.statusText));
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleCreateNewPage = () => {
    const newSlug = window.prompt("Masukkan slug untuk halaman baru (contoh: contact-us):");
    if (newSlug && newSlug.trim() !== "") {
      const formattedSlug = newSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (formattedSlug) {
        window.location.href = `?slug=${formattedSlug}`;
      }
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    if (selectedSlug) {
      window.location.href = `?slug=${selectedSlug}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500">Memuat Editor...</div>
      </div>
    );
  }

  // Cek apakah slug saat ini ada di daftar pages, jika tidak tambahkan sementara
  let displayPages = [...pages];
  
  if (!displayPages.find(p => p.slug === 'home')) {
    displayPages.unshift({ id: -1, title: 'Beranda Utama', slug: 'home' });
  }

  if (!displayPages.find(p => p.slug === slug)) {
    displayPages.push({ id: 0, title: slug + ' (Baru)', slug: slug });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Custom Top Bar */}
      <div style={{
        height: '50px',
        background: '#1f2937',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <a href="/admin" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>&larr; Kembali ke Admin</a>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Theme Editor</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="pageSelect" style={{ fontSize: '14px', color: '#d1d5db' }}>Edit Halaman:</label>
          <select 
            id="pageSelect"
            value={slug}
            onChange={handlePageChange}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              background: '#374151',
              color: 'white',
              border: '1px solid #4b5563',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {displayPages.map(p => (
              <option key={p.slug} value={p.slug}>{p.title} (/{p.slug})</option>
            ))}
          </select>
          
          <button 
            onClick={handleCreateNewPage}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            + Buat Baru
          </button>
        </div>
      </div>

      {/* Puck Editor Container */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Puck
          config={puckConfig}
          data={initialData}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}
