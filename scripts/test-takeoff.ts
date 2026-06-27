import { bocTachVatTu, CauKien, theTichCot, theTichSan, theTichMong } from '../src/lib/takeoff';
import { CAP_PHOI_BE_TONG, KG_PER_BAO_XIMANG } from '../src/lib/dinhMuc';

// --- Kiểm tra 1: 10 m³ bê tông M250 (cấp phối chuẩn) ---
const t1 = bocTachVatTu([{ loai: 'betong', ten: 'Test M250', mac: 'M250', theTich: 10 }]);
console.log('== Test 1: 10 m³ BT M250 ==');
console.log('  XM kg (gồm hao hụt):', t1.ximangKg, '| bao:', t1.ximangBao);
console.log('  Cát m³:', t1.catM3, '| Đá m³:', t1.daM3);
const expXM = 415 * 10 * 1.01; // ~4191
console.assert(Math.abs(t1.ximangKg - expXM) < 1, 'XM M250 sai');
console.log('  Kỳ vọng XM ~', Math.round(expXM), '-> OK\n');

// --- Kiểm tra 2: công trình nhà phố chị Hương (1 trệt 1 lầu) ---
const TRET_DT = 5.4 * 18.5;  // 99.9 m²
const LAU_DT = 5.4 * 19.7;   // 106.38 m²
const ck: CauKien[] = [
  // Móng: giả định 6 móng M1 + 6 móng M2, BT đá 1x2 M250
  { loai: 'betong', ten: 'Móng M1 (900×1450×700)', mac: 'M250', theTich: theTichMong(1.45, 0.9, 0.7, 6) },
  { loai: 'betong', ten: 'Móng M2 (900×900×700)', mac: 'M250', theTich: theTichMong(0.9, 0.9, 0.7, 6) },
  { loai: 'betong', ten: 'BT lót móng đá 4x6 M100 d10', mac: 'M100', theTich: 12 * 1.0 * 1.5 * 0.1 },
  // Cột: 12 cột 20×20, tổng cao trệt 4.1 + lầu 3.8
  { loai: 'betong', ten: 'Cột 20×20 (12 cột)', mac: 'M250', theTich: theTichCot(0.2, 0.2, 4.1 + 3.8, 12) },
  // Sàn trệt + lầu, dày 10cm
  { loai: 'betong', ten: 'Sàn trệt d10', mac: 'M250', theTich: theTichSan(TRET_DT, 0.1) },
  { loai: 'betong', ten: 'Sàn lầu 1 d10', mac: 'M250', theTich: theTichSan(LAU_DT, 0.1) },
  // Thép
  { loai: 'thep', ten: 'Thép cột Fi16 (4×12 cột × 7.9m)', phi: 16, chieuDaiM: 4 * 12 * 7.9 },
  { loai: 'thep', ten: 'Thép móng Fi12', phi: 12, chieuDaiM: 6 * (6 * 1.45 + 10 * 0.9) },
  { loai: 'thep', ten: 'Thép sàn Fi10@200 (2 sàn)', phi: 10, chieuDaiM: (TRET_DT + LAU_DT) * 11 },
  // Tường: bao 20cm + ngăn 10cm (ước lượng diện tích)
  { loai: 'xay', ten: 'Tường bao 20', dienTich: 5.4 * 7.9 * 2 + 18.5 * 7.9, chieuDay: 0.2 },
  { loai: 'xay', ten: 'Tường ngăn 10', dienTich: 120, chieuDay: 0.1 },
  // Tô 2 mặt
  { loai: 'to', ten: 'Tô tường trong+ngoài', dienTich: 480, soMat: 2, chieuDayCm: 1.5 },
];

const r = bocTachVatTu(ck);
console.log('== Test 2: Nhà phố 1 trệt 1 lầu (chị Hương) ==');
console.log('  Bê tông tổng:', r.beTongM3, 'm³', '|', JSON.stringify(r.beTongTheoMac));
console.log('  Tường:', r.tuongM3, 'm³ | Tô:', r.toM2, 'm²');
console.log('  --- VẬT TƯ TỔNG HỢP (gồm hao hụt) ---');
for (const d of r.bangVatTu) console.log('   ', d.ten.padEnd(28), d.khoiLuong, d.donVi);
console.log('  Thép theo phi (kg):', JSON.stringify(r.thepTheoPhi));
console.log('  Đá theo loại (m³):', JSON.stringify(r.daTheoLoai));
console.log('  Gạch theo loại (viên):', JSON.stringify(r.gachTheoLoai));

// sanity: thép/m² sàn phải nằm khoảng 15-40 kg/m² nhà phố thông thường
const sanTong = TRET_DT + LAU_DT;
console.log('\n  Kiểm tra hợp lý: thép', Math.round(r.thepKg), 'kg /', Math.round(sanTong), 'm² sàn =',
  (r.thepKg / sanTong).toFixed(1), 'kg/m²');
console.log('  BT', r.beTongM3, 'm³ /', Math.round(sanTong), 'm² sàn =', (r.beTongM3 / sanTong).toFixed(3), 'm³/m²');
console.log('\nDONE.');
