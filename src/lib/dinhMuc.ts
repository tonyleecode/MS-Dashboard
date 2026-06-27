// ============================================================================
// ĐỊNH MỨC VẬT TƯ XÂY DỰNG — theo tiêu chuẩn Nhà nước
// Nguồn: Cấp phối vữa bê tông/vữa xây (Định mức 1784/QĐ-BXD), trọng lượng thép
// lý thuyết TCVN, định mức công tác xây/tô (Định mức 1776/QĐ-BXD).
//
// Đây là LỚP 2 của hệ thống bóc tách: nhận khối lượng cấu kiện (m³ bê tông,
// m² tường, kg/m thép...) và quy đổi ra vật tư mua (xi măng, cát, đá, gạch,
// thép) một cách XÁC ĐỊNH — không phải ước lượng. Các con số có thể tinh chỉnh
// trong trang Quản lý định mức (PriceManagement) cho phù hợp vùng/giá thực tế.
// ============================================================================

export type MacBeTong = 'M100' | 'M150' | 'M200' | 'M250' | 'M300';
export type MacVua = 'M50' | 'M75' | 'M100';

/** Cấp phối cho 1 m³ bê tông — xi măng PCB40, đá 1x2 (M100 lót dùng đá 4x6). */
export interface CapPhoiBeTong {
  ximang: number; // kg
  cat: number;    // m³ (cát vàng)
  da: number;     // m³
  loaiDa: string; // '1x2' | '4x6'
}

export const CAP_PHOI_BE_TONG: Record<MacBeTong, CapPhoiBeTong> = {
  M100: { ximang: 218, cat: 0.516, da: 0.905, loaiDa: '4x6' }, // bê tông lót móng/nền
  M150: { ximang: 288, cat: 0.505, da: 0.913, loaiDa: '1x2' },
  M200: { ximang: 351, cat: 0.481, da: 0.900, loaiDa: '1x2' },
  M250: { ximang: 415, cat: 0.455, da: 0.887, loaiDa: '1x2' }, // mác phổ biến nhà phố
  M300: { ximang: 450, cat: 0.450, da: 0.876, loaiDa: '1x2' },
};

/** Cấp phối cho 1 m³ vữa xi măng – cát (PCB40). */
export interface CapPhoiVua {
  ximang: number; // kg
  cat: number;    // m³
}

export const CAP_PHOI_VUA: Record<MacVua, CapPhoiVua> = {
  M50:  { ximang: 213, cat: 1.15 },
  M75:  { ximang: 247, cat: 1.12 }, // vữa xây/tô tiêu chuẩn nhà ở
  M100: { ximang: 320, cat: 1.09 },
};

/** Trọng lượng lý thuyết thép tròn trơn/vằn (kg/m) ≈ 0.00617 × d². */
export const TRONG_LUONG_THEP_KG_M: Record<number, number> = {
  6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 14: 1.208,
  16: 1.578, 18: 1.998, 20: 2.466, 22: 2.984, 25: 3.853, 28: 4.834, 32: 6.313,
};

/** Định mức công tác xây theo loại gạch (cho 1 m³ khối xây). */
export interface DinhMucXay {
  ten: string;
  vienPerM3: number; // số viên / m³ khối xây
  vuaPerM3: number;  // m³ vữa / m³ khối xây
  macVua: MacVua;
}

export const DINH_MUC_XAY: Record<string, DinhMucXay> = {
  // Gạch ống 8x8x18 (80×80×180mm) — phổ biến tường nhà phố
  gach_ong_8x8x18: { ten: 'Gạch ống 8×8×18', vienPerM3: 550, vuaPerM3: 0.29, macVua: 'M75' },
  // Gạch thẻ đặc 4x8x18 — tường chịu lực, hầm tự hoại
  gach_the_4x8x18: { ten: 'Gạch thẻ 4×8×18', vienPerM3: 860, vuaPerM3: 0.30, macVua: 'M75' },
  // Gạch tuynel 6 lỗ
  gach_tuynel_6lo: { ten: 'Gạch tuynel 6 lỗ', vienPerM3: 460, vuaPerM3: 0.27, macVua: 'M75' },
};

/** Định mức công tác tô/trát: m³ vữa cho 1 m² tô, theo bề dày (mặc định 1,5cm). */
export const DINH_MUC_TO = {
  macVua: 'M75' as MacVua,
  vuaPerM2PerCm: 0.0107, // m³ vữa / (m² × 1cm bề dày), đã gồm hao hụt nhẹ
};

/** Hệ số hao hụt vật tư (nhân thêm khi tổng hợp). */
export const HAO_HUT = {
  ximang: 1.01,
  cat: 1.02,
  da: 1.01,
  gach: 1.02,
  thep: 1.05, // gồm nối chồng & cắt
};

export const KG_PER_BAO_XIMANG = 50; // bao xi măng 50kg
