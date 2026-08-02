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

  // Default empty data
  const defaultData = {
    content: [],
    root: {},
    zones: {},
  };

  useEffect(() => {
    // Fetch data from database
    const fetchData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('cmsMu_token') || '' : '';
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
    fetchData();
  }, [slug]);

  const handlePublish = async (data: any) => {
    try {
      const payload = {
        slug: slug,
        body: JSON.stringify(data),
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('cmsMu_token') || '' : '';
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500">Memuat Editor...</div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <Puck
        config={puckConfig}
        data={initialData}
        onPublish={handlePublish}
      />
    </div>
  );
}
