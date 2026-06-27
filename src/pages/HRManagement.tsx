import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, FileSpreadsheet, Calendar, Search, 
  CheckCircle, Edit2, Check, X, Award, DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Worker {
  id: number;
  name: string;
  role: 'ĐT' | 'Thợ' | 'Phụ';
  roleName: string;
  note: string;
  dailyRate: number;
  attendance: { [day: number]: 'x' | 'h' | '' }; // x = full day, h = half day, '' = absent
  overtime: { [day: number]: number }; // hours of overtime
}

const initialWorkers: Worker[] = [
  {
    id: 1,
    name: 'A Lâm',
    role: 'ĐT',
    roleName: 'Đội trưởng / Kỹ thuật chính',
    note: 'Kinh nghiệm giám sát móng cốt thép',
    dailyRate: 550000,
    attendance: { 1: 'x', 2: 'x', 3: 'x', 4: 'x', 5: 'x', 6: 'x', 7: 'h', 8: 'x', 9: 'x', 10: 'x' },
    overtime: { 1: 2, 2: 0, 3: 0, 4: 1, 5: 0, 6: 0, 7: 0, 8: 2, 9: 0, 10: 0 }
  },
  {
    id: 2,
    name: 'Nguyễn Tấn Tài',
    role: 'Thợ',
    roleName: 'Thợ xây tô chính',
    note: 'Có CCCD gửi cty Hưng Long',
    dailyRate: 380000,
    attendance: { 1: 'x', 2: 'x', 3: 'x', 4: 'x', 5: 'x', 6: 'x', 7: '', 8: 'x', 9: 'x', 10: 'x' },
    overtime: { 1: 0, 2: 2, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 1, 10: 0 }
  },
  {
    id: 3,
    name: 'Nguyễn Tấn Hùng',
    role: 'Thợ',
    roleName: 'Thợ xây tô',
    note: 'Chuyên mạch vữa đứng và mác vữa',
    dailyRate: 360000,
    attendance: { 1: '', 2: 'x', 3: 'x', 4: '', 5: 'x', 6: 'x', 7: '', 8: 'x', 9: 'x', 10: 'h' },
    overtime: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
  },
  {
    id: 4,
    name: 'Lê Văn Tám',
    role: 'Phụ',
    roleName: 'Phụ hồ / Trộn bê tông',
    note: 'Khu vực Kiên Giang',
    dailyRate: 280000,
    attendance: { 1: 'x', 2: 'x', 3: 'x', 4: 'x', 5: 'x', 6: 'h', 7: '', 8: 'x', 9: 'x', 10: 'x' },
    overtime: { 1: 2, 2: 2, 3: 1, 4: 0, 5: 0, 6: 0, 7: 0, 8: 2, 9: 0, 10: 0 }
  },
  {
    id: 5,
    name: 'Phan Thanh Sơn',
    role: 'Phụ',
    roleName: 'Phụ hồ / Vận chuyển vật tư',
    note: 'Nhanh nhẹn, cẩn thận',
    dailyRate: 270000,
    attendance: { 1: 'x', 2: 'h', 3: 'x', 4: 'x', 5: '', 6: 'x', 7: '', 8: 'x', 9: 'h', 10: 'x' },
    overtime: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
  }
];

