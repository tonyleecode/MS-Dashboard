import { exportTakeoffExcel } from '../src/lib/exportExcel';
import { CauKien } from '../src/lib/takeoff';

const ck: CauKien[] = [
  { loai: 'betong', ten: 'Móng M1', mac: 'M250', theTich: 5.48 },
  { loai: 'betong', ten: 'Cột 20×20', mac: 'M250', theTich: 3.79 },
  { loai: 'betong', ten: 'Sàn trệt d10', mac: 'M250', theTich: 9.99 },
  { loai: 'thep', ten: 'Thép cột Ø16', phi: 16, chieuDaiM: 379 },
  { loai: 'thep', ten: 'Thép sàn Ø10', phi: 10, chieuDaiM: 1100 },
  { loai: 'xay', ten: 'Tường bao 20', dienTich: 180, chieuDay: 0.2 },
  { loai: 'to', ten: 'Tô tường', dienTich: 360, soMat: 2, chieuDayCm: 1.5 },
];
exportTakeoffExcel('Nhà phố test Chị Hương', ck);
console.log('Đã ghi file xlsx vào thư mục hiện tại.');
