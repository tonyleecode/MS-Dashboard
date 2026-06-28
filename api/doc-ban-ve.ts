// Vercel Serverless Function: POST /api/doc-ban-ve
// Nhận { files: [{data, mimeType}] }, gọi Gemini phía MÁY CHỦ (key trong env
// server, không ra trình duyệt), trả về JSON thô.
// Lưu ý: body của Serverless Function ~4.5MB — bản vẽ rất lớn nên nén/tách trang.

import { bocTachServer } from './_docBanVe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const result = await bocTachServer(body.files, process.env.GEMINI_API_KEY);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
}