export default function HRManagement() {
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('ms_workers');
    return saved ? JSON.parse(saved) : initialWorkers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', role: 'Thợ', note: '', dailyRate: 350000 });
  const [selectedMonthRange, setSelectedMonthRange] = useState('2-10.T9/2026');

  useEffect(() => {
    localStorage.setItem('ms_workers', JSON.stringify(workers));
  }, [workers]);

  const handleAttendanceChange = (workerId: number, day: number, type: 'x' | 'h' | '') => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          attendance: { ...w.attendance, [day]: type }
        };
      }
      return w;
    }));
  };

  const handleOvertimeChange = (workerId: number, day: number, hours: number) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          overtime: { ...w.overtime, [day]: hours }
        };
      }
      return w;
    }));
  };

  const calculateSalary = (worker: Worker) => {
    let fullDays = 0;
    let halfDays = 0;
    let totalOtHours = 0;

    Object.keys(worker.attendance).forEach(d => {
      const day = parseInt(d);
      if (worker.attendance[day] === 'x') fullDays += 1;
      else if (worker.attendance[day] === 'h') halfDays += 1;
      
      const ot = worker.overtime[day] || 0;
      totalOtHours += ot;
    });

    const totalDays = fullDays + (halfDays * 0.5);
    // Overtime pay rate is 1.5x regular hourly wage (assuming 8 hours per day)
    const hourlyRate = worker.dailyRate / 8;
    const otPay = totalOtHours * hourlyRate * 1.5;
    const basePay = totalDays * worker.dailyRate;
    const totalSalary = basePay + otPay;

    return {
      fullDays,
      halfDays,
      totalDays,
      totalOtHours,
      basePay,
      otPay,
      totalSalary
    };
  };

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name) return;

    const roleMap: any = { 'ĐT': 'Đội trưởng / Kỹ thuật', 'Thợ': 'Thợ xây tô chính', 'Phụ': 'Phụ hồ' };
    const added: Worker = {
      id: Date.now(),
      name: newWorker.name,
      role: newWorker.role as any,
      roleName: roleMap[newWorker.role] || 'Nhân công',
      note: newWorker.note,
      dailyRate: newWorker.dailyRate,
      attendance: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' },
      overtime: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
    };

    setWorkers([...workers, added]);
    setShowAddModal(false);
    setNewWorker({ name: '', role: 'Thợ', note: '', dailyRate: 350000 });
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const daysRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem] space-y-lg">
      <div className="max-w-7xl mx-auto space-y-lg">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="text-h1 text-primary-container mb-xs">Quản Lý Nhân Sự & Bảng Lương</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Chấm công hằng ngày và tính toán lương công nhân công trường theo dữ liệu `Công_2026.xlsx`.
            </p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-lg py-md bg-primary-container text-on-primary font-bold rounded-xl flex items-center gap-xs shadow-sm hover:opacity-90"
            >
              <UserPlus size={18} />
              Thêm công nhân mới
            </button>
            <button 
              onClick={() => alert('Xuất file lương Excel thành công!')}
              className="px-lg py-md border border-outline text-on-surface-variant font-bold rounded-xl flex items-center gap-xs hover:bg-surface-container"
            >
              <FileSpreadsheet size={18} />
              Xuất Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Filters and Month Picker */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-low border border-outline-variant p-md rounded-xl shadow-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm công nhân..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg py-sm pl-xl pr-md text-body-md focus:ring-1 focus:ring-primary-container outline-none"
            />
          </div>

          {/* Month selector */}
          <div className="flex items-center gap-sm">
            <Calendar className="text-primary-container" size={20} />
            <select 
              value={selectedMonthRange}
              onChange={(e) => setSelectedMonthRange(e.target.value)}
              className="bg-surface border border-outline rounded-lg py-sm px-md text-body-md font-semibold text-primary-container outline-none"
            >
              <option value="2-10.T9/2026">Đợt công: từ 2-10.T9/2026</option>
              <option value="11-20.T3/2026">Đợt công: từ 11-20.T3/2026</option>
              <option value="21-30.T6/2026">Đợt công: từ 21-30.T6/2026</option>
            </select>
          </div>
        </div>

        {/* Main Attendance and Payroll Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-md bg-surface-container-low border-b border-outline-variant">
            <h3 className="font-bold text-h3 text-primary-container">Lưới chấm công & Tính toán tiền lương đợt</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-caps text-[11px] uppercase border-b border-outline-variant">
                  <th className="p-md">Họ Tên</th>
                  <th className="p-md text-center">Chức vụ</th>
                  {daysRange.map(day => (
                    <th key={day} className="p-sm text-center border-l border-outline-variant/30 text-[10px] w-12">N.{day}</th>
                  ))}
                  <th className="p-sm text-center border-l border-outline-variant font-bold text-primary-container">Đủ công</th>
                  <th className="p-sm text-center border-l border-outline-variant/50 font-bold text-primary-container">Nửa công</th>
                  <th className="p-sm text-center border-l border-outline-variant/50 font-bold text-[#d36c2b]">TC (giờ)</th>
                  <th className="p-md border-l border-outline-variant text-right">Lương/ngày</th>
                  <th className="p-md text-right font-bold text-[#d36c2b]">Tổng tiền</th>
                  <th className="p-md">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface divide-y divide-outline-variant/50">
                {filteredWorkers.map(w => {
                  const sal = calculateSalary(w);
                  return (
                    <tr key={w.id} className="hover:bg-surface-container transition-colors">
                      <td className="p-md font-bold text-primary-container">{w.name}</td>
                      <td className="p-md text-center">
                        <span className={cn(
                          "px-sm py-2px rounded text-[10px] font-bold uppercase",
                          w.role === 'ĐT' ? "bg-primary-container text-on-primary" : w.role === 'Thợ' ? "bg-secondary text-white" : "bg-surface-container-high text-on-surface-variant"
                        )}>
                          {w.role}
                        </span>
                      </td>
                      
                      {/* Attendance Inputs */}
                      {daysRange.map(day => (
                        <td key={day} className="p-xs text-center border-l border-outline-variant/30">
                          <div className="flex flex-col gap-2px items-center">
                            <select 
                              value={w.attendance[day] || ''}
                              onChange={(e) => handleAttendanceChange(w.id, day, e.target.value as any)}
                              className="text-[11px] bg-transparent border-0 font-bold text-center w-full focus:ring-0 cursor-pointer text-primary-container"
                            >
                              <option value="">-</option>
                              <option value="x">X</option>
                              <option value="h">½</option>
                            </select>
                            <input 
                              type="number"
                              min={0}
                              max={6}
                              value={w.overtime[day] || 0}
                              onChange={(e) => handleOvertimeChange(w.id, day, parseInt(e.target.value) || 0)}
                              className="text-[9px] w-full text-center bg-transparent border-0 text-[#d36c2b] focus:ring-0 p-0"
                              title="Giờ tăng ca"
                            />
                          </div>
                        </td>
                      ))}

                      {/* Summary Data */}
                      <td className="p-sm text-center border-l border-outline-variant font-bold text-on-surface">{sal.fullDays}</td>
                      <td className="p-sm text-center border-l border-outline-variant/50 text-on-surface">{sal.halfDays}</td>
                      <td className="p-sm text-center border-l border-outline-variant/50 font-bold text-[#d36c2b]">{sal.totalOtHours}h</td>
                      
                      <td className="p-md border-l border-outline-variant text-right font-data-mono">{w.dailyRate.toLocaleString('vi-VN')} đ</td>
                      <td className="p-md text-right font-bold text-[#d36c2b] font-data-mono">{Math.round(sal.totalSalary).toLocaleString('vi-VN')} đ</td>
                      <td className="p-md text-on-surface-variant text-label-sm italic truncate max-w-40">{w.note || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Help/Instruction Card */}
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row gap-lg items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-[#ffebe0] flex items-center justify-center text-[#d36c2b]">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-h2 text-primary-container font-bold">Chính sách thanh toán lương của MS</h4>
              <p className="text-body-md text-on-surface-variant mt-xs">
                Tăng ca (TC) được tính 1.5 lần lương cơ bản theo giờ (dailyRate / 8 * 1.5). Thanh toán đợt 10 ngày vào các ngày 10, 20, 30 hằng tháng.
              </p>
            </div>
          </div>
          <div className="flex gap-md shrink-0">
            <button 
              onClick={() => alert('Bảng thanh toán đợt đã được gửi thông báo đến các Đội trưởng qua Zalo OA!')}
              className="px-lg py-sm bg-accent text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-xs"
            >
              <CheckCircle size={16} />
              Chốt lương & Thanh toán đợt
            </button>
          </div>
        </div>

      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-surface-container-low p-lg border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-h2 text-primary-container flex items-center gap-xs">
                <UserPlus size={20} />
                Thêm Công Nhân Công Trường
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddWorker} className="p-lg space-y-md">
              <div>
                <label className="text-label-caps text-on-surface-variant block mb-xs">HỌ VÀ TÊN</label>
                <input 
                  type="text" 
                  required
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  placeholder="Nhập tên công nhân..." 
                  className="w-full bg-surface border border-outline rounded-lg py-md px-md text-body-md outline-none focus:ring-1 focus:ring-primary-container"
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-xs">CHỨC VỤ</label>
                  <select 
                    value={newWorker.role}
                    onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                    className="w-full bg-surface border border-outline rounded-lg py-md px-md text-body-md outline-none"
                  >
                    <option value="Thợ">Thợ</option>
                    <option value="Phụ">Phụ</option>
                    <option value="ĐT">Đội trưởng</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-caps text-on-surface-variant block mb-xs">LƯƠNG/NGÀY (đ)</label>
                  <input 
                    type="number" 
                    required
                    value={newWorker.dailyRate}
                    onChange={(e) => setNewWorker({ ...newWorker, dailyRate: parseInt(e.target.value) || 0 })}
                    placeholder="Lương ngày" 
                    className="w-full bg-surface border border-outline rounded-lg py-md px-md text-body-md outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant block mb-xs">GHI CHÚ / THÔNG TIN PHỤ</label>
                <input 
                  type="text" 
                  value={newWorker.note}
                  onChange={(e) => setNewWorker({ ...newWorker, note: e.target.value })}
                  placeholder="Số CCCD, quê quán, tay nghề..." 
                  className="w-full bg-surface border border-outline rounded-lg py-md px-md text-body-md outline-none"
                />
              </div>
              <div className="pt-md border-t border-outline-variant flex justify-end gap-sm">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-lg py-md border border-outline text-on-surface-variant font-bold rounded-lg hover:bg-surface-container"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="px-lg py-md bg-primary-container text-on-primary font-bold rounded-lg hover:opacity-90"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
