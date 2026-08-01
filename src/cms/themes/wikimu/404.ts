import { renderLayout } from "./layout";

export const render404 = (ctx: any) => {
    const content = `
        <div style="text-align: center; padding: 80px 20px;">
            <div style="font-size: 6rem; font-weight: bold; color: #eee; line-height: 1;">404</div>
            <h2 style="font-family: 'Linux Libertine', serif; font-size: 2rem; color: #333; margin: 20px 0;">Halaman Tidak Ditemukan</h2>
            <p style="color: #666; max-width: 500px; margin: 0 auto 30px auto;">
                Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak pernah ada.
            </p>
            <a href="/" style="display: inline-block; background: #006C45; color: white; padding: 10px 25px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                Kembali ke Depan
            </a>
        </div>
    `;

    return renderLayout("Tidak Ditemukan", content, false);
};