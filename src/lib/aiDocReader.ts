// ============================================================================
// LỚP 1 — AI ĐỌC BẢN VẼ → BẢNG KHỐI LƯỢNG CẤU KIỆN (BOQ)
// Dùng Gemini (vision) đọc PDF/ảnh bản vẽ kỹ thuật, trả về danh sách cấu kiện
// có khối lượng để LỚP 2 (takeoff.ts) quy đổi ra vật tư.
//
// LƯU Ý QUAN TRỌNG: AI đọc bản vẽ raster có thể sai số. Kết quả LUÔN cần kỹ
// thuật viên rà soát/sửa trong bảng trước khi tính vật tư. Mọi chỗ không chắc
// chắn được AI ghi vào `canhBao`.
// ============================================================================

import { GoogleGenAI, Type } from '@google/genai';
import type { CauKien } from './takeoff';

export const GEMINI_MODEL = 'gemini-2.5-flash';

export interface ThongTinCongTrinh {
  ten: string;
  rongM: number;
  daiM: number;
  soTang: number;
}

export interface KetQuaDocBanVe {
  thongTin: ThongTinCongTrinh;
  cauKiens: CauKien[];
  canhBao: string[];
  isBanVe: boolean;
}

const fileToInline = (file: File): Promise<{ data: string; mimeType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      let mimeType = file.type;
      if (!mimeType) {
        const n = file.name.toLowerCase();
        if (n.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (n.endsWith('.png')) mimeType = 'image/png';
        else if (n.endsWith('.webp')) mimeType = 'image/webp';
        else mimeType = 'image/jpeg';
      }
      resolve({ data: result.split(',')[1], mimeType });
    };
    reader.onerror = () => reject(new Error(`Không đọc được file: ${file.name}`));
    reader.readAsDataURL(file);
  });

const PROMPT = `Bạn là kỹ sư bóc tách khối lượng (QS) công trình nhà ở dân dụng Việt Nam.
Bạn nhận được các BẢN VẼ KỸ THUẬT (mặt bằng các tầng, bản vẽ MÓNG, mặt cắt, kết cấu cột/dầm/sàn, thống kê thép...).
Hãy ĐỌC và BÓC TÁCH thành danh sách CẤU KIỆN có khối lượng, để hệ thống quy đổi ra vật tư.

NGUYÊN TẮC:
1. Kích thước trên bản vẽ thường tính bằng mm — QUY ĐỔI sang mét khi tính.
2. Tính THỂ TÍCH bê tông (m³) cho: móng, đà kiềng, cột, dầm, sàn, cầu thang, lanh tô. Mác mặc định M250 (đá 1x2), bê tông lót M100 (đá 4x6).
   - Cột/đà: rộng×sâu×dài×số lượng. Sàn: diện tích×bề dày. Móng: dài×rộng×cao×số lượng.
3. Tính DIỆN TÍCH tường (m²) theo từng bề dày (tường 10 = 0.1m, tường 20 = 0.2m). Trừ diện tích cửa nếu đọc được.
4. Tính DIỆN TÍCH tô/trát (m²), ghi số mặt (thường tô 2 mặt tường trong, 1 mặt ngoài).
5. THÉP: nếu có bảng thống kê thép, ghi theo đường kính (phi) + tổng chiều dài (m) HOẶC khối lượng (kg). Nếu chỉ thấy "Fi16 4 cây/cột", hãy ước tính chiều dài = số cây × chiều cao cấu kiện.
6. Mỗi cấu kiện là 1 dòng trong "cauKiens". Đặt "ten" tiếng Việt rõ ràng (vd "Cột tầng trệt 20×20").
7. Với BẤT KỲ số liệu nào suy đoán/không chắc chắn, THÊM một dòng mô tả vào "canhBao" (vd "Chưa thấy bản vẽ móng — bỏ qua thép móng").
8. Nếu tài liệu KHÔNG phải bản vẽ công trình, đặt isBanVe=false.

Trả về JSON đúng schema. Số không đọc được để 0, chuỗi để "".`;

