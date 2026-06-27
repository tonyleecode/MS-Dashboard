import React, { useMemo, useRef, useState } from 'react';
import {
  Upload, Loader2, Plus, Trash2, AlertTriangle, Box, Layers, Columns3,
  PaintRoller, Calculator, Info, FileSpreadsheet,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { bocTachVatTu, CauKien } from '../lib/takeoff';
import { docBanVe } from '../lib/aiDocReader';
import type { MacBeTong } from '../lib/dinhMuc';

const MAC_OPTIONS: MacBeTong[] = ['M100', 'M150', 'M200', 'M250', 'M300'];
const PHI_OPTIONS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25];

const LOAI_META: Record<CauKien['loai'], { label: string; icon: any; color: string }> = {
  betong: { label: 'Bê tông', icon: Box, color: '#1a4460' },
  thep: { label: 'Thép', icon: Columns3, color: '#b54708' },
  xay: { label: 'Xây tường', icon: Layers, color: '#5b6b2f' },
  to: { label: 'Tô/Trát', icon: PaintRoller, color: '#7a5295' },
};

const fmt = (n: number, d = 2) => n.toLocaleString('vi-VN', { maximumFractionDigits: d });

export default function MaterialTakeoff() {
  const [cauKiens, setCauKiens] = useState<CauKien[]>([]);
  const [tenCT, setTenCT] = useState('');
  const [canhBao, setCanhBao] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [thongBao, setThongBao] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ketQua = useMemo(() => bocTachVatTu(cauKiens), [cauKiens]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    setIsReading(true);
    setThongBao(null);
    try {
      const kq = await docBanVe(files);
      if (!kq.isBanVe) {
        setThongBao({ type: 'err', msg: 'Các file này không giống bản vẽ công trình. Vui lòng kiểm tra lại.' });
        return;
      }
      setCauKiens(kq.cauKiens);
      setCanhBao(kq.canhBao);
      if (kq.thongTin.ten) setTenCT(kq.thongTin.ten);
      setThongBao({ type: 'ok', msg: `AI đã bóc ${kq.cauKiens.length} cấu kiện từ ${files.length} bản vẽ. Hãy rà soát & chỉnh trước khi chốt vật tư.` });
    } catch (err: any) {
      setThongBao({ type: 'err', msg: err?.message || 'Lỗi đọc bản vẽ bằng AI.' });
    } finally {
      setIsReading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addRow = (loai: CauKien['loai']) => {
    const base = { ten: '' };
    const row: CauKien =
      loai === 'betong' ? { loai, ...base, mac: 'M250', theTich: 0 }
        : loai === 'thep' ? { loai, ...base, phi: 16, chieuDaiM: 0 }
          : loai === 'xay' ? { loai, ...base, dienTich: 0, chieuDay: 0.2 }
            : { loai, ...base, dienTich: 0, soMat: 2, chieuDayCm: 1.5 };
    setCauKiens((p) => [...p, row]);
  };

  const update = (i: number, patch: Partial<any>) =>
    setCauKiens((p) => p.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const remove = (i: number) => setCauKiens((p) => p.filter((_, idx) => idx !== i));

  const num = (v: string) => parseFloat(v) || 0;

  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem]">
      <div className="max-w-6xl mx-auto space-y-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant pb-md gap-md">
          <div>
            <h1 className="text-h1 text-primary-container mb-xs">Bóc Tách Vật Tư Theo Định Mức</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Tải bản vẽ → AI lập bảng khối lượng cấu kiện → bạn rà soát, chỉnh sửa → hệ thống quy đổi ra
              vật tư (thép, xi măng, cát, đá, gạch) theo <b>định mức Nhà nước (1776/1784)</b>.
            </p>
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isReading}
            className={cn(
              'border border-primary-container text-primary-container font-bold py-md px-lg rounded-xl flex items-center gap-sm hover:bg-surface-container-high transition-all shadow-sm shrink-0',
              isReading && 'opacity-60 cursor-not-allowed'
            )}
          >
            {isReading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload size={20} />}
            {isReading ? 'AI đang đọc bản vẽ...' : 'Tải bản vẽ (AI bóc tách)'}
          </button>
        </div>

        {/* Thông báo */}
        {thongBao && (
          <div className={cn(
            'p-md rounded-xl border text-body-md flex items-start gap-sm',
            thongBao.type === 'ok' ? 'bg-[#f0f7f0] border-[#cfe6cf] text-[#2f6b2f]' : 'bg-[#fdecea] border-[#f5c6c0] text-[#b42318]'
          )}>
            <Info className="shrink-0 mt-0.5" size={18} />
            <span>{thongBao.msg}</span>
          </div>
        )}

        {/* Cảnh báo của AI */}
        {canhBao.length > 0 && (
          <div className="bg-[#fff9f6] border border-[#ffd3c2] text-[#b54708] p-md rounded-xl">
            <div className="flex items-center gap-sm font-bold mb-xs"><AlertTriangle size={18} /> AI lưu ý cần kiểm tra ({canhBao.length})</div>
            <ul className="list-disc ml-lg text-body-md space-y-1">
              {canhBao.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}

        {/* Tên công trình */}
        <div className="flex items-center gap-md">
          <label className="text-label-caps text-on-surface-variant uppercase shrink-0">Công trình</label>
          <input
            value={tenCT} onChange={(e) => setTenCT(e.target.value)}
            placeholder="Tên công trình (vd: Nhà phố 1 trệt 1 lầu — Chị Hương)"
            className="flex-1 bg-surface border border-outline rounded-lg py-sm px-md outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* BẢNG KHỐI LƯỢNG (editable) */}
          <div className="lg:col-span-7 space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-md bg-surface-container-low border-b border-outline-variant flex items-center justify-between flex-wrap gap-sm">
                <h3 className="font-bold text-h3 text-primary-container">Bảng khối lượng cấu kiện ({cauKiens.length})</h3>
                <div className="flex gap-xs flex-wrap">
                  {(Object.keys(LOAI_META) as CauKien['loai'][]).map((loai) => {
                    const M = LOAI_META[loai];
                    return (
                      <button key={loai} onClick={() => addRow(loai)}
                        className="flex items-center gap-xs text-[12px] font-bold py-xs px-sm rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
                        <Plus size={14} /> {M.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {cauKiens.length === 0 ? (
                <div className="p-xl text-center text-on-surface-variant text-body-md">
                  Chưa có cấu kiện. Tải bản vẽ để AI bóc tự động, hoặc bấm “+ Bê tông / Thép / Xây tường / Tô” để nhập tay.
                </div>
              ) : (
                <div className="divide-y divide-outline-variant">
                  {cauKiens.map((ck, i) => {
                    const M = LOAI_META[ck.loai];
                    return (
                      <div key={i} className="p-md flex flex-col gap-sm">
                        <div className="flex items-center gap-sm">
                          <M.icon size={16} style={{ color: M.color }} className="shrink-0" />
                          <input
                            value={ck.ten} onChange={(e) => update(i, { ten: e.target.value })}
                            placeholder={`Tên ${M.label.toLowerCase()}`}
                            className="flex-1 bg-surface border border-outline rounded-md py-1 px-sm text-body-md outline-none focus:ring-1 focus:ring-primary-container"
                          />
                          <button onClick={() => remove(i)} className="text-on-surface-variant hover:text-[#b42318] p-1"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-sm pl-6">
                          {ck.loai === 'betong' && <>
                            <Field label="Mác BT">
                              <select value={ck.mac} onChange={(e) => update(i, { mac: e.target.value })} className={selectCls}>
                                {MAC_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </Field>
                            <Field label="Thể tích (m³)"><input type="number" value={ck.theTich || ''} onChange={(e) => update(i, { theTich: num(e.target.value) })} className={inputCls} /></Field>
                          </>}
                          {ck.loai === 'thep' && <>
                            <Field label="Phi (mm)">
                              <select value={ck.phi} onChange={(e) => update(i, { phi: parseInt(e.target.value) })} className={selectCls}>
                                {PHI_OPTIONS.map((p) => <option key={p} value={p}>Ø{p}</option>)}
                              </select>
                            </Field>
                            <Field label="Tổng dài (m)"><input type="number" value={ck.chieuDaiM || ''} onChange={(e) => update(i, { chieuDaiM: num(e.target.value), khoiLuongKg: undefined })} className={inputCls} /></Field>
                            <Field label="hoặc Kg"><input type="number" value={ck.khoiLuongKg || ''} onChange={(e) => update(i, { khoiLuongKg: num(e.target.value) })} className={inputCls} /></Field>
                          </>}
                          {ck.loai === 'xay' && <>
                            <Field label="Diện tích (m²)"><input type="number" value={ck.dienTich || ''} onChange={(e) => update(i, { dienTich: num(e.target.value) })} className={inputCls} /></Field>
                            <Field label="Bề dày (m)">
                              <select value={ck.chieuDay} onChange={(e) => update(i, { chieuDay: num(e.target.value) })} className={selectCls}>
                                <option value={0.1}>0.1 (tường 10)</option>
                                <option value={0.2}>0.2 (tường 20)</option>
                              </select>
                            </Field>
                          </>}
                          {ck.loai === 'to' && <>
                            <Field label="Diện tích (m²)"><input type="number" value={ck.dienTich || ''} onChange={(e) => update(i, { dienTich: num(e.target.value) })} className={inputCls} /></Field>
                            <Field label="Số mặt">
                              <select value={ck.soMat} onChange={(e) => update(i, { soMat: parseInt(e.target.value) })} className={selectCls}>
                                <option value={1}>1 mặt</option><option value={2}>2 mặt</option>
                              </select>
                            </Field>
                            <Field label="Dày (cm)"><input type="number" value={ck.chieuDayCm || ''} onChange={(e) => update(i, { chieuDayCm: num(e.target.value) })} className={inputCls} /></Field>
                          </>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* VẬT TƯ TỔNG HỢP (live) */}
          <div className="lg:col-span-5 space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-md bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                <h3 className="font-bold text-h3 text-primary-container flex items-center gap-xs"><Calculator size={18} className="text-[#d36c2b]" /> Vật tư tổng hợp</h3>
                <span className="bg-primary-container text-on-primary text-[9px] px-sm py-[2px] rounded font-bold uppercase">ĐM Nhà nước</span>
              </div>
              <div className="p-md space-y-sm">
                <Stat name="Thép xây dựng" val={`${fmt(ketQua.thepKg)} kg`} sub={`${fmt(ketQua.thepTan, 3)} tấn`} />
                <Stat name="Xi măng PCB40" val={`${ketQua.ximangBao} bao`} sub={`${fmt(ketQua.ximangKg)} kg`} />
                <Stat name="Cát vàng" val={`${fmt(ketQua.catM3)} m³`} />
                <Stat name="Đá dăm" val={`${fmt(ketQua.daM3)} m³`} sub={Object.entries(ketQua.daTheoLoai).map(([k, v]) => `đá ${k}: ${fmt(Number(v))}`).join(' · ')} />
                <Stat name="Gạch xây" val={`${fmt(ketQua.gachVien, 0)} viên`} />
                <div className="pt-sm border-t border-outline-variant text-label-caps text-on-surface-variant text-[11px] uppercase">Khối lượng trung gian</div>
                <Stat name="Bê tông" val={`${fmt(ketQua.beTongM3)} m³`} sub={Object.entries(ketQua.beTongTheoMac).map(([k, v]) => `${k}: ${fmt(Number(v))}`).join(' · ')} small />
                <Stat name="Khối xây" val={`${fmt(ketQua.tuongM3)} m³`} small />
                <Stat name="Tô trát" val={`${fmt(ketQua.toM2)} m²`} small />
              </div>
            </div>

            {Object.keys(ketQua.thepTheoPhi).length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
                <div className="text-label-caps text-on-surface-variant uppercase text-[11px] mb-sm">Thép theo đường kính (kg)</div>
                <div className="grid grid-cols-2 gap-xs text-body-md">
                  {Object.entries(ketQua.thepTheoPhi).sort((a, b) => +a[0] - +b[0]).map(([phi, kg]) => (
                    <div key={phi} className="flex justify-between border-b border-outline-variant/40 py-1">
                      <span className="text-on-surface-variant">Ø{phi}</span><span className="font-bold">{fmt(Number(kg))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => alert('Xuất Excel bảng tiên lượng + tổng hợp vật tư — sẽ bổ sung ở bước sau.')}
              className="w-full bg-[#d36c2b] text-white font-bold py-md rounded-xl flex items-center justify-center gap-sm hover:opacity-90 transition-opacity shadow-md">
              <FileSpreadsheet size={18} /> Xuất bảng vật tư (.xlsx)
            </button>

            <div className="bg-[#fff9f6] border border-[#ffd3c2] text-[#b54708] p-md rounded-lg text-body-md flex items-start gap-sm">
              <Info className="shrink-0 mt-0.5" size={16} />
              <span>Số liệu quy đổi theo định mức Nhà nước, có thể giải trình từng dòng. Độ chính xác phụ thuộc độ đầy đủ của bảng khối lượng — kỹ sư cần rà soát cấu kiện AI bóc.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-28 bg-surface border border-outline rounded-md py-1 px-sm text-body-md outline-none focus:ring-1 focus:ring-primary-container';
const selectCls = 'bg-surface border border-outline rounded-md py-1 px-sm text-body-md outline-none focus:ring-1 focus:ring-primary-container';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wide">{label}</span>
      {children}
    </label>
  );
}

function Stat({ name, val, sub, small }: { name: string; val: string; sub?: string; small?: boolean }) {
  return (
    <div className={cn('flex justify-between items-center', small ? 'py-0.5' : 'border-b border-outline-variant/40 pb-xs')}>
      <span className={cn('text-on-surface', small ? 'text-body-md' : 'font-medium')}>{name}</span>
      <div className="text-right">
        <div className={cn('font-bold', small ? 'text-body-md text-on-surface' : 'text-primary-container')}>{val}</div>
        {sub && <div className="text-[11px] text-on-surface-variant">{sub}</div>}
      </div>
    </div>
  );
}
