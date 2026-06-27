import React, { useRef } from 'react';
import { Download, Save, Package, Calculator, TrendingUp, Upload } from 'lucide-react';
import { useEstimation } from '../context/EstimationContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import * as XLSX from 'xlsx';

export const PriceManagement: React.FC = () => {
  const { prices, setPrices, coefficients, setCoefficients, saveSettings } = useEstimation();
  const { isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useSettings();

  const handlePriceChange = (field: keyof typeof prices, value: string) => {
    // strip commas and dots
    const cleanedValue = value.replace(/\D/g, '');
    const num = parseInt(cleanedValue, 10);
    if (!isNaN(num)) {
      setPrices((prev) => ({ ...prev, [field]: num }));
    } else if (cleanedValue === '') {
      setPrices((prev) => ({ ...prev, [field]: 0 }));
    }
  };

  const handleCoeffBasementChange = (field: keyof typeof coefficients.basement, value: number) => {
    setCoefficients((prev) => ({
      ...prev,
      basement: { ...prev.basement, [field]: value },
    }));
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN');
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Dữ liệu đơn giá
    const pricesData = [
      { 'Mã Gói': 'PKG-001', 'Tên Gói Dịch Vụ': 'Gói thi công phần thô', 'Đơn vị': 'm2', 'Đơn giá (VNĐ)': prices.tho },
      { 'Mã Gói': 'PKG-002', 'Tên Gói Dịch Vụ': 'Gói hoàn thiện - Tiêu chuẩn', 'Đơn vị': 'm2', 'Đơn giá (VNĐ)': prices.tieuchuan },
      { 'Mã Gói': 'PKG-003', 'Tên Gói Dịch Vụ': 'Gói hoàn thiện - Khá', 'Đơn vị': 'm2', 'Đơn giá (VNĐ)': prices.kha },
      { 'Mã Gói': 'PKG-004', 'Tên Gói Dịch Vụ': 'Gói hoàn thiện - Cao cấp', 'Đơn vị': 'm2', 'Đơn giá (VNĐ)': prices.caocap },
    ];
    const wsPrices = XLSX.utils.json_to_sheet(pricesData);
    XLSX.utils.book_append_sheet(wb, wsPrices, 'Đơn giá thi công');

    // Dữ liệu hệ số
    const coeffData = [
      { 'Hạng mục': 'Tầng hầm (Nông)', 'Mô tả': 'Sâu < 1.3m so với vỉa hè', 'Hệ số (%)': coefficients.basement.shallow },
      { 'Hạng mục': 'Tầng hầm (Vừa)', 'Mô tả': 'Sâu 1.3m - 1.7m so với vỉa hè', 'Hệ số (%)': coefficients.basement.medium },
      { 'Hạng mục': 'Mái tôn', 'Mô tả': 'Mái lợp tôn cơ bản', 'Hệ số (%)': coefficients.roof.ton },
      { 'Hạng mục': 'Sân thượng', 'Mô tả': 'Có dàn lam trang trí bê tông', 'Hệ số (%)': coefficients.roofTerrace },
    ];
    const wsCoeff = XLSX.utils.json_to_sheet(coeffData);
    XLSX.utils.book_append_sheet(wb, wsCoeff, 'Hệ số diện tích');

    XLSX.writeFile(wb, 'QuanLyDonGia_MS.xlsx');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        // Đọc Đơn giá thi công
        const wsPrices = wb.Sheets['Đơn giá thi công'];
        if (wsPrices) {
          const pricesData: any[] = XLSX.utils.sheet_to_json(wsPrices);
          const newPrices = { ...prices };
          pricesData.forEach(row => {
            const val = parseFloat(row['Đơn giá (VNĐ)']);
            if (!isNaN(val)) {
              if (row['Mã Gói'] === 'PKG-001') newPrices.tho = val;
              else if (row['Mã Gói'] === 'PKG-002') newPrices.tieuchuan = val;
              else if (row['Mã Gói'] === 'PKG-003') newPrices.kha = val;
              else if (row['Mã Gói'] === 'PKG-004') newPrices.caocap = val;
            }
          });
          setPrices(newPrices);
        }

        // Đọc Hệ số diện tích
        const wsCoeff = wb.Sheets['Hệ số diện tích'];
        if (wsCoeff) {
          const coeffData: any[] = XLSX.utils.sheet_to_json(wsCoeff);
          const newCoeff = { ...coefficients, basement: { ...coefficients.basement }, roof: { ...coefficients.roof } };
          coeffData.forEach(row => {
            const val = parseFloat(row['Hệ số (%)']);
            if (!isNaN(val)) {
              if (row['Hạng mục'] === 'Tầng hầm (Nông)') newCoeff.basement.shallow = val;
              else if (row['Hạng mục'] === 'Tầng hầm (Vừa)') newCoeff.basement.medium = val;
              else if (row['Hạng mục'] === 'Mái tôn') newCoeff.roof.ton = val;
              else if (row['Hạng mục'] === 'Sân thượng') newCoeff.roofTerrace = val;
            }
          });
          setCoefficients(newCoeff);
        }
        
        alert(t('pricing.upload.success'));
      } catch (error) {
        console.error("Lỗi khi đọc file Excel: ", error);
        alert(t('pricing.upload.error'));
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <nav className="flex items-center gap-2 text-neutral-slate text-xs font-medium mb-2">
            <span>{isAdmin ? 'Quản trị' : 'Tham khảo'}</span>
            <span>/</span>
            <span className="text-primary font-semibold">{t('pricing.title')}</span>
          </nav>
          <h1 className="font-h1 text-3xl text-primary font-bold uppercase tracking-tight">{isAdmin ? t('pricing.adminTitle') : t('pricing.title')}</h1>
          <p className="text-neutral-slate mt-2">{t('pricing.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {isAdmin && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".xlsx, .xls" 
                className="hidden" 
              />
              <button 
                onClick={handleImportClick}
                className="flex items-center gap-2 px-6 py-3 border border-outline text-neutral-slate font-bold text-xs uppercase rounded-lg hover:bg-surface-container-high transition-colors"
                title={t('pricing.upload')}
              >
                <Upload className="w-5 h-5" />
                Excel
              </button>
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-6 py-3 border border-outline text-neutral-slate font-bold text-xs uppercase rounded-lg hover:bg-surface-container-high transition-colors"
              >
                <Download className="w-5 h-5" />
                Xuất Excel
              </button>
              <button 
                onClick={saveSettings}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-xs uppercase rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                <Save className="w-5 h-5" />
                {t('pricing.save')}
              </button>
            </>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-8">
        {/* Đơn giá thi công trọn gói */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div>
              <h3 className="font-h3 text-lg text-primary font-bold flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t('pricing.unitPrice.title')}
              </h3>
            </div>
            <div>
              <span className="bg-tertiary-container text-white px-3 py-1 rounded font-bold text-[10px] tracking-wider">{t('pricing.updated')} {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container text-primary border-b border-outline-variant">
                  <th className="p-4 font-label-caps text-[11px] font-bold uppercase tracking-wider">{t('pricing.table.code')}</th>
                  <th className="p-4 font-label-caps text-[11px] font-bold uppercase tracking-wider">{t('pricing.table.name')}</th>
                  <th className="p-4 font-label-caps text-[11px] font-bold uppercase tracking-wider">{t('pricing.table.unit')}</th>
                  <th className="p-4 font-label-caps text-[11px] font-bold uppercase tracking-wider text-right">{t('pricing.table.price')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-xs font-data-tabular">PKG-001</td>
                  <td className="p-4 text-sm font-semibold text-primary">{t('tool.packageType.tho')}</td>
                  <td className="p-4 text-sm text-neutral-slate">m2</td>
                  <td className="p-4 text-right">
                    {isAdmin ? (
                      <input
                        type="text"
                        className="w-32 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                        value={formatCurrency(prices.tho)}
                        onChange={(e) => handlePriceChange('tho', e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-primary font-data-tabular px-2 py-1">{formatCurrency(prices.tho)}</span>
                    )}
                  </td>
                </tr>
                <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-xs font-data-tabular">PKG-002</td>
                  <td className="p-4 text-sm font-semibold text-primary">{t('tool.packageLevel.tieuchuan')}</td>
                  <td className="p-4 text-sm text-neutral-slate">m2</td>
                  <td className="p-4 text-right">
                    {isAdmin ? (
                      <input
                        type="text"
                        className="w-32 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                        value={formatCurrency(prices.tieuchuan)}
                        onChange={(e) => handlePriceChange('tieuchuan', e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-primary font-data-tabular px-2 py-1">{formatCurrency(prices.tieuchuan)}</span>
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-xs font-data-tabular">PKG-003</td>
                  <td className="p-4 text-sm font-semibold text-primary">{t('tool.packageLevel.kha')}</td>
                  <td className="p-4 text-sm text-neutral-slate">m2</td>
                  <td className="p-4 text-right">
                    {isAdmin ? (
                      <input
                        type="text"
                        className="w-32 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                        value={formatCurrency(prices.kha)}
                        onChange={(e) => handlePriceChange('kha', e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-primary font-data-tabular px-2 py-1">{formatCurrency(prices.kha)}</span>
                    )}
                  </td>
                </tr>
                <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-xs font-data-tabular">PKG-004</td>
                  <td className="p-4 text-sm font-semibold text-primary">{t('tool.packageLevel.caocap')}</td>
                  <td className="p-4 text-sm text-neutral-slate">m2</td>
                  <td className="p-4 text-right">
                    {isAdmin ? (
                      <input
                        type="text"
                        className="w-32 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                        value={formatCurrency(prices.caocap)}
                        onChange={(e) => handlePriceChange('caocap', e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-primary font-data-tabular px-2 py-1">{formatCurrency(prices.caocap)}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hệ số diện tích */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm h-fit">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-h3 text-lg text-primary font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                {t('pricing.coeff.title')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="bg-surface-container text-primary border-b border-outline-variant">
                    <th className="p-4 font-label-caps text-[11px] font-bold uppercase tracking-wider">{t('pricing.coeff.type')}</th>
                    <th className="p-4 font-label-caps text-[11px] font-bold uppercase tracking-wider text-right">{t('pricing.coeff.value')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-sm font-semibold text-primary">{t('tool.basement.shallow')}</td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <input
                          type="number"
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                          value={coefficients.basement.shallow}
                          onChange={(e) => handleCoeffBasementChange('shallow', parseFloat(e.target.value) || 0)}
                        />
                      ) : (
                        <span className="font-bold text-primary font-data-tabular px-2 py-1">{coefficients.basement.shallow}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-sm font-semibold text-primary">{t('tool.basement.medium')}</td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <input
                          type="number"
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                          value={coefficients.basement.medium}
                          onChange={(e) => handleCoeffBasementChange('medium', parseFloat(e.target.value) || 0)}
                        />
                      ) : (
                        <span className="font-bold text-primary font-data-tabular px-2 py-1">{coefficients.basement.medium}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-sm font-semibold text-primary">{t('tool.roof.ton')}</td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <input
                          type="number"
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                          value={coefficients.roof.ton}
                          onChange={(e) => setCoefficients(p => ({ ...p, roof: { ...p.roof, ton: parseFloat(e.target.value) || 0 } }))}
                        />
                      ) : (
                        <span className="font-bold text-primary font-data-tabular px-2 py-1">{coefficients.roof.ton}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors">
                    <td className="p-4 text-sm font-semibold text-primary">{t('tool.roof.terrace')}</td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                        <input
                          type="number"
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-2 py-1 rounded font-bold text-primary outline-none focus:ring-2 focus:ring-primary font-data-tabular"
                          value={coefficients.roofTerrace}
                          onChange={(e) => setCoefficients(p => ({ ...p, roofTerrace: parseFloat(e.target.value) || 0 }))}
                        />
                      ) : (
                        <span className="font-bold text-primary font-data-tabular px-2 py-1">{coefficients.roofTerrace}</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden h-fit">
              <div className="relative z-10">
                <h4 className="font-h3 text-lg mb-2 font-bold uppercase tracking-tight">{t('pricing.market.title')}</h4>
                <p className="text-sm opacity-80 mb-4 leading-relaxed">{t('pricing.market.desc')}</p>
                <button className="bg-secondary text-white font-bold text-[11px] uppercase px-4 py-2 rounded hover:brightness-110 transition-all shadow-sm">
                  {t('pricing.market.btn')}
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12">
                <TrendingUp className="w-32 h-32" />
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
              <h4 className="font-label-caps text-[11px] font-bold text-primary uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">{t('pricing.history.title')}</h4>
              <ul className="space-y-4">
                <li className="flex gap-2">
                  <div className="w-1 bg-secondary rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{t('pricing.history.item1.title')}</p>
                    <p className="text-[11px] text-neutral-slate">{t('pricing.history.item1.desc')} {new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="w-1 bg-neutral-slate/30 rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{t('pricing.history.item2.title')}</p>
                    <p className="text-[11px] text-neutral-slate">{t('pricing.history.item2.desc')} {new Date(Date.now() - 86400000 * 2).toLocaleDateString('vi-VN')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Disclaimer Note */}
        <div className="mt-8 bg-surface-container-low border-l-4 border-primary p-4 rounded-r-lg">
          <p className="text-sm text-neutral-slate italic">
            <span className="font-bold text-primary not-italic">{t('pricing.notice.title')}</span>{t('pricing.notice.desc')}
          </p>
        </div>
      </section>
    </div>
  );
};