export async function docBanVe(files: File[]): Promise<KetQuaDocBanVe> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình GEMINI_API_KEY. Vào .env (hoặc Secrets) đặt khóa rồi chạy lại.');

  const parts = await Promise.all(files.map(fileToInline));
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{
      parts: [
        ...parts.map((p) => ({ inlineData: { data: p.data, mimeType: p.mimeType } })),
        { text: PROMPT },
      ],
    }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isBanVe: { type: Type.BOOLEAN },
          thongTin: {
            type: Type.OBJECT,
            properties: {
              ten: { type: Type.STRING },
              rongM: { type: Type.NUMBER },
              daiM: { type: Type.NUMBER },
              soTang: { type: Type.NUMBER },
            },
            required: ['ten', 'rongM', 'daiM', 'soTang'],
          },
          cauKiens: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                loai: { type: Type.STRING, description: 'betong | thep | xay | to' },
                ten: { type: Type.STRING },
                mac: { type: Type.STRING, description: 'M100|M150|M200|M250|M300 (cho bê tông)' },
                theTich: { type: Type.NUMBER, description: 'm³ (bê tông)' },
                phi: { type: Type.NUMBER, description: 'mm (thép)' },
                chieuDaiM: { type: Type.NUMBER, description: 'tổng mét (thép)' },
                khoiLuongKg: { type: Type.NUMBER, description: 'kg (thép, nếu biết)' },
                dienTich: { type: Type.NUMBER, description: 'm² (xây/tô)' },
                chieuDay: { type: Type.NUMBER, description: 'm (xây)' },
                chieuDayCm: { type: Type.NUMBER, description: 'cm (tô)' },
                soMat: { type: Type.NUMBER, description: '1 hoặc 2 (tô)' },
              },
              required: ['loai', 'ten'],
            },
          },
          canhBao: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['isBanVe', 'thongTin', 'cauKiens', 'canhBao'],
      },
    },
  });

  const raw = JSON.parse(response.text || '{}');
  return {
    isBanVe: raw.isBanVe !== false,
    thongTin: raw.thongTin ?? { ten: '', rongM: 0, daiM: 0, soTang: 0 },
    cauKiens: chuanHoaCauKiens(raw.cauKiens ?? []),
    canhBao: Array.isArray(raw.canhBao) ? raw.canhBao : [],
  };
}

/** Lọc & ép kiểu dữ liệu thô từ AI về CauKien hợp lệ. */
function chuanHoaCauKiens(rows: any[]): CauKien[] {
  const macHopLe = ['M100', 'M150', 'M200', 'M250', 'M300'];
  const out: CauKien[] = [];
  for (const r of rows) {
    const ten = String(r.ten || '').trim() || 'Cấu kiện';
    switch (r.loai) {
      case 'betong': {
        const mac = macHopLe.includes(r.mac) ? r.mac : 'M250';
        if (r.theTich > 0) out.push({ loai: 'betong', ten, mac, theTich: r.theTich });
        break;
      }
      case 'thep': {
        if (r.phi > 0 && (r.chieuDaiM > 0 || r.khoiLuongKg > 0))
          out.push({ loai: 'thep', ten, phi: Math.round(r.phi), chieuDaiM: r.chieuDaiM || undefined, khoiLuongKg: r.khoiLuongKg || undefined });
        break;
      }
      case 'xay': {
        if (r.dienTich > 0 && r.chieuDay > 0)
          out.push({ loai: 'xay', ten, dienTich: r.dienTich, chieuDay: r.chieuDay });
        break;
      }
      case 'to': {
        if (r.dienTich > 0)
          out.push({ loai: 'to', ten, dienTich: r.dienTich, soMat: r.soMat === 2 ? 2 : 1, chieuDayCm: r.chieuDayCm || 1.5 });
        break;
      }
    }
  }
  return out;
}
