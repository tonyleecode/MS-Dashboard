import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Landmark, FileText, 
  ArrowUpRight, ArrowDownRight, ClipboardList, Wallet, Plus, Info
} from 'lucide-react';

export default function FinancialManagement() {
  const [payments, setPayments] = useState([
    { id: 1, desc: 'Đợt 1: Tạm ứng ký hợp đồng (15%)', amount: 286665900, date: '01/04/2024', status: 'collected', payer: 'Bà Bùi Thị Thanh Hương' },
    { id: 2, desc: 'Đợt 2: Nghiệm thu hoàn thành Móng (15%)', amount: 286665900, date: '26/04/2024', status: 'collected', payer: 'Bà Bùi Thị Thanh Hương' },
    { id: 3, desc: 'Đợt 3: Nghiệm thu đổ bê tông sàn trệt (15%)', amount: 286665900, date: '16/05/2024', status: 'collected', payer: 'Bà Bùi Thị Thanh Hương' },
    { id: 4, desc: 'Đợt 4: Nghiệm thu sàn lầu 1 (15%)', amount: 286665900, date: '12/06/2024', status: 'collected', payer: 'Bà Bùi Thị Thanh Hương' },
    { id: 5, desc: 'Đợt 5: Nghiệm thu hoàn thiện xây thô (15%)', amount: 286665900, date: 'Dự kiến: 10/07/2024', status: 'pending', payer: 'Bà Bùi Thị Thanh Hương' },
    { id: 6, desc: 'Đợt 6: Bàn giao chìa khóa trao tay (25%)', amount: 477776500, date: 'Dự kiến: 15/09/2024', status: 'pending', payer: 'Bà Bùi Thị Thanh Hương' }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 101, desc: 'Tạm ứng mua thép Pomina làm móng', amount: 145000000, date: '02/04/2024', category: 'Vật tư thô', payee: 'Đại lý thép Kiên Giang' },
    { id: 102, desc: 'Thanh toán tiền ép cọc móng bê tông', amount: 82000000, date: '08/04/2024', category: 'Nhân công phụ', payee: 'Đội ép cọc Hòn Đất' },
    { id: 103, desc: 'Trả lương công nhân thi công đợt 1', amount: 24950000, date: '10/04/2024', category: 'Lương nhân sự', payee: 'Đội thợ A Lâm' },
    { id: 104, desc: 'Mua bê tông tươi đổ móng (Mác 250)', amount: 78400000, date: '25/04/2024', category: 'Vật tư thô', payee: 'Bê tông Kiên Giang' },
    { id: 105, desc: 'Mua gạch ống Tuynel Hòn Đất', amount: 32000000, date: '05/05/2024', category: 'Vật tư thô', payee: 'Nhà máy gạch Hòn Đất' },
    { id: 106, desc: 'Mua thiết bị vệ sinh Rolls (Lavabo, vòi)', amount: 15200000, date: '18/05/2024', category: 'Thiết bị', payee: 'Showroom Rolls Rạch Giá' },
    { id: 107, desc: 'Mua sơn Nippon (Bột trét & Sơn lót)', amount: 45600000, date: '10/06/2024', category: 'Vật tư hoàn thiện', payee: 'Đại lý sơn Nippon Kiên Giang' },
  ]);

  const totalCollected = payments
    .filter(p => p.status === 'collected')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalContractValue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const cashOnHand = totalCollected - totalSpent;

  const profitMargin = ((totalContractValue - (totalSpent * 1.4)) / totalContractValue) * 100; // Mock estimate for total budget profit

  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem] space-y-lg">
      <div className="max-w-7xl mx-auto space-y-lg">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="text-h1 text-primary-container mb-xs">Kế Toán & Quản Lý Dòng Tiền</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Thống kê thu chi, theo dõi tiến độ thanh toán hợp đồng và lợi nhuận dòng tiền các công trình của MS.
            </p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={() => alert('Thêm giao dịch thu chi mới!')}
              className="px-lg py-md bg-accent text-white font-bold rounded-xl flex items-center gap-xs shadow-sm hover:opacity-90"
            >
              <Plus size={18} />
              Ghi nhận thu/chi
            </button>
            <button 
              onClick={() => alert('Xuất báo cáo tài chính dự án!')}
              className="px-lg py-md border border-outline text-on-surface-variant font-bold rounded-xl flex items-center gap-xs hover:bg-surface-container"
            >
              <FileText size={18} />
              Xuất báo cáo tài chính
            </button>
          </div>
        </div>

        {/* Ledger Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
            <span className="text-label-caps text-on-surface-variant text-[11px] block">Doanh Thu Đã Thu (Đợt 1-4)</span>
            <div className="flex items-baseline gap-xs mt-xs text-primary-container">
              <span className="text-h1 font-extrabold">{totalCollected.toLocaleString('vi-VN')}</span>
              <span className="text-h3 text-on-surface-variant">đ</span>
            </div>
            <span className="text-label-sm text-green-700 font-bold flex items-center gap-2px mt-sm">
              <ArrowUpRight size={14} /> 60% Giá trị HĐ
            </span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
            <span className="text-label-caps text-on-surface-variant text-[11px] block">Tổng Chi Phí Đã Chi</span>
            <div className="flex items-baseline gap-xs mt-xs text-[#ba1a1a]">
              <span className="text-h1 font-extrabold">{totalSpent.toLocaleString('vi-VN')}</span>
              <span className="text-h3 text-on-surface-variant">đ</span>
            </div>
            <span className="text-label-sm text-[#ba1a1a] font-bold flex items-center gap-2px mt-sm">
              <ArrowDownRight size={14} /> Vật tư & Nhân sự thô
            </span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
            <span className="text-label-caps text-on-surface-variant text-[11px] block">Số Dư Quỹ Dự Án</span>
            <div className="flex items-baseline gap-xs mt-xs text-[#d36c2b]">
              <span className="text-h1 font-extrabold">{cashOnHand.toLocaleString('vi-VN')}</span>
              <span className="text-h3 text-on-surface-variant">đ</span>
            </div>
            <span className="text-label-sm text-[#d36c2b] font-bold flex items-center gap-2px mt-sm">
              <Landmark size={14} /> Tiền khả dụng tại quỹ
            </span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm">
            <span className="text-label-caps text-on-surface-variant text-[11px] block">Biên Lợi Nhuận Dự Kiến</span>
            <div className="flex items-baseline gap-xs mt-xs text-primary-container">
              <span className="text-h1 font-extrabold">{profitMargin.toFixed(1)}%</span>
              <span className="text-h3 text-on-surface-variant">lợi nhuận</span>
            </div>
            <span className="text-label-sm text-green-700 font-bold flex items-center gap-2px mt-sm">
              <TrendingUp size={14} /> Tối ưu thiết kế thực tế
            </span>
          </div>
        </div>

        {/* Detailed Breakdown for Mrs. Huong Project */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Revenue Installments (Bên Thu - Chủ nhà thanh toán) */}
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-h3 text-primary-container">Nguồn Thu: Tiến Độ Thanh Toán Hợp Đồng</h3>
              <span className="bg-green-100 text-green-800 text-[10px] px-sm py-xs rounded font-bold">Hợp đồng Chị Hương</span>
            </div>
            <div className="p-md space-y-md">
              <div className="text-label-sm text-on-surface-variant flex justify-between">
                <span>Tổng giá trị HĐ: <strong>{totalContractValue.toLocaleString('vi-VN')} đ</strong></span>
                <span>Đã thu: <strong className="text-green-700">{totalCollected.toLocaleString('vi-VN')} đ</strong></span>
              </div>
              <ul className="divide-y divide-outline-variant/40">
                {payments.map(p => (
                  <li key={p.id} className="py-md flex justify-between items-center text-body-md">
                    <div>
                      <div className="font-semibold text-on-surface">{p.desc}</div>
                      <div className="text-label-sm text-on-surface-variant">Hạn thu: {p.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-container">{p.amount.toLocaleString('vi-VN')} đ</div>
                      <span className={cn(
                        "text-[9px] px-sm py-2px rounded font-bold uppercase tracking-wider",
                        p.status === 'collected' ? "bg-green-100 text-green-800" : "bg-surface-container-high text-on-surface-variant"
                      )}>
                        {p.status === 'collected' ? 'Đã thu quỹ' : 'Chưa đến hạn'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expenses Log (Bên Chi - Chi phí vật tư & thợ) */}
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-h3 text-primary-container">Nguồn Chi: Nhật Ký Mua Vật Tư & Nhân Công</h3>
              <span className="bg-[#ffebe0] text-[#d36c2b] text-[10px] px-sm py-xs rounded font-bold">Thực tế chi</span>
            </div>
            <div className="p-md space-y-md">
              <div className="text-label-sm text-on-surface-variant flex justify-between">
                <span>Dự toán thô tối đa: <strong>1.434.747.949 đ</strong></span>
                <span>Thực tế đã chi: <strong className="text-[#ba1a1a]">{totalSpent.toLocaleString('vi-VN')} đ</strong></span>
              </div>
              <div className="overflow-y-auto max-h-[360px] divide-y divide-outline-variant/40 pr-xs">
                {expenses.map(e => (
                  <div key={e.id} className="py-md flex justify-between items-center text-body-md">
                    <div>
                      <div className="font-semibold text-on-surface">{e.desc}</div>
                      <div className="text-label-sm text-on-surface-variant">Ngày: {e.date} | Người nhận: {e.payee}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#ba1a1a]">{e.amount.toLocaleString('vi-VN')} đ</div>
                      <span className="bg-surface-container-high text-on-surface-variant text-[9px] px-sm py-2px rounded-full font-semibold">
                        {e.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health Analysis Info */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex items-start gap-md">
          <Info className="text-primary-container shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-h3 text-primary-container font-bold">Nhận xét của Bộ phận Kế toán MS</h4>
            <p className="text-body-md text-on-surface-variant mt-xs">
              Dự án Nhà chị Hương có dòng tiền dương ổn định do tiến độ thu quỹ tốt (Đợt 4 vừa nghiệm thu xong sàn lầu 1). Chi phí thực tế cho phần sắt thép móng và gạch xây nằm trong khung ngân sách dự toán, đảm bảo biên lợi nhuận ròng trên 30% đúng cam kết hoạt động tối ưu.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
