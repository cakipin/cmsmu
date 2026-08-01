// Helper untuk membersihkan JSON String dari Database D1
const safeParse = (data: any) => {
    if (!data) return {};
    try {
        if (typeof data === 'object') return data;
        if (typeof data === 'string') {
            const clean = data.trim();
            // Validasi sederhana apakah ini JSON object
            if (clean.startsWith('{') || clean.startsWith('[')) {
                return JSON.parse(clean);
            }
        }
    } catch (e) {
        // Silent error, return empty object
    }
    return {};
};

// Helper untuk mendapatkan URL terbaik (Prioritas: Misyari '05')
const getBestUrl = (audioObj: any) => {
    if (!audioObj) return '';
    if (audioObj['05']) return audioObj['05']; // Misyari
    if (audioObj['01']) return audioObj['01']; // Juhany
    // Fallback: Ambil link pertama yang ditemukan
    const keys = Object.keys(audioObj);
    return keys.length > 0 ? audioObj[keys[0]] : '';
};

/**
 * GENERATOR TOMBOL PLAY
 * Fungsi ini membuat string HTML <button> lengkap dengan atribut datanya.
 */
export const renderPlayButton = (
    rawData: any,       // Data mentah dari DB (String/Object)
    label: string,      // Label untuk logs/player (misal: "Al-Fatihah:1")
    isFull: boolean = false // Apakah ini tombol Full Surat?
) => {
    const audioObj = safeParse(rawData);
    const bestUrl = getBestUrl(audioObj);

    // Jika tidak ada URL valid, jangan render tombol (atau render disabled)
    if (!bestUrl) {
        if (isFull) return ``;
        return `<button class="btn-action disabled" style="opacity:0.3; cursor:not-allowed;" title="Audio tidak tersedia"><i class="fas fa-volume-mute"></i></button>`;
    }

    // Generate atribut data-url-XX untuk semua Qari yang tersedia
    let dataAttrs = '';
    for (const [key, url] of Object.entries(audioObj)) {
        if (url) dataAttrs += ` data-url-${key}="${url}"`;
    }

    // Escape Label agar aman dari tanda kutip
    const safeLabel = label.replace(/"/g, '&quot;');

    // Render HTML Button
    if (isFull) {
        return `
        <button onclick="window.playAyat(this)" 
                data-title="${safeLabel}" 
                ${dataAttrs} 
                data-audio-default="${bestUrl}"
                style="margin-top:15px; padding:10px 20px; border:1px solid var(--primary); border-radius:30px; cursor:pointer; background:var(--bg-card); color:var(--primary); font-weight:bold;">
            <i class="fas fa-play"></i> Putar Full Surat
        </button>`;
    } else {
        return `
        <button class="btn-action" 
                onclick="window.playAyat(this)" 
                data-title="${safeLabel}" 
                ${dataAttrs} 
                data-audio-default="${bestUrl}"
                title="Putar Audio">
            <i class="fas fa-play"></i>
        </button>`;
    }
};