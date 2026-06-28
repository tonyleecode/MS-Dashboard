// ============================================================================
// BÓC TÁCH KHỐI LƯỢNG → VẬT TƯ
// Lớp 1 (AI đọc bản vẽ) tạo ra danh sách CẤU KIỆN có khối lượng. Lớp 2 (file
// này + dinhMuc.ts) quy đổi sang vật tư mua: thép, xi măng, cát, đá, gạch.
// Toàn bộ phép tính là XÁC ĐỊNH, có thể giải trình từng dòng với chủ nhà.
// ============================================================================

import {
  CAP_PHOI_BE_TONG, CAP_PHOI_VUA, TRONG_LUONG_THEP_KG_M,
  DINH_MUC_XAY, DINH_MUC_TO, HAO_HUT, KG_PER_BAO_XIMANG,
  HAM_LUONG_THEP_KG_M3, phanLoaiBeTong,
  MacBeTong, MacVua,
} from './dinhMuc';

// ---- Mô hình cấu kiện (Bảng khối lượng / BOQ) ----------------------------

/** Khối bê tông cốt thép: nhập thể tích trực tiếp HOẶC kích thước để tự tính. */
export interface CauKienBeTong {
  loai: 'betong';
  ten: string;            // "Cột tầng trệt", "Sàn lầu 1", "Móng M1"...
  mac: MacBeTong;
  theTich: number;        // m³ (đã tính sẵn cho 1 nhóm cấu kiện)
}

/** Thép: nhập theo đường kính + tổng chiều dài, HOẶC khối lượng kg trực tiếp. */
export interface CauKienThep {
  loai: 'thep';
  ten: string;
  phi: number;            // mm (6,8,10,12,14,16,18,20,22,25...)
  chieuDaiM?: number;     // tổng mét dài của thanh thép phi này
  khoiLuongKg?: number;   // nếu đã biết kg, dùng thẳng
}

/** Xây tường: diện tích mặt tường × bề dày. */
export interface CauKienXay {
  loai: 'xay';
  ten: string;
  dienTich: number;       // m² mặt tường (dài × cao, đã trừ cửa nếu có)
  chieuDay: number;       // m (0.1 cho tường 10, 0.2 cho tường 20)
  loaiGach?: keyof typeof DINH_MUC_XAY; // mặc định gạch ống 8x8x18
}

/** Tô/trát tường: diện tích × bề dày × số mặt. */
export interface CauKienTo {
  loai: 'to';
  ten: string;
  dienTich: number;       // m² (một mặt)
  chieuDayCm?: number;    // mặc định 1.5cm
  soMat?: number;         // 1 hoặc 2 mặt, mặc định 1
}

export type CauKien = CauKienBeTong | CauKienThep | CauKienXay | CauKienTo;

// ---- Kết quả -------------------------------------------------------------

export interface DongVatTu {
  ten: string;
  donVi: string;
  khoiLuong: number;
}

