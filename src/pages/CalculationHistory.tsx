import React from 'react';
import { FileText, Save, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CalculationHistory() {
  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem]">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface">Kết quả Dự toán</h1>
            <p className="text-on-surface-variant font-body-md mt-xs">Mã dự toán: #AL-2023-08-04 | Ngày tạo: 12/10/2023</p>
          </div>
          <div className="flex w-full md:w-auto gap-sm">
            <button className="flex-1 md:flex-none justify-center items-center gap-sm px-lg py-md border border-outline text-on-surface-variant font-bold rounded-lg hover:bg-surface-container-high transition-colors flex">
              <FileText size={20} />
              Xuất file PDF
            </button>
            <button className="flex-1 md:flex-none justify-center items-center gap-sm px-lg py-md bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity flex">
              <Save size={20} />
              Lưu dự toán
            </button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-12 gap-lg">
          {/* Summary Section */}
          <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-lg mb-sm">
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-center">
              <span className="font-label-caps text-on-surface-variant mb-xs uppercase text-[11px]">TỔNG DIỆN TÍCH QUY ĐỔI</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-h1 text-primary">342.50</span>
                <span className="font-h3 text-on-surface-variant">m2</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-center">
              <span className="font-label-caps text-on-surface-variant mb-xs uppercase text-[11px]">ĐƠN GIÁ ÁP DỤNG</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-h1 text-primary">6.800.000</span>
                <span className="font-h3 text-on-surface-variant">VNĐ/m2</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-center border-l-4 border-l-[#d36c2b]">
              <span className="font-label-caps text-on-surface-variant mb-xs uppercase text-[11px]">TỔNG CHI PHÍ DỰ KIẾN</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-h1 text-[#d36c2b]">2.329.000.000</span>
                <span className="font-h3 text-on-surface-variant">VNĐ</span>
              </div>
            </div>
          </section>

          {/* Detailed Table Section */}
          <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-h3 text-on-surface">Bảng chi tiết hạng mục</h2>
              <Info className="text-on-surface-variant" size={20} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container font-label-caps text-on-surface-variant uppercase text-[11px]">
                    <th className="p-md border-b border-outline-variant">Hạng mục</th>
                    <th className="p-md border-b border-outline-variant text-right">Diện tích (m2)</th>
                    <th className="p-md border-b border-outline-variant text-right">Hệ số (%)</th>
                    <th className="p-md border-b border-outline-variant text-right">Quy đổi (m2)</th>
                  </tr>
                </thead>
                <tbody className="text-body-md">
                  <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface">
                    <td className="p-md font-semibold text-on-surface">Phần Móng (Móng băng)</td>
                    <td className="p-md text-right">85.00</td>
                    <td className="p-md text-right text-on-surface-variant">50%</td>
                    <td className="p-md text-right font-bold text-primary text-primary-container">42.50</td>
                  </tr>
                  <tr className="border-b border-outline-variant bg-surface-container-low/30 hover:bg-surface-container-low transition-colors text-on-surface">
                    <td className="p-md font-semibold text-on-surface">Tầng Trệt (Thân nhà)</td>
                    <td className="p-md text-right">100.00</td>
                    <td className="p-md text-right text-on-surface-variant">100%</td>
                    <td className="p-md text-right font-bold text-primary text-primary-container">100.00</td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface">
                    <td className="p-md font-semibold text-on-surface">Lầu 1 (Thân nhà)</td>
                    <td className="p-md text-right">100.00</td>
                    <td className="p-md text-right text-on-surface-variant">100%</td>
                    <td className="p-md text-right font-bold text-primary text-primary-container">100.00</td>
                  </tr>
                  <tr className="border-b border-outline-variant bg-surface-container-low/30 hover:bg-surface-container-low transition-colors text-on-surface">
                    <td className="p-md font-semibold text-on-surface">Sân thượng (Khác)</td>
                    <td className="p-md text-right">100.00</td>
                    <td className="p-md text-right text-on-surface-variant">50%</td>
                    <td className="p-md text-right font-bold text-primary text-primary-container">50.00</td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface">
                    <td className="p-md font-semibold text-on-surface">Mái BTCT (Mái)</td>
                    <td className="p-md text-right">100.00</td>
                    <td className="p-md text-right text-on-surface-variant">50%</td>
                    <td className="p-md text-right font-bold text-primary text-primary-container">50.00</td>
                  </tr>
                </tbody>
                <tfoot className="bg-surface-container-low">
                  <tr className="font-bold">
                    <td className="p-md text-on-surface">Tổng cộng</td>
                    <td className="p-md text-right text-on-surface">485.00</td>
                    <td className="p-md text-right">-</td>
                    <td className="p-md text-right text-[#d36c2b]">342.50</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Visualization Section */}
          <section className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
            {/* Cost Distribution Chart */}
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
              <h2 className="font-h3 text-on-surface mb-lg">Phân bổ chi phí</h2>
              <div className="relative w-48 h-48 mx-auto mb-lg">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#eeedf0" strokeWidth="3.5"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#1a4460" strokeDasharray="12 88" strokeDashoffset="0" strokeWidth="3.5"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#3b6280" strokeDasharray="58 42" strokeDashoffset="-12" strokeWidth="3.5"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#d36c2b" strokeDasharray="15 85" strokeDashoffset="-70" strokeWidth="3.5"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#707d84" strokeDasharray="15 85" strokeDashoffset="-85" strokeWidth="3.5"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-h2 text-primary-container">100%</span>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">DỰ TOÁN</span>
                </div>
              </div>
              <ul className="space-y-sm">
                <li className="flex items-center justify-between text-body-md">
                  <div className="flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                    <span className="text-on-surface">Móng</span>
                  </div>
                  <span className="font-bold text-on-surface-variant">12.4%</span>
                </li>
                <li className="flex items-center justify-between text-body-md">
                  <div className="flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-surface-tint"></span>
                    <span className="text-on-surface">Thân nhà</span>
                  </div>
                  <span className="font-bold text-on-surface-variant">58.4%</span>
                </li>
                <li className="flex items-center justify-between text-body-md">
                  <div className="flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-[#d36c2b]"></span>
                    <span className="text-on-surface">Mái</span>
                  </div>
                  <span className="font-bold text-on-surface-variant">14.6%</span>
                </li>
                <li className="flex items-center justify-between text-body-md">
                  <div className="flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="text-on-surface">Khác</span>
                  </div>
                  <span className="font-bold text-on-surface-variant">14.6%</span>
                </li>
              </ul>
            </div>

            {/* Visual Reference Card */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-outline-variant shadow-sm hidden md:block">
              <img 
                alt="Building architectural sketch" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHgqGKT8yIor1UrnG6q6dZSqdXGz7orLf85aLr1g3RZPp36rIVoDSIrf4qmHbYr_MqltuGe2sNnMC2GiYLWvODA2Nd47AkqIBJwuWZaltCsh0lqEJpjj0z9HqBtOjOVVnSd1JDCTMm55n8zcdSm7efUuq-6OZNnH1hFeQxEU1pm89pPToXAm9wxnVE5qQBsdolWkkvbk806uhBSlqaPhRFx9xEHC_W0Rb_hqchqDBBicAE3XwA6sZYP2jMBb3TW62KVclqPQenigE" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-lg">
                <p className="text-white font-semibold italic text-body-md">Phân tích kết cấu dựa trên bản vẽ kỹ thuật được cung cấp.</p>
              </div>
            </div>
          </section>

          {/* Action Footer (Mobile Only) */}
          <section className="col-span-12 flex flex-col md:hidden gap-sm mt-md">
            <button className="w-full py-md bg-primary text-on-primary font-bold rounded-lg flex justify-center items-center gap-sm">
              <Save size={20} />
              Lưu kết quả
            </button>
            <button className="w-full py-md border border-outline text-on-surface-variant font-bold rounded-lg flex justify-center items-center gap-sm">
               <FileText size={20} />
              Tải PDF
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
