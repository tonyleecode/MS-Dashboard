// ============================================================================
// LỚP 1 (CLIENT) — Gửi bản vẽ lên MÁY CHỦ /api/doc-ban-ve để AI bóc tách.
// KEY GEMINI NẰM Ở MÁY CHỦ, không nhúng vào trình duyệt. Client chỉ đọc file
// thành base64, gọi API, rồi chuẩn hoá kết quả về kiểu CauKien.
//
// LƯU Ý: AI đọc bản vẽ raster có thể sai số — kết quả LUÔN cần kỹ thuật viên
// rà soát/sửa trong bảng trước khi tính vật tư. Chỗ không chắc ghi vào canhBao.
// ============================================================================

import type { CauKien } from './takeoff';

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

export async function docBanVe(files: File[]): Promise<KetQuaDocBanVe> {
  const parts = await Promise.all(files.map(fileToInline));

  const res = await fetch('/api/doc-ban-ve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: parts }),
  });

  if (!res.ok) {
    let msg = `Lỗi máy chủ (${res.status})`;
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
    if (res.status === 413) msg = 'Bản vẽ quá lớn để gửi lên máy chủ. Hãy tách bớt trang hoặc giảm dung lượng.';
    throw new Error(msg);
  }

  const raw = await res.json();
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
