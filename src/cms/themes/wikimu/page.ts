import { renderLayout } from "./layout";
import { singleCss } from "./css-single"; // Kita pakai CSS single agar rapi

export const renderPage = (ctx: any) => {
    const page = ctx.data;
    if (!page) return renderLayout("404", "Halaman tidak ditemukan", false);

    const content = `
        <style>${singleCss}</style>
        <article class="article-wrapper">
            <header>
                <h1 class="article-title" style="border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">${page.title}</h1>
            </header>
            <div class="article-content">
                ${page.body}
            </div>
        </article>
    `;

    return renderLayout(page.title, content, true);
};