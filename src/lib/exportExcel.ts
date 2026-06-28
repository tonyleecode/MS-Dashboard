// ============================================================================
// XUẤT EXCEL kiểu G8 cho bảng bóc tách vật tư.
// 4 sheet: Thông tin · Tiên lượng · Phân tích vật tư (CLVT) · Tổng hợp vật tư.
// ============================================================================

import * as XLSX from 'xlsx';
import { bocTachVatTu, CauKien } from './takeoff';
import { TRONG_LUONG_THEP_KG_M } from './dinhMuc';
import { tinhThanhTien, DonGiaVatTu, DON_GIA_MAC_DINH } from './donGiaVatTu';

const r2 = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

const LOAI_LABEL: Record<CauKien['loai'], string> = {
  betong: 'Bê tông', thep: 'Thép', xay: 'Xây tường', to: 'Tô/Trát',
};

function quyCach(ck: CauKien): string {
  switch (ck.loai) {
    case 'betong': return `${ck.mac}`;
    case 'thep': return `Ø${ck.phi}`;
    case 'xay': return `dày ${ck.chieuDay} m`;
    case 'to': return `${ck.soMat ?? 1} mặt × ${ck.chieuDayCm ?? 1.5} cm`;
  }
}

function khoiLuongTienLuong(ck: CauKien): { kl: number; dvt: string } {
  switch (ck.loai) {
    case 'betong': return { kl: r2(ck.theTich, 3), dvt: 'm³' };
    case 'thep': {
      const kg = ck.khoiLuongKg ?? (ck.chieuDaiM ? ck.chieuDaiM * (TRONG_LUONG_THEP_KG_M[ck.phi] || 0) : 0);
      return { kl: r2(kg), dvt: 'kg' };
    }
    case 'xay': return { kl: r2(ck.dienTich, 2), dvt: 'm²' };
    case 'to': return { kl: r2(ck.dienTich * (ck.soMat ?? 1), 2), dvt: 'm²' };
  }
}

function autoCols(rows: any[][]): XLSX.ColInfo[] {
  const widths: number[] = [];
  for (const row of rows) row.forEach((c, i) => {
    const len = (c == null ? '' : String(c)).length;
    widths[i] = Math.max(widths[i] || 8, Math.min(len + 2, 50));
  });
  return widths.map((w) => ({ wch: w }));
}

export function exportTakeoffExcel(tenCT: string, cauKiens: CauKien[], donGia: DonGiaVatTu = DON_GIA_MAC_DINH) {
  const kq = bocTachVatTu(cauKiens);
  const ngay = new Date().toLocaleDateString('vi-VN');
  const wb = XLSX.utils.book_new();

  // --- Sheet 1: Thông tin ---
  const info = [
    ['BẢNG BÓC TÁCH VẬT TƯ THEO ĐỊNH MỨC NHÀ NƯỚC'],
    [],
    ['Công ty', 'CÔNG TY TƯ VẤN THIẾT KẾ & ĐẦU TƯ XÂY DỰNG MS'],
    ['Công trình', tenCT || '(chưa đặt tên)'],
    ['Ngày lập', ngay],
    ['Định mức áp dụng', 'Cấp phối Bộ Xây dựng (ĐM 1776/1784) — xi măng PCB40, đá 1×2'],
    ['Số cấu kiện', cauKiens.length],
    [],
    ['Ghi chú', 'Số liệu quy đổi theo định mức Nhà nước, có thể giải trình từng dòng.'],
    ['', 'Độ chính xác phụ thuộc độ đầy đủ của bảng khối lượng — kỹ sư cần rà soát.'],
    ['', 'Bảng chưa gồm đơn giá/thành tiền.'],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(info);
  wsInfo['!cols'] = [{ wch: 18 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, 'Thông tin');

  // --- Sheet 2: Tiên lượng ---
  const tlHead = ['STT', 'Hạng mục', 'Loại', 'Quy cách', 'Khối lượng', 'ĐVT'];
  const tlRows: any[][] = [tlHead];
  cauKiens.forEach((ck, i) => {
    const { kl, dvt } = khoiLuongTienLuong(ck);
    tlRows.push([i + 1, ck.ten || LOAI_LABEL[ck.loai], LOAI_LABEL[ck.loai], quyCach(ck), kl, dvt]);
  });
  const wsTL = XLSX.utils.aoa_to_sheet(tlRows);
  wsTL['!cols'] = autoCols(tlRows);
  XLSX.utils.book_append_sheet(wb, wsTL, 'Tiên lượng');

  // --- Sheet 3: Phân tích vật tư (CLVT) — vật tư theo từng cấu kiện ---
  const clHead = ['STT', 'Hạng mục', 'Xi măng (kg)', 'Cát (m³)', 'Đá (m³)', 'Gạch (viên)', 'Thép (kg)'];
  const clRows: any[][] = [clHead];
  cauKiens.forEach((ck, i) => {
    const r = bocTachVatTu([ck]);
    clRows.push([
      i + 1, ck.ten || LOAI_LABEL[ck.loai],
      r2(r.ximangKg), r2(r.catM3), r2(r.daM3), Math.round(r.gachVien), r2(r.thepKg),
    ]);
  });
  clRows.push(['', 'TỔNG CỘNG', r2(kq.ximangKg), r2(kq.catM3), r2(kq.daM3), Math.round(kq.gachVien), r2(kq.thepKg)]);
  const wsCL = XLSX.utils.aoa_to_sheet(clRows);
  wsCL['!cols'] = autoCols(clRows);
  XLSX.utils.book_append_sheet(wb, wsCL, 'Phân tích VT (CLVT)');

  // --- Sheet 4: Tổng hợp vật tư ---
  const thRows: any[][] = [['VẬT TƯ', 'ĐVT', 'KHỐI LƯỢNG']];
  thRows.push([kq.thepLaUocTinh ? 'Thép xây dựng (ƯỚC TÍNH theo hàm lượng)' : 'Thép xây dựng (tổng)', 'kg', r2(kq.thepKg)]);
  Object.entries(kq.thepTheoPhi).sort((a, b) => +a[0] - +b[0]).forEach(([phi, kg]) =>
    thRows.push([`  - Thép Ø${phi}`, 'kg', r2(Number(kg))]));
  thRows.push(['Xi măng PCB40', 'bao 50kg', kq.ximangBao]);
  thRows.push(['  (tương đương)', 'kg', r2(kq.ximangKg)]);
  thRows.push(['Cát vàng', 'm³', r2(kq.catM3)]);
  thRows.push(['Đá dăm (tổng)', 'm³', r2(kq.daM3)]);
  Object.entries(kq.daTheoLoai).forEach(([loai, m3]) =>
    thRows.push([`  - Đá ${loai}`, 'm³', r2(Number(m3))]));
  thRows.push(['Gạch xây (tổng)', 'viên', Math.round(kq.gachVien)]);
  Object.entries(kq.gachTheoLoai).forEach(([loai, v]) =>
    thRows.push([`  - ${loai}`, 'viên', Math.round(Number(v))]));
  thRows.push([]);
  thRows.push(['— Khối lượng trung gian —']);
  thRows.push(['Bê tông', 'm³', r2(kq.beTongM3)]);
  Object.entries(kq.beTongTheoMac).forEach(([mac, m3]) =>
    thRows.push([`  - ${mac}`, 'm³', r2(Number(m3))]));
  thRows.push(['Khối xây', 'm³', r2(kq.tuongM3)]);
  thRows.push(['Tô trát', 'm²', r2(kq.toM2)]);
  const wsTH = XLSX.utils.aoa_to_sheet(thRows);
  wsTH['!cols'] = [{ wch: 26 }, { wch: 10 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsTH, 'Tổng hợp vật tư');

  // --- Sheet 5: Tổng hợp kinh phí vật tư (THKP) ---
  const tt = tinhThanhTien(kq, donGia);
  const kpRows: any[][] = [['STT', 'Vật tư', 'ĐVT', 'Khối lượng', 'Đơn giá (đ)', 'Thành tiền (đ)']];
  tt.dong.forEach((d, i) => kpRows.push([i + 1, d.ten, d.dvt, r2(d.khoiLuong), d.donGia, d.thanhTien]));
  kpRows.push(['', 'CỘNG CHI PHÍ VẬT TƯ (VL)', '', '', '', tt.tong]);
  kpRows.push([]);
  kpRows.push(['Ghi chú:', 'Đơn giá là giá tham khảo, cập nhật theo thị trường / công bố giá địa phương.']);
  kpRows.push(['', 'Đây là chi phí VẬT LIỆU (VL). Chưa gồm nhân công (NC), máy thi công (MTC),']);
  kpRows.push(['', 'chi phí gián tiếp, thu nhập chịu thuế tính trước và thuế GTGT (theo TT 11/2021/TT-BXD).']);
  const wsKP = XLSX.utils.aoa_to_sheet(kpRows);
  wsKP['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsKP, 'Tổng hợp kinh phí');

  // --- Xuất file ---
  const safe = (tenCT || 'cong-trinh').replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 40);
  XLSX.writeFile(wb, `BocTachVatTu-MS-${safe}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
