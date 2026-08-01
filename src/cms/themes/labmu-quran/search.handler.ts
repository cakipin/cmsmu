// src/addons/quran-mu/search.handler.ts
import type { Context } from 'hono';
import theme from '../../themes/labmu-quran/index';

export const handleTematik = async (c: Context) => {
    const q = c.req.query('q');
    if (!q || q.length < 3) return c.redirect('/');

    try {
        // Query ke D1
        const { results } = await c.env.DB.prepare(
            "SELECT * FROM ayat WHERE teksIndonesia LIKE ? LIMIT 50"
        ).bind(`%${q}%`).all();

        // Render hasil ke UI Theme
        return c.html(theme.renderSearch(results, q, {}));
    } catch (e: any) {
        return c.text("D1 Error: " + e.message, 500);
    }
};