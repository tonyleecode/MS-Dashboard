import { bocTachVatTu, CauKien } from '../src/lib/takeoff';
const bt = (ten: string, theTich: number): CauKien => ({ loai: 'betong', ten, mac: 'M250', theTich });
const ck: CauKien[] = [
  bt('Bê tông lót móng', 0.46), bt('Bê tông móng', 2.3),
  bt('Bê tông cột tầng trệt', 1.728), bt('Bê tông cột tầng lầu', 1.728),
  bt('Bê tông đà kiềng', 4.68), bt('Bê tông sàn tầng trệt', 6), bt('Bê tông sàn tầng lầu', 6),
  bt('Bê tông đà sàn tầng lầu', 4.68), bt('Bê tông đà sàn mái', 4.56), bt('Bê tông kèo mái', 3.66),
  bt('Bê tông đà lanh tô', 0.712), bt('Bê tông đà bản thang', 0.162), bt('Bê tông đà giằng tường mái', 0.76),
  bt('Bê tông đáy hầm tự hoại', 0.168), bt('Bê tông tấm đan hầm tự hoại', 0.168),
];
const r = bocTachVatTu(ck);
console.log('Bê tông tổng:', r.beTongM3, 'm³');
console.log('THÉP:', r.thepKg, 'kg =', r.thepTan, 'tấn | là ước tính?', r.thepLaUocTinh);
console.log('=> thép/m² (sàn ~200m²):', (r.thepKg/200).toFixed(1), 'kg/m²');