export interface KetQuaBocTach {
  // tổng hợp vật tư chính (đã gồm hao hụt)
  ximangKg: number;
  ximangBao: number;
  catM3: number;
  daM3: number;
  daTheoLoai: Record<string, number>; // { '1x2': .., '4x6': .. }
  gachVien: number;
  gachTheoLoai: Record<string, number>;
  thepKg: number;
  thepTan: number;
  thepTheoPhi: Record<number, number>; // kg theo từng phi
  thepLaUocTinh: boolean; // true = thép ước tính theo hàm lượng (AI chưa đọc được thống kê thép)
  // số liệu khối lượng trung gian (để in bảng tiên lượng)
  beTongM3: number;
  beTongTheoMac: Record<string, number>;
  tuongM3: number;
  toM2: number;
  bangVatTu: DongVatTu[]; // bảng tổng hợp gọn để hiển thị
}

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/** Quy đổi danh sách cấu kiện -> vật tư tổng hợp. */
export function bocTachVatTu(cauKiens: CauKien[]): KetQuaBocTach {
  let ximang = 0, cat = 0;
  const daTheoLoai: Record<string, number> = {};
  const gachTheoLoai: Record<string, number> = {};
  const thepTheoPhi: Record<number, number> = {};
  const beTongTheoMac: Record<string, number> = {};
  let beTongM3 = 0, tuongM3 = 0, toM2 = 0, gachVien = 0, thepKg = 0, thepUocTinh = 0;

  const addDa = (loai: string, m3: number) => { daTheoLoai[loai] = (daTheoLoai[loai] || 0) + m3; };
  const addGach = (loai: string, vien: number) => { gachTheoLoai[loai] = (gachTheoLoai[loai] || 0) + vien; };

  for (const ck of cauKiens) {
    switch (ck.loai) {
      case 'betong': {
        const cp = CAP_PHOI_BE_TONG[ck.mac];
        if (!cp || ck.theTich <= 0) break;
        beTongM3 += ck.theTich;
        beTongTheoMac[ck.mac] = (beTongTheoMac[ck.mac] || 0) + ck.theTich;
        ximang += cp.ximang * ck.theTich;
        cat += cp.cat * ck.theTich;
        addDa(cp.loaiDa, cp.da * ck.theTich);
        // ước tính thép theo hàm lượng (dùng khi bản vẽ không có thống kê thép)
        thepUocTinh += ck.theTich * HAM_LUONG_THEP_KG_M3[phanLoaiBeTong(ck.ten)];
        break;
      }
      case 'thep': {
        let kg = ck.khoiLuongKg ?? 0;
        if (!kg && ck.chieuDaiM) {
          const u = TRONG_LUONG_THEP_KG_M[ck.phi];
          if (u) kg = ck.chieuDaiM * u;
        }
        if (kg > 0) {
          thepKg += kg;
          thepTheoPhi[ck.phi] = (thepTheoPhi[ck.phi] || 0) + kg;
        }
        break;
      }
      case 'xay': {
        const dm = DINH_MUC_XAY[ck.loaiGach ?? 'gach_ong_8x8x18'];
        const theTich = ck.dienTich * ck.chieuDay; // m³ khối xây
        if (theTich <= 0) break;
        tuongM3 += theTich;
        addGach(dm.ten, dm.vienPerM3 * theTich);
        gachVien += dm.vienPerM3 * theTich;
        const vuaM3 = dm.vuaPerM3 * theTich;
        const cpv = CAP_PHOI_VUA[dm.macVua];
        ximang += cpv.ximang * vuaM3;
        cat += cpv.cat * vuaM3;
        break;
      }
      case 'to': {
        const dien = ck.dienTich * (ck.soMat ?? 1);
        const day = ck.chieuDayCm ?? 1.5;
        if (dien <= 0) break;
        toM2 += dien;
        const vuaM3 = dien * day * DINH_MUC_TO.vuaPerM2PerCm;
        const cpv = CAP_PHOI_VUA[DINH_MUC_TO.macVua];
        ximang += cpv.ximang * vuaM3;
        cat += cpv.cat * vuaM3;
        break;
      }
    }
  }

  // Thép: ưu tiên số đọc được từ bản vẽ; nếu không có → dùng số ước tính theo hàm lượng.
  let thepLaUocTinh = false;
  if (thepKg <= 0 && thepUocTinh > 0) { thepKg = thepUocTinh; thepLaUocTinh = true; }

  // Áp hao hụt
  ximang *= HAO_HUT.ximang;
  cat *= HAO_HUT.cat;
  for (const k in daTheoLoai) daTheoLoai[k] *= HAO_HUT.da;
  for (const k in gachTheoLoai) gachTheoLoai[k] *= HAO_HUT.gach;
  for (const k in thepTheoPhi) thepTheoPhi[k as any] *= HAO_HUT.thep;
  thepKg *= HAO_HUT.thep;
  gachVien *= HAO_HUT.gach;

  const daM3 = Object.values(daTheoLoai).reduce((a, b) => a + b, 0);
  const ximangBao = ximang / KG_PER_BAO_XIMANG;

  const bangVatTu: DongVatTu[] = [
    { ten: thepLaUocTinh ? 'Thép xây dựng (ước tính)' : 'Thép xây dựng các loại', donVi: 'kg', khoiLuong: round(thepKg) },
    { ten: 'Xi măng PCB40', donVi: 'bao (50kg)', khoiLuong: Math.ceil(ximangBao) },
    { ten: 'Cát (cát vàng)', donVi: 'm³', khoiLuong: round(cat) },
    { ten: 'Đá dăm', donVi: 'm³', khoiLuong: round(daM3) },
    { ten: 'Gạch xây', donVi: 'viên', khoiLuong: Math.round(gachVien) },
  ];

  return {
    ximangKg: round(ximang), ximangBao: Math.ceil(ximangBao),
    catM3: round(cat),
    daM3: round(daM3), daTheoLoai: mapRound(daTheoLoai),
    gachVien: Math.round(gachVien), gachTheoLoai: mapRound(gachTheoLoai, 0),
    thepKg: round(thepKg), thepTan: round(thepKg / 1000, 3), thepTheoPhi: mapRound(thepTheoPhi), thepLaUocTinh,
    beTongM3: round(beTongM3), beTongTheoMac: mapRound(beTongTheoMac),
    tuongM3: round(tuongM3), toM2: round(toM2),
    bangVatTu,
  };
}

function mapRound<T extends Record<string | number, number>>(m: T, d = 2): T {
  const out: any = {};
  for (const k in m) out[k] = Math.round(m[k] * 10 ** d) / 10 ** d;
  return out;
}

// ---- Tiện ích tính thể tích cấu kiện thường gặp --------------------------

/** Cột/đà chữ nhật: rộng×sâu×dài×số lượng (m³). */
export const theTichCot = (rongM: number, sauM: number, daiM: number, soLuong = 1) =>
  rongM * sauM * daiM * soLuong;

/** Sàn/đan: diện tích × bề dày (m³). */
export const theTichSan = (dienTichM2: number, dayM: number) => dienTichM2 * dayM;

/** Móng đơn khối chữ nhật: dài×rộng×cao×số lượng (m³). */
export const theTichMong = (daiM: number, rongM: number, caoM: number, soLuong = 1) =>
  daiM * rongM * caoM * soLuong;
