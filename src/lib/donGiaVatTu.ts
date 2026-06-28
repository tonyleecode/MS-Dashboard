// ============================================================================
// ĐƠN GIÁ VẬT TƯ (đ) — giá thị trường, SỬA ĐƯỢC.
// Giá mặc định là tham khảo; giám đốc/người dùng cập nhật theo thị trường &
// theo công bố giá địa phương (xem 04_Dinh-muc-du-toan-phap-ly: giá VL tính
// đến chân công trình). Lưu trong localStorage để chỉnh và giữ lại.
// ============================================================================

import type { KetQuaBocTach } from './takeoff';

export interface DonGiaVatTu {
  thep: number;   // đ / kg
  ximang: number; // đ / bao 50kg
  cat: number;    // đ / m³
  da: number;     // đ / m³
  gach: number;   // đ / viên
}

/** Giá tham khảo (cập nhật sau theo thị trường / công bố giá Sở Xây dựng). */
export const DON_GIA_MAC_DINH: DonGiaVatTu = {
  thep: 16500,
  ximang: 90000,
  cat: 450000,
  da: 400000,
  gach: 1500,
};

export const DON_GIA_META: { key: keyof DonGiaVatTu; ten: string; dvt: string }[] = [
  { key: 'thep', ten: 'Thép xây dựng', dvt: 'đ/kg' },
  { key: 'ximang', ten: 'Xi măng PCB40', dvt: 'đ/bao' },
  { key: 'cat', ten: 'Cát vàng', dvt: 'đ/m³' },
  { key: 'da', ten: 'Đá dăm', dvt: 'đ/m³' },
  { key: 'gach', ten: 'Gạch xây', dvt: 'đ/viên' },
];

export interface DongChiPhi {
  ten: string;
  dvt: string;
  khoiLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface ThanhTienVatTu {
  dong: DongChiPhi[];
  tong: number;
}

/** Tính thành tiền vật liệu (phần VL trong chi phí trực tiếp). */
export function tinhThanhTien(kq: KetQuaBocTach, dg: DonGiaVatTu): ThanhTienVatTu {
  const dong: DongChiPhi[] = [
    { ten: 'Thép xây dựng', dvt: 'kg', khoiLuong: kq.thepKg, donGia: dg.thep },
    { ten: 'Xi măng PCB40', dvt: 'bao', khoiLuong: kq.ximangBao, donGia: dg.ximang },
    { ten: 'Cát vàng', dvt: 'm³', khoiLuong: kq.catM3, donGia: dg.cat },
    { ten: 'Đá dăm', dvt: 'm³', khoiLuong: kq.daM3, donGia: dg.da },
    { ten: 'Gạch xây', dvt: 'viên', khoiLuong: kq.gachVien, donGia: dg.gach },
  ].map((d) => ({ ...d, thanhTien: Math.round(d.khoiLuong * d.donGia) }));
  const tong = dong.reduce((s, d) => s + d.thanhTien, 0);
  return { dong, tong };
}

const KEY = 'ms_don_gia_vat_tu';
export function loadDonGia(): DonGiaVatTu {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return { ...DON_GIA_MAC_DINH, ...JSON.parse(s) };
  } catch {}
  return { ...DON_GIA_MAC_DINH };
}
export function saveDonGia(dg: DonGiaVatTu) {
  try { localStorage.setItem(KEY, JSON.stringify(dg)); } catch {}
}
