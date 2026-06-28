import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';

// Plugin dev: chạy /api/doc-ban-ve ngay trong `vite dev` (production dùng
// Vercel Serverless Function cùng tên). KEY chỉ ở phía server, không define
// vào client bundle.
function apiDevPlugin(apiKey: string): Plugin {
  return {
    name: 'ms-api-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/doc-ban-ve', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', async () => {
          try {
            const mod: any = await server.ssrLoadModule('/api/_docBanVe.ts');
            const { files } = JSON.parse(body || '{}');
            const result = await mod.bocTachServer(files, apiKey);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e?.message || String(e) }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  return {
    // KHÔNG còn `define` key vào client — Gemini gọi qua /api (server giữ key).
    plugins: [react(), tailwindcss(), apiDevPlugin(geminiKey)],
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
