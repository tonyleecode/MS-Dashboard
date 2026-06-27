import React from 'react';
import { 
  Building2, Users, DollarSign, Calendar, TrendingUp, 
  CheckCircle2, ArrowUpRight, CloudSun, Clock, HardHat, FileText 
} from 'lucide-react';

export default function Dashboard() {
  // Mock KPIs
  const stats = [
    { label: 'Dự Án Đang Chạy', value: '3 công trình', change: '+1 tháng này', icon: Building2, color: 'bg-primary-container text-on-primary' },
    { label: 'Tổng Số Nhân Lực', value: '14 nhân sự', change: '8 thợ | 6 phụ', icon: Users, color: 'bg-secondary text-white' },
    { label: 'Doanh Số Hợp Đồng', value: '4.85 tỷ đ', change: 'Đã nghiệm thu 70%', icon: DollarSign, color: 'bg-accent text-white' },
    { label: 'Tiến Độ Trung Bình', value: '72%', change: 'Đúng kế hoạch', icon: TrendingUp, color: 'bg-tertiary-container text-on-tertiary-container' },
  ];

  // Primary project: Chị Hương - Hòn Đất
  const mainProject = {
    name: 'Thi công nhà phố Chị Hương - Hòn Đất',
    location: 'Bình Sơn, Hòn Đất, Kiên Giang',
    value: '1,911,106,000 đ',
    progress: 68,
    startDate: '01/04/2024',
    expectedDate: '15/09/2024',
    supervisor: 'KTS. Trần Văn Đông',
    status: 'Đang thi công phần thô (Lầu 1)',
    tasks: [
      { id: 1, name: 'Ép cọc móng bê tông cốt thép', status: 'completed', date: '08/04/2024' },
      { id: 2, name: 'Đổ bê tông móng băng', status: 'completed', date: '25/04/2024' },
      { id: 3, name: 'Thi công cột & dầm sàn trệt', status: 'completed', date: '15/05/2024' },
      { id: 4, name: 'Xây tường trệt & Đổ bê tông sàn lầu 1', status: 'completed', date: '10/06/2024' },
      { id: 5, name: 'Xây tường bao quanh lầu 1 & Chuẩn bị đổ mái', status: 'active', date: 'Dự kiến: 05/07/2024' },
      { id: 6, name: 'Thi công hoàn thiện nội thất trọn gói', status: 'pending', date: 'Dự kiến: 15/08/2024' },
    ]
  };

  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem] space-y-lg">
      <div className="max-w-7xl mx-auto space-y-lg">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="text-h1 text-primary-container mb-xs">Hệ Thống Vận Hành Xây Dựng MS</h1>
            <p className="text-body-lg text-on-surface-variant max-w-3xl">
              Chào mừng trở lại! Báo cáo nhanh hoạt động thi công, giám sát và quản lý nhân sự tại công trường MS hôm nay.
            </p>
          </div>
          {/* Weather Widget */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-xl flex items-center gap-md shadow-sm">
            <CloudSun className="text-accent" size={32} />
            <div>
              <div className="font-bold text-on-surface text-body-md">Hòn Đất, Kiên Giang</div>
              <div className="text-label-sm text-on-surface-variant">31°C | Nắng nhẹ - Thuận lợi thi công ngoài trời</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="space-y-sm">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">{s.label}</span>
                <div className="text-h2 text-primary-container font-extrabold">{s.value}</div>
                <span className="text-label-sm text-[#d36c2b] font-medium flex items-center gap-xs">
                  <CheckCircle2 size={12} /> {s.change}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Left Block: Primary Active Project (Chị Hương) */}
          <div className="lg:col-span-8 space-y-lg">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant pb-md mb-lg gap-md">
                <div>
                  <span className="bg-primary-container text-on-primary-container text-[10px] px-sm py-xs rounded font-bold uppercase tracking-wider">Công trình trọng điểm</span>
                  <h2 className="text-h2 text-primary-container mt-xs font-bold">{mainProject.name}</h2>
                  <p className="text-body-md text-on-surface-variant">{mainProject.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-label-caps text-on-surface-variant text-[11px]">GIÁ TRỊ HỢP ĐỒNG</span>
                  <div className="text-h3 font-extrabold text-[#d36c2b]">{mainProject.value}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-sm mb-xl">
                <div className="flex justify-between items-center text-body-md">
                  <span className="font-semibold text-on-surface">Tiến độ thi công thực tế</span>
                  <span className="font-bold text-primary-container text-h3">{mainProject.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-container h-full rounded-full transition-all duration-500" 
                    style={{ width: `${mainProject.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-label-sm text-on-surface-variant">
                  <span>Khởi công: {mainProject.startDate}</span>
                  <span>Hiện tại: {mainProject.status}</span>
                  <span>Bàn giao dự kiến: {mainProject.expectedDate}</span>
                </div>
              </div>

              {/* Gantt / Task Milestones */}
              <h3 className="font-h3 text-xl text-primary-container mb-md border-l-4 border-l-[#d36c2b] pl-md">Nhật Ký Thi Công & Cột Mốc</h3>
              <div className="relative border-l-2 border-outline-variant ml-[11px] pl-lg space-y-lg">
                {mainProject.tasks.map((task) => (
                  <div key={task.id} className="relative">
                    {/* Node Dot */}
                    <span className={`absolute -left-[33px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                      task.status === 'completed' 
                        ? 'bg-primary-container border-primary-container text-white' 
                        : task.status === 'active' 
                        ? 'bg-white border-[#d36c2b] text-[#d36c2b] animate-pulse'
                        : 'bg-surface border-outline-variant text-on-surface-variant'
                    }`}>
                      {task.status === 'completed' && <CheckCircle2 size={12} />}
                      {task.status === 'active' && <Clock size={12} />}
                    </span>

                    <div className="bg-surface-container-low border border-outline-variant p-md rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
                      <div>
                        <div className={`font-semibold ${task.status === 'active' ? 'text-[#d36c2b] font-bold' : 'text-on-surface'}`}>
                          {task.name}
                        </div>
                        <div className="text-label-sm text-on-surface-variant">Ngày thực hiện: {task.date}</div>
                      </div>
                      <span className={`text-[10px] px-sm py-xs rounded font-bold uppercase tracking-wider ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : task.status === 'active' 
                          ? 'bg-[#ffebe0] text-[#d36c2b]'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {task.status === 'completed' ? 'Đã nghiệm thu' : task.status === 'active' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Block: Daily Worklog & Quick Actions */}
          <div className="lg:col-span-4 space-y-lg">
            {/* Quick Actions */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
              <h3 className="font-h3 text-xl text-primary-container mb-md">Lối Tắt Hành Động</h3>
              <div className="grid grid-cols-2 gap-sm">
                <a href="/estimating" className="flex flex-col items-center justify-center p-md border border-outline-variant rounded-lg hover:border-primary-container hover:bg-surface-container transition-all text-center gap-xs">
                  <HardHat className="text-[#d36c2b]" size={24} />
                  <span className="text-body-md font-semibold text-on-surface">Dự Toán AI</span>
                </a>
                <a href="/hr" className="flex flex-col items-center justify-center p-md border border-outline-variant rounded-lg hover:border-primary-container hover:bg-surface-container transition-all text-center gap-xs">
                  <Users className="text-[#d36c2b]" size={24} />
                  <span className="text-body-md font-semibold text-on-surface">Chấm Công</span>
                </a>
                <a href="/finance" className="flex flex-col items-center justify-center p-md border border-outline-variant rounded-lg hover:border-primary-container hover:bg-surface-container transition-all text-center gap-xs">
                  <DollarSign className="text-[#d36c2b]" size={24} />
                  <span className="text-body-md font-semibold text-on-surface">Kế Toán</span>
                </a>
                <a href="/crm" className="flex flex-col items-center justify-center p-md border border-outline-variant rounded-lg hover:border-primary-container hover:bg-surface-container transition-all text-center gap-xs">
                  <FileText className="text-[#d36c2b]" size={24} />
                  <span className="text-body-md font-semibold text-on-surface">Hợp Đồng</span>
                </a>
              </div>
            </div>

            {/* Daily Active Workers Log */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
                <h3 className="font-h3 text-xl text-primary-container">Đội Công Nhân Hôm Hôm Nay</h3>
                <span className="text-label-sm text-[#d36c2b] font-bold">Lầu 1</span>
              </div>
              <ul className="divide-y divide-outline-variant">
                <li className="py-md flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">AL</div>
                    <div>
                      <div className="text-body-md font-bold text-on-surface">A Lâm</div>
                      <div className="text-label-sm text-on-surface-variant">Đội trưởng | Chỉ đạo cốt thép</div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] px-sm py-xs rounded-full font-bold">Có mặt</span>
                </li>
                <li className="py-md flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">NT</div>
                    <div>
                      <div className="text-body-md font-bold text-on-surface">Nguyễn Tấn Tài</div>
                      <div className="text-label-sm text-on-surface-variant">Thợ xây | Xây gạch bao lầu 1</div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] px-sm py-xs rounded-full font-bold">Có mặt</span>
                </li>
                <li className="py-md flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">NH</div>
                    <div>
                      <div className="text-body-md font-bold text-on-surface">Nguyễn Tấn Hùng</div>
                      <div className="text-label-sm text-on-surface-variant">Thợ xây | Nghiệm thu độ dày mạch vữa</div>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] px-sm py-xs rounded-full font-bold">Có mặt</span>
                </li>
              </ul>
              <div className="pt-md border-t border-outline-variant text-center">
                <a href="/hr" className="text-[#d36c2b] text-body-md font-bold hover:underline flex items-center justify-center gap-xs">
                  Xem bảng công & lương chi tiết <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
