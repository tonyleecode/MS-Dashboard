import React from 'react';
import { Download, Save, Info } from 'lucide-react';
import { useEstimation } from '../context/EstimationContext';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from '../context/NotificationContext';
import logoImage from '../assets/images/MS-logo-main.png';

import { COMPANY_INFO } from '../constants/companyInfo';

interface EstimationResultProps {
  onBack?: () => void;
}

export const EstimationResult: React.FC<EstimationResultProps> = () => {
  const { estimationData, prices, coefficients, saveEstimation } = useEstimation();
  const { t } = useSettings();
  const { addNotification } = useNotifications();

  // Basic Area
  const baseArea = estimationData.width * estimationData.length;

  // Calculate items
  const items = [];

  // Móng
  const mFoundationArea = baseArea;
  const mFoundationCoeff = coefficients.foundation[estimationData.foundation];
  const mFoundationTotal = (mFoundationArea * mFoundationCoeff) / 100;
  items.push({
    name: `Phần Móng (Móng ${estimationData.foundation})`,
    area: mFoundationArea,
    coeff: mFoundationCoeff,
    total: mFoundationTotal,
  });

  // Tầng hầm
  if (estimationData.basement !== 'none') {
    const basementCoeff = coefficients.basement[estimationData.basement];
    const basementTotal = (baseArea * basementCoeff) / 100;
    items.push({
      name: 'Tầng hầm',
      area: baseArea,
      coeff: basementCoeff,
      total: basementTotal,
    });
  }

  // Tầng trệt
  items.push({
    name: 'Tầng Trệt (Thân nhà)',
    area: baseArea,
    coeff: 100,
    total: baseArea,
  });

  // Lầu
  for (let i = 2; i <= estimationData.floors; i++) {
    items.push({
      name: `Lầu ${i - 1} (Thân nhà)`,
      area: baseArea,
      coeff: 100,
      total: baseArea,
    });
  }

  // Sân thượng (assume 50%)
  if (estimationData.floors > 0) {
    items.push({
      name: 'Sân thượng (Khác)',
      area: baseArea,
      coeff: coefficients.roofTerrace,
      total: (baseArea * coefficients.roofTerrace) / 100,
    });
  }

  // Mái
  const roofCoeff = coefficients.roof[estimationData.roof];
  items.push({
    name: `Mái (${estimationData.roof})`,
    area: baseArea,
    coeff: roofCoeff,
    total: (baseArea * roofCoeff) / 100,
  });

  // Summarize
  let totalRawArea = 0;
  let totalEquivArea = 0;
  let mongArea = 0;
  let thanNhaArea = 0;
  let maiKhacArea = 0;

  items.forEach((item) => {
    totalRawArea += item.area;
    totalEquivArea += item.total;
    if (item.name.includes('Móng')) {
      mongArea += item.total;
    } else if (item.name.includes('Thân nhà')) {
      thanNhaArea += item.total;
    } else {
      maiKhacArea += item.total;
    }
  });

  // Price calculations
  let unitPrice = prices.tho;
  if (estimationData.packageType === 'trongoi') {
    unitPrice = prices[estimationData.packageLevel || 'kha'] || prices.tho;
  }

  const totalCost = unitPrice * totalEquivArea;

  const mongPercent = (mongArea / totalEquivArea) * 100 || 0;
  const thanNhaPercent = (thanNhaArea / totalEquivArea) * 100 || 0;
  const maiKhacPercent = (maiKhacArea / totalEquivArea) * 100 || 0;

  // Pie chart dash array calculation
  // Circle circumference is roughly 100.
  // 15.915 * 2 * PI = 100
  const r = 15.915;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Print Header */}
      <div className="hidden print:flex justify-between items-end border-b-2 border-primary pb-4 mb-8">
        <div>
          <img src={logoImage} alt="MIND & SOLID" className="h-7 md:h-8 mb-2 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <h2 className="text-secondary font-bold text-sm tracking-widest uppercase">{COMPANY_INFO.name}</h2>
          <p className="text-neutral-slate text-xs mt-1">hotline: {COMPANY_INFO.hotline} | email: info@xaydungms.vn</p>
        </div>
        <div className="text-right">
          <h1 className="font-h1 text-2xl font-bold text-primary mb-1 uppercase tracking-wider">{t('result.title')}</h1>
          <p className="text-neutral-slate text-xs">{t('result.id')}: #AL-2026-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
          <p className="text-neutral-slate text-xs">{t('result.date')}: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      {/* Page Header (Hidden in Print) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
        <div>
          <h1 className="font-h1 text-3xl font-bold text-primary">{t('result.title')}</h1>
          <p className="text-neutral-slate text-sm mt-1">{t('result.id')}: #AL-2026-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')} | {t('result.date')}: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={() => {
              window.print();
              addNotification(t('result.exportPDF') + ' thành công');
            }}
            className="flex items-center gap-2 px-6 py-3 border border-outline text-neutral-slate font-bold rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('result.exportPDF')}
          </button>
          <button 
            onClick={() => {
              saveEstimation(totalEquivArea, totalCost);
              addNotification(t('result.saveFile') + ' thành công');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-5 h-5" />
            {t('result.saveFile')}
          </button>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Summary Section */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <span className="font-label-caps text-[11px] font-bold text-neutral-slate mb-1">{t('result.totalEquivArea')}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-h1 text-4xl font-bold text-primary">{totalEquivArea.toFixed(2)}</span>
              <span className="font-h3 text-xl font-bold text-neutral-slate">m2</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col justify-center">
            <span className="font-label-caps text-[11px] font-bold text-neutral-slate mb-1">{t('result.unitPrice')}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-h1 text-4xl font-bold text-primary">{unitPrice.toLocaleString('vi-VN')}</span>
              <span className="font-h3 text-xl font-bold text-neutral-slate">VNĐ/m2</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-sm flex flex-col justify-center border-l-4 border-l-secondary">
            <span className="font-label-caps text-[11px] font-bold text-neutral-slate mb-1">{t('result.totalCost')}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-h1 text-4xl font-bold text-primary">{totalCost.toLocaleString('vi-VN')}</span>
              <span className="font-h3 text-xl font-bold text-neutral-slate">VNĐ</span>
            </div>
          </div>
        </section>

        {/* Detailed Table Section */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-h3 text-lg font-bold text-primary">{t('result.table.title')}</h2>
            <Info className="w-5 h-5 text-neutral-slate" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container font-label-caps text-[11px] font-bold text-neutral-slate uppercase">
                  <th className="p-4 border-b border-outline-variant">{t('result.table.col1')}</th>
                  <th className="p-4 border-b border-outline-variant text-right">{t('result.table.col2')}</th>
                  <th className="p-4 border-b border-outline-variant text-right">{t('result.table.col3')}</th>
                  <th className="p-4 border-b border-outline-variant text-right">{t('result.table.col4')}</th>
                </tr>
              </thead>
              <tbody className="font-data-tabular">
                {items.map((item, idx) => (
                  <tr key={idx} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${idx % 2 !== 0 ? 'bg-surface-container-low/30' : ''}`}>
                    <td className="p-4 font-semibold text-on-surface">{item.name}</td>
                    <td className="p-4 text-right">{item.area.toFixed(2)}</td>
                    <td className="p-4 text-right text-neutral-slate">{item.coeff}%</td>
                    <td className="p-4 text-right font-bold text-primary">{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-container-low">
                <tr className="font-bold">
                  <td className="p-4 text-on-surface">{t('result.table.total')}</td>
                  <td className="p-4 text-right text-on-surface">{totalRawArea.toFixed(2)}</td>
                  <td className="p-4 text-right">-</td>
                  <td className="p-4 text-right text-secondary">{totalEquivArea.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Visualization & Chart Section */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Cost Distribution Chart */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-sm">
            <h2 className="font-h3 text-lg font-bold text-primary mb-6">{t('result.chart.title')}</h2>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r={r} fill="transparent" stroke="#eeedf0" strokeWidth="3.5"></circle>
                <circle cx="18" cy="18" r={r} fill="transparent" stroke="#1a4460" strokeDasharray={`${thanNhaPercent} ${100 - thanNhaPercent}`} strokeDashoffset="0" strokeWidth="3.5"></circle>
                <circle cx="18" cy="18" r={r} fill="transparent" stroke="#d36c2b" strokeDasharray={`${mongPercent} ${100 - mongPercent}`} strokeDashoffset={-thanNhaPercent} strokeWidth="3.5"></circle>
                <circle cx="18" cy="18" r={r} fill="transparent" stroke="#707d84" strokeDasharray={`${maiKhacPercent} ${100 - maiKhacPercent}`} strokeDashoffset={-(thanNhaPercent + mongPercent)} strokeWidth="3.5"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-h2 text-3xl font-bold text-primary">100%</span>
                <span className="text-[10px] text-neutral-slate font-bold uppercase">{t('result.chart.est')}</span>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-on-surface">{t('result.chart.foundation')}</span>
                </div>
                <span className="font-bold text-neutral-slate">{mongPercent.toFixed(1)}%</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-on-surface">{t('result.chart.body')}</span>
                </div>
                <span className="font-bold text-neutral-slate">{thanNhaPercent.toFixed(1)}%</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-neutral-slate"></span>
                  <span className="text-on-surface">{t('result.chart.roof')}</span>
                </div>
                <span className="font-bold text-neutral-slate">{maiKhacPercent.toFixed(1)}%</span>
              </li>
            </ul>
          </div>

          {/* Visual Reference Card */}
          <div className="relative h-64 w-full rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-primary/10">
            {/* 
              GHI CHÚ: THAY THẾ ẢNH BẢN VẼ / MINH HOẠ
              Khi bạn thiết kế xong hoặc có hình Render 3D công trình:
              - Copy ảnh vào public/assets/images/projects/ (VD: ban-ve-khach-hang.jpg)
              - Xoá url cũ trong src và đổi thành: src="/assets/images/projects/ban-ve-khach-hang.jpg"
            */}
            <img
              alt="Building architectural sketch"
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHgqGKT8yIor1UrnG6q6dZSqdXGz7orLf85aLr1g3RZPp36rIVoDSIrf4qmHbYr_MqltuGe2sNnMC2GiYLWvODA2Nd47AkqIBJwuWZaltCsh0lqEJpjj0z9HqBtOjOVVnSd1JDCTMm55n8zcdSm7efUuq-6OZNnH1hFeQxEU1pm89pPToXAm9wxnVE5qQBsdolWkkvbk806uhBSlqaPhRFx9xEHC_W0Rb_hqchqDBBicAE3XwA6sZYP2jMBb3TW62KVclqPQenigE"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end p-6">
              <p className="text-white font-medium italic text-sm">Phân tích kết cấu dựa trên bản vẽ kỹ thuật của MIND & SOLID.</p>
            </div>
          </div>
        </section>
        
        {/* Full width disclaimer */}
        <div className="col-span-12 mt-4">
          <div className="bg-surface-container-low border-l-4 border-secondary p-5 rounded-r-xl shadow-sm flex gap-4 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p className="text-sm md:text-base text-neutral-slate">
              <span className="font-bold text-on-surface">{t('result.disclaimer.title')}</span>{t('result.disclaimer.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
