import React, { useEffect } from 'react';

export const Root = ({ children }) => {
  useEffect(() => {
    // This will run inside the iframe when mounted!
    const doc = document;
    if (!doc.getElementById('tailwind-cdn')) {
      const script = doc.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      doc.head.appendChild(script);
    }
  }, []);
  return <div className="font-main text-slate-800 bg-white">{children}</div>;
};
