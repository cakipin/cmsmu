// Helper untuk URL
export const slugify = (str: string) => {
    return (str || '').toString().toLowerCase()
        .replace(/\s+/g, '-')            
        .replace(/[^\w\-]+/g, '')        
        .replace(/\-\-+/g, '-')          
        .replace(/^-+/, '')              
        .replace(/-+$/, '');            
};

// Helper untuk Tajwid Warna
export const applyTajwid = (text: string) => {
    if (!text) return '';
    return text
      .replace(/([\u064B\u064C\u064D])/g, '<span class="t-color t-ghunnah">$1</span>')
      .replace(/([\u0652])/g, '<span class="t-color t-qalqalah">$1</span>')
      .replace(/([\u0651])/g, '<span class="t-color t-ikhfa">$1</span>')
      .replace(/([\u064E\u064F\u0650])/g, '<span class="t-color t-idgham">$1</span>');
};

// Helper untuk Escaping String (HTML Safe)
export const esc = (str: string) => (str || '').replace(/'/g, "&#39;").replace(/"/g, '&quot;');