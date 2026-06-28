// ============================================================================
// MÁY CHỦ — gọi Gemini đọc bản vẽ. Chạy phía server (Vercel function / vite dev
// middleware), KEY KHÔNG BAO GIỜ ra trình duyệt.
// Trả về JSON THÔ của Gemini; client (aiDocReader.ts) tự chuẩn hoá kiểu.
// ============================================================================

import { GoogleGenAI, Type } from '@google/genai';

export const GEMINI_MODEL = 'gemini-2.5-flash';

export interface InlinePart { data: string; mimeType: string }

const PROMPT = `Bạn là kỹ sư bóc tách khối lượng (QS) công trình nhà ở dân dụng Việt Nam, nắm vững TCVN 5574:2018 (BTCT), TCVN 1651:2018 (cốt thép), TCVN 9362/10304 (nền móng).
Bạn nhận được các BẢN VẼ KỸ THUẬT (mặt bằng các tầng, bản vẽ MÓNG, mặt cắt, kết cấu cột/dầm/sàn, thống kê thép...).
Hãy ĐỌC và BÓC TÁCH thành danh sách CẤU KIỆN có khối lượng, để hệ thống quy đổi ra vật tư theo định mức Nhà nước.

KIẾN THỨC CHUYÊN MÔN (dùng để chọn mặc định hợp lý khi bản vẽ không ghi rõ):
- Mác bê tông theo cấu kiện nhà dân dụng: LÓT móng/nền = M100 (đá 4x6); MÓNG/ĐÀ KIỀNG/CỘT/DẦM/SÀN/CẦU THANG/LANH TÔ nhà thấp tầng = M250 (đá 1x2, cấp bền B20); nhà nhiều tầng/chịu lực lớn có thể M300 (B22.5). Nếu bản vẽ ghi cấp bền B: B15→M200, B20→M250, B22.5→M300, B25→M350.
- Cốt thép: thép VẰN CB300/CB400 cho thép chịu lực (Ø≥10); thép TRƠN CB240 cho đai/cấu tạo (Ø6, Ø8). Đường kính ghi dạng Ø/D/Φ + số mm.
- Tường nhà phố: tường BAO/mặt tiền dày 20cm (tường 20); tường NGĂN dày 10cm (tường 10). Gạch ống 8x8x18 phổ biến.
- Móng: CỌC có cọc + đài; BĂNG là dải liên tục dưới tường; ĐƠN là đài rời dưới cột; BÈ là tấm phủ toàn bộ.

NGUYÊN TẮC BÓC TÁCH:
1. Kích thước trên bản vẽ thường bằng mm — QUY ĐỔI sang mét khi tính.
2. THỂ TÍCH bê tông (m³): Cột/đà = rộng×sâu×dài×số lượng. Sàn = diện tích×bề dày (sàn nhà phố thường dày 0.1m). Móng = dài×rộng×cao×số lượng.
3. DIỆN TÍCH tường (m²) theo từng bề dày, trừ diện tích cửa nếu đọc được.
4. loai "to" = CHỈ tô/TRÁT bằng VỮA XI MĂNG và láng/lót vữa. TUYỆT ĐỐI KHÔNG xếp lát gạch, ốp gạch, trần thạch cao/nhựa, chống thấm, sơn bả, hồ dầu vào "to" (chúng KHÔNG dùng vữa xi măng trong công cụ này) — nếu thấy thì chỉ ghi vào "canhBao". Diện tích tô tường trong 2 mặt, tường ngoài 1 mặt; kiểm tra cho hợp lý (đừng phóng đại).
5. THÉP — BẮT BUỘC có: mỗi cấu kiện BTCT chịu lực (móng/cột/dầm/đà/sàn) PHẢI có thép. Nếu có bảng thống kê thép → ghi theo đường kính (phi) + tổng chiều dài (m) hoặc khối lượng (kg), tách từng phi. Nếu KHÔNG đọc được thống kê thép → vẫn ƯỚC TÍNH: xuất dòng "thep" với khoiLuongKg = (thể tích bê tông cấu kiện) × hàm lượng thép [móng ~100, cột ~150, dầm/đà ~160, sàn ~90 kg/m³], và ghi 1 dòng canhBao "thép ước tính theo hàm lượng".
6. Mỗi cấu kiện = 1 dòng "cauKiens", "ten" tiếng Việt rõ (vd "Cột tầng trệt 20×20").
7. Số liệu suy đoán/không chắc/thiếu bản vẽ → THÊM dòng vào "canhBao".
8. Nếu KHÔNG phải bản vẽ công trình → isBanVe=false.

Trả về JSON đúng schema. Số không đọc được để 0, chuỗi để "".`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isBanVe: { type: Type.BOOLEAN },
    thongTin: {
      type: Type.OBJECT,
      properties: {
        ten: { type: Type.STRING }, rongM: { type: Type.NUMBER },
        daiM: { type: Type.NUMBER }, soTang: { type: Type.NUMBER },
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
};

/** Gọi Gemini với các phần inline (ảnh/PDF base64). Trả JSON thô đã parse. */
export async function bocTachServer(files: InlinePart[], apiKey: string | undefined): Promise<any> {
  if (!apiKey) throw new Error('Máy chủ chưa cấu hình GEMINI_API_KEY.');
  if (!Array.isArray(files) || files.length === 0) throw new Error('Không có tài liệu nào được gửi lên.');
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{
      parts: [
        ...files.map((p) => ({ inlineData: { data: p.data, mimeType: p.mimeType } })),
        { text: PROMPT },
      ],
    }],
    config: { responseMimeType: 'application/json', responseSchema: SCHEMA },
  });
  return JSON.parse(response.text || '{}');
}
