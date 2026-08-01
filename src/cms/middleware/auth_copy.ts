import type { Context, Next } from 'hono'

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader) {
    return c.json({ error: 'Unauthorized: Butuh Login' }, 401)
  }

  // Ambil token (buang tulisan 'Bearer ')
  const token = authHeader.replace('Bearer ', '').trim();

  // 1. Cek Format LabMu
  if (token.startsWith('labmu_v1.')) {
     try {
        const base64 = token.split('.')[1]; 
        const data = JSON.parse(atob(base64));

        // Loloskan saja asal datanya ada (Bypass DB Check)
        c.set('user', data);
        await next();
        return;
     } catch (e) {
        return c.json({ error: 'Token Rusak' }, 401)
     }
  }

  // 2. Master Key
  if (token === (c.env.CLOUDFLARE_API_TOKEN || 'labmu_rahasia_master')) {
      await next();
      return;
  }

  return c.json({ error: 'Format Salah' }, 401)
}