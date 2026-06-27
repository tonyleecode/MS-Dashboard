import React from 'react';
import { 
  ChevronRight, Download, Save, Package, Edit, 
  Calculator, TrendingUp, PlusSquare 
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function PriceManagement() {
  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem]">
      <div className="max-w-7xl mx-auto space-y-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
          <div>
            <nav className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm mb-sm">
              <span>Quản trị</span>
              <ChevronRight size={14} />
              <span className="text-primary-container font-medium">Đơn giá & Hệ số</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg text-primary-container">Quản lý Đơn giá & Hệ số</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Cập nhật đơn giá thi công và hệ số diện tích theo biến động thị trường.
            </p>
          </div>
          <div className="flex gap-md w-full md:w-auto">
            <button className="flex-1 md:flex-none justify-center items-center gap-sm px-lg py-md border border-outline text-on-surface-variant font-label-bold text-label-bold rounded-xl hover:bg-surface-container-high transition-colors flex">
              <Download size={18} />
              Xuất Excel
            </button>
            <button className="flex-1 md:flex-none justify-center items-center gap-sm px-lg py-md bg-accent text-on-primary font-label-bold text-label-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm flex">
              <Save size={18} />
              Lưu thay đổi
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-xl">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-lg border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container-low gap-md">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary-container flex items-center gap-sm">
                  <Package className="text-primary-container" size={24} />
                  Đơn giá thi công trọn gói
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                  Bảng giá áp dụng cho các gói thầu thi công phần thô và hoàn thiện.
                </p>
              </div>
              <div className="flex gap-sm">
                <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-lg font-label-bold text-[10px] uppercase">
                  CẬP NHẬT: 20/10/2023
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-high text-on-surface-variant border-b border-outline-variant">
                    <th className="p-md font-label-bold text-label-bold">Mã Gói</th>
                    <th className="p-md font-label-bold text-label-bold">Tên Gói Dịch Vụ</th>
                    <th className="p-md font-label-bold text-label-bold">Đơn vị</th>
                    <th className="p-md font-label-bold text-label-bold text-right">Đơn giá (VNĐ)</th>
                    <th className="p-md font-label-bold text-label-bold">Ghi chú</th>
                    <th className="p-md font-label-bold text-label-bold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-body-md text-body-md text-on-surface">PKG-001</td>
                    <td className="p-md font-body-md text-body-md font-semibold text-on-surface">Gói thi công phần thô - Nhà phố</td>
                    <td className="p-md font-body-md text-body-md text-on-surface-variant">m2</td>
                    <td className="p-md text-right">
                      <input 
                        type="text" 
                        defaultValue="3,650,000" 
                        className="w-40 text-right bg-surface-container-lowest border border-primary-container px-sm py-xs rounded-lg font-body-md focus:ring-2 focus:ring-primary-container outline-none text-on-surface" 
                      />
                    </td>
                    <td className="p-md font-body-md text-body-md text-on-surface-variant italic">Bao gồm vật tư và nhân công</td>
                    <td className="p-md text-center">
                      <button className="text-primary-container hover:bg-surface-container-high p-xs rounded-full transition-colors flex items-center justify-center mx-auto">
                        <Edit size={20} />
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-surface-container-low/20 hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-body-md text-body-md text-on-surface">PKG-002</td>
                    <td className="p-md font-body-md text-body-md font-semibold text-on-surface">Gói hoàn thiện - Tiêu chuẩn</td>
                    <td className="p-md font-body-md text-body-md text-on-surface-variant">m2</td>
                    <td className="p-md text-right">
                      <input 
                        type="text" 
                        defaultValue="2,400,000" 
                        className="w-40 text-right bg-transparent border border-transparent hover:border-outline-variant px-sm py-xs rounded-lg font-body-md outline-none text-on-surface" 
                      />
                    </td>
                    <td className="p-md font-body-md text-body-md text-on-surface-variant italic">Vật liệu loại A1</td>
                    <td className="p-md text-center">
                      <button className="text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full transition-colors flex items-center justify-center mx-auto">
                        <Edit size={20} />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-body-md text-body-md text-on-surface">PKG-003</td>
                    <td className="p-md font-body-md text-body-md font-semibold text-on-surface">Gói hoàn thiện - Cao cấp</td>
                    <td className="p-md font-body-md text-body-md text-on-surface-variant">m2</td>
                    <td className="p-md text-right text-primary-container">
                      <input 
                        type="text" 
                        defaultValue="4,850,000" 
                        className="w-40 text-right bg-transparent border border-transparent hover:border-outline-variant px-sm py-xs rounded-lg font-body-md outline-none text-primary-container font-semibold" 
                      />
                    </td>
                    <td className="p-md font-body-md text-body-md text-on-surface-variant italic">Vật liệu nhập khẩu Châu Âu</td>
                    <td className="p-md text-center">
                      <button className="text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full transition-colors flex items-center justify-center mx-auto">
                        <Edit size={20} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-lg border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary-container flex items-center gap-sm">
                  <Calculator className="text-primary-container" size={24} />
                  Hệ số diện tích (Coefficients)
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                  Tỷ lệ phần trăm tính diện tích cho các hạng mục đặc thù.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-surface-container-high text-on-surface-variant border-b border-outline-variant">
                      <th className="p-md font-label-bold text-label-bold">Hạng mục</th>
                      <th className="p-md font-label-bold text-label-bold">Mô tả chi tiết</th>
                      <th className="p-md font-label-bold text-label-bold text-right">Hệ số (%)</th>
                      <th className="p-md font-label-bold text-label-bold text-center">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-md font-body-md text-body-md font-bold text-on-surface">Tầng hầm</td>
                      <td className="p-md font-body-md text-body-md text-on-surface-variant">Sâu 1.0m - 1.5m so với vỉa hè</td>
                      <td className="p-md text-right">
                        <input 
                          type="text" 
                          defaultValue="150" 
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-sm py-xs rounded-lg font-body-md outline-none text-on-surface" 
                        />
                      </td>
                      <td className="p-md text-center">
                        <span className="bg-surface-container text-primary-container px-sm py-xs rounded-full font-label-bold text-[10px] uppercase">ĐANG ÁP DỤNG</span>
                      </td>
                    </tr>
                    <tr className="bg-surface-container-low/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-md font-body-md text-body-md font-bold text-on-surface">Mái bê tông cốt thép</td>
                      <td className="p-md font-body-md text-body-md text-on-surface-variant">Không lát gạch, có xử lý chống thấm</td>
                      <td className="p-md text-right">
                        <input 
                          type="text" 
                          defaultValue="50" 
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-sm py-xs rounded-lg font-body-md outline-none text-on-surface" 
                        />
                      </td>
                      <td className="p-md text-center">
                        <span className="bg-surface-container text-primary-container px-sm py-xs rounded-full font-label-bold text-[10px] uppercase">ĐANG ÁP DỤNG</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-md font-body-md text-body-md font-bold text-on-surface">Sân thượng</td>
                      <td className="p-md font-body-md text-body-md text-on-surface-variant">Có dàn lam trang trí bê tông</td>
                      <td className="p-md text-right">
                        <input 
                          type="text" 
                          defaultValue="70" 
                          className="w-20 text-right bg-transparent border border-transparent hover:border-outline-variant px-sm py-xs rounded-lg font-body-md outline-none text-on-surface" 
                        />
                      </td>
                      <td className="p-md text-center">
                        <span className="bg-surface-container text-primary-container px-sm py-xs rounded-full font-label-bold text-[10px] uppercase">ĐANG ÁP DỤNG</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-lg">
              <div className="bg-primary-container text-on-primary p-lg rounded-xl shadow-lg relative overflow-hidden h-fit">
                <div className="relative z-10">
                  <h4 className="font-headline-md text-headline-md mb-sm text-on-primary">Gợi ý thị trường</h4>
                  <p className="font-body-md text-body-md opacity-80 mb-md text-on-primary">
                    Giá vật tư xây dựng quý IV/2023 dự kiến tăng 5-8% do biến động giá thép.
                  </p>
                  <button className="bg-surface-container-lowest text-primary-container font-label-bold text-label-bold px-md py-sm rounded-lg border border-transparent hover:bg-surface-container-high transition-colors shadow-sm">
                    Xem báo cáo chi tiết
                  </button>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12">
                  <TrendingUp size={120} />
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
                <h4 className="font-label-bold text-label-bold text-on-surface-variant mb-md border-b border-outline-variant pb-xs uppercase">
                  Lịch sử thay đổi
                </h4>
                <ul className="space-y-md mt-sm">
                  <li className="flex gap-sm">
                    <div className="w-1 bg-accent rounded-full shrink-0"></div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">Cập nhật đơn giá Gói Thô</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Bởi Admin - 15/10/2023</p>
                    </div>
                  </li>
                  <li className="flex gap-sm">
                    <div className="w-1 bg-secondary rounded-full shrink-0"></div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">Chỉnh sửa hệ số Mái</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Bởi Quản lý - 10/10/2023</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-surface-container-low p-xl rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center gap-md min-h-[200px] mb-lg">
          <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center">
            <PlusSquare className="text-primary-container" size={24} />
          </div>
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface">Thêm hạng mục mới</h4>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Bạn có thể thêm gói dịch vụ hoặc hệ số mới vào hệ thống quản lý.
            </p>
          </div>
          <div className="flex gap-md mt-sm">
            <button className="px-lg py-sm bg-surface-container-lowest border border-primary-container text-primary-container font-label-bold text-label-bold rounded-xl hover:bg-primary-container hover:text-on-primary transition-all">
              Thêm Hệ số
            </button>
            <button className="px-lg py-sm bg-surface-container-lowest border border-primary-container text-primary-container font-label-bold text-label-bold rounded-xl hover:bg-primary-container hover:text-on-primary transition-all">
              Thêm Gói Thầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
