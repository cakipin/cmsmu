// src/core/search.ts
export async function handleTematikSearch(request: Request, env: any, theme: any, context: any) {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    if (!q || q.length < 3) return null;

    // Eksekusi ke D1
    const { results } = await env.DB.prepare(
        "SELECT * FROM ayat WHERE teksIndonesia LIKE ? LIMIT 50"
    ).bind(`%${q}%`).all();

    // Kembalikan Response HTML menggunakan theme
    const html = theme.renderSearch(results, q, context);
    return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
}