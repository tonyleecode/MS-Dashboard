import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Bell, Settings, HelpCircle, Building2, HardHat, History, 
  Wallet, Plus, ChevronRight, Calculator, Users, DollarSign, 
  FileText, ShieldCheck, Package, Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const menuItems = [
    { to: '/', label: 'Bảng Điều Khiển', icon: Activity },
    { to: '/estimating', label: 'Ước Tính Nhanh (m²)', icon: Calculator },
    { to: '/takeoff', label: 'Bóc Vật Tư (Định mức)', icon: Package },
    { to: '/hr', label: 'Nhân Sự & Lương', icon: Users },
    { to: '/finance', label: 'Kế Toán & Thu Chi', icon: DollarSign },
    { to: '/crm', label: 'Khách Hàng & HĐ', icon: FileText },
    { to: '/materials', label: 'Vật Tư & Pháp Chế', icon: ShieldCheck },
    { to: '/history', label: 'Lịch Sử Dự Toán', icon: History },
    { to: '/management', label: 'Quản Lý Đơn Giá', icon: Settings },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 fixed top-0 z-50">
        <div className="flex items-center gap-md h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-sm">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-white font-extrabold text-h2 shadow-md">
              MS
            </div>
            <div>
              <span className="font-h2 text-h2 text-primary-container font-extrabold block leading-none">MIND & SOLID</span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mt-1">Design & Construction</span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => alert('Thông báo vận hành: Tất cả 3 dự án đang hoạt động tốt!')}
            className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors flex items-center justify-center"
          >
            <Bell size={20} />
          </button>
          <a 
            href="/management"
            className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors flex items-center justify-center"
          >
            <Settings size={20} />
          </a>
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant ml-sm cursor-pointer">
            <div className="w-full h-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1 h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] bg-surface-container-lowest border-r border-outline-variant flex flex-col p-md gap-sm hidden md:flex">
          {/* Active Organization Header */}
          <div className="flex items-center gap-md mb-md p-sm border-b border-outline-variant pb-md">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
              <Building2 size={24} />
            </div>
            <div>
              <div className="text-h3 font-bold text-primary-container truncate w-40">VP. Rạch Giá</div>
              <div className="text-label-caps text-on-surface-variant uppercase text-[10px]">Cơ quan chủ quản MS</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-xs overflow-y-auto pr-xs">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-md p-md transition-all rounded-lg font-bold text-label-caps text-[12px] uppercase",
                    isActive
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  )
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* New Estimate FAB shortcut */}
          <a href="/estimating" className="bg-[#d36c2b] text-white font-bold py-md px-lg rounded-xl mb-md flex items-center justify-center gap-sm shadow-md hover:opacity-90 transition-opacity text-center">
             <Plus size={18} />
             Dự Toán Mới (AI)
          </a>

          {/* Bottom links */}
          <div className="border-t border-outline-variant pt-md flex flex-col gap-xs">
            <button 
              onClick={() => alert('Trung tâm trợ giúp kỹ thuật xây dựng MS: Email hotro@xaydungms.vn')}
              className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg w-full text-left"
            >
              <HelpCircle size={20} />
              <span className="font-label-caps uppercase text-[12px] font-bold">Trợ Giúp Kỹ Thuật</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="md:ml-[280px] flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-sm",
              isActive ? "text-primary-container font-bold" : "text-on-surface-variant"
            )
          }
        >
          <Activity size={20} />
          <span className="text-[9px] mt-1 font-bold">Vận Hành</span>
        </NavLink>
        <NavLink
          to="/estimating"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-sm",
              isActive ? "text-primary-container font-bold" : "text-on-surface-variant"
            )
          }
        >
          <Calculator size={20} />
          <span className="text-[9px] mt-1 font-bold">Dự Toán AI</span>
        </NavLink>
        <NavLink
          to="/hr"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-sm",
              isActive ? "text-primary-container font-bold" : "text-on-surface-variant"
            )
          }
        >
          <Users size={20} />
          <span className="text-[9px] mt-1 font-bold">Nhân Sự</span>
        </NavLink>
        <NavLink
          to="/finance"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-sm",
              isActive ? "text-primary-container font-bold" : "text-on-surface-variant"
            )
          }
        >
          <DollarSign size={20} />
          <span className="text-[9px] mt-1 font-bold">Tài Chính</span>
        </NavLink>
      </div>
    </div>
  );
}
