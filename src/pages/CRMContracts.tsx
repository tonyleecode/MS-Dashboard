import React, { useState } from 'react';
import { 
  FileText, Users, Search, Plus, CheckCircle, Clock, 
  MapPin, Phone, Calendar, ArrowUpRight, Upload, Loader2, Sparkles, Building
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function CRMContracts() {
  const [pipeline, setPipeline] = useState([
    { id: 1, name: 'Bà Bùi Thị Thanh Hương', phone: '0911.900.113', address: 'Hòn Đất, Kiên Giang', stage: 'construction', project: 'Nhà phố 2 tầng', contractVal: '1.91 tỷ đ' },
    { id: 2, name: 'Ông Nguyễn Hoàng Nam', phone: '0983.124.556', address: 'Rạch Giá, Kiên Giang', stage: 'design', project: 'Biệt thự vườn', contractVal: 'Đang thảo luận' },
    { id: 3, name: 'Bà Lê Thị Hồng Lan', phone: '0942.889.332', address: 'Hà Tiên, Kiên Giang', stage: 'lead', project: 'Nhà phố cấp 4', contractVal: 'Cần khảo sát đất' },
    { id: 4, name: 'Ông Trần Quốc Bình', phone: '0907.554.123', address: 'Dương Đông, Phú Quốc', stage: 'consultation', project: 'Nhà phố 3 tầng', contractVal: 'Đã gửi báo giá' },
    { id: 5, name: 'Ông Phạm Minh Tuấn', phone: '0918.665.990', address: 'An Biên, Kiên Giang', stage: 'handedover', project: 'Nhà phố 2 tầng', contractVal: '1.68 tỷ đ (Bàn giao 2023)' }
  ]);

  const [activeContract, setActiveContract] = useState({
    id: '01042024/HĐ-TCXD-2024',
    date: '01/04/2024',
    partyA: {
      name: 'Bà Bùi Thị Thanh Hương',
      dob: '20/06/1990',
      idCard: '091190011321',
      address: 'Tổ 5, Bình Thuận, Bình Sơn, Hòn Đất, Kiên Giang'
    },
    partyB: {
      name: 'CÔNG TY TNHH MTV XÂY DỰNG CÁT BIỂN (MS)',
      address: '150, đường Trần Huy Liệu, P. An Hòa, TP. Rạch Giá, tỉnh Kiên Giang',
      representative: 'Ông Võ Thiết Kế / Trần Văn Đông',
      mst: '1702144614',
      bank: 'VietinBank - Số TK: 108001311729'
    },
    terms: {
      value: '1,911,106,000 đ (Một tỷ chín trăm mười một triệu một trăm linh sáu nghìn đồng chẵn)',
      duration: '165 ngày thi công',
      handoverDate: '15/09/2024',
      warranty: '5 năm kết cấu bê tông, 2 năm phần hoàn thiện'
    }
  });

  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleScanContract = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert('[AI SCAN SUCCESS] Đã quét hợp đồng mẫu thành công!\n- Bên A: Bùi Thị Thanh Hương\n- Giá trị hợp đồng: 1,911,106,000 đ\n- Ngày ký: 01/04/2024');
    }, 2000);
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'lead': return <span className="bg-blue-100 text-blue-800 text-[10px] px-sm py-2px rounded font-bold uppercase">Cơ hội mới</span>;
      case 'consultation': return <span className="bg-yellow-100 text-yellow-800 text-[10px] px-sm py-2px rounded font-bold uppercase">Đang tư vấn</span>;
      case 'design': return <span className="bg-purple-100 text-purple-800 text-[10px] px-sm py-2px rounded font-bold uppercase">Đang thiết kế</span>;
      case 'construction': return <span className="bg-green-100 text-green-800 text-[10px] px-sm py-2px rounded font-bold uppercase">Đang thi công</span>;
      case 'handedover': return <span className="bg-surface-container-high text-on-surface-variant text-[10px] px-sm py-2px rounded font-bold uppercase">Đã bàn giao</span>;
      default: return null;
    }
  };

  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem] space-y-lg">
      <div className="max-w-7xl mx-auto space-y-lg">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant pb-md">
          <div>
            <h1 className="text-h1 text-primary-container mb-xs">Khách Hàng (CRM) & Hợp Đồng</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Quản lý tiến trình tư vấn thiết kế khách hàng tiềm năng và lưu trữ thông số hợp đồng pháp lý của MS.
            </p>
          </div>
          <div className="flex gap-sm">
            <button 
              onClick={() => alert('Thêm cơ hội khách hàng mới!')}
              className="px-lg py-md bg-[#d36c2b] text-white font-bold rounded-xl flex items-center gap-xs shadow-sm hover:opacity-90"
            >
              <Plus size={18} />
              Thêm khách hàng
            </button>
          </div>
        </div>

        {/* Main Grid: CRM on Left, Active Contract Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          
          {/* Left Column: CRM Pipeline List */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
            <h3 className="font-bold text-h3 text-primary-container border-b border-outline-variant pb-sm">Phễu Khách Hàng Tiềm Năng</h3>
            
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input 
                type="text" 
                placeholder="Tìm khách hàng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-outline rounded-lg py-sm pl-xl pr-md text-body-md focus:ring-1 focus:ring-primary-container outline-none"
              />
            </div>

            {/* List */}
            <div className="space-y-sm">
              {pipeline
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(c => (
                  <div key={c.id} className="border border-outline-variant hover:border-primary-container p-md rounded-lg bg-surface-container-low/40 hover:bg-surface-container transition-all flex justify-between items-start">
                    <div className="space-y-2px">
                      <div className="font-bold text-on-surface text-body-lg">{c.name}</div>
                      <div className="text-label-sm text-on-surface-variant flex items-center gap-2px">
                        <MapPin size={12} /> {c.address}
                      </div>
                      <div className="text-label-sm text-on-surface-variant flex items-center gap-2px">
                        <Phone size={12} /> {c.phone}
                      </div>
                      <div className="text-body-md font-medium text-[#d36c2b] pt-1">
                        Dự án: {c.project} | {c.contractVal}
                      </div>
                    </div>
                    <div>
                      {getStageBadge(c.stage)}
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Contract Viewer */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant pb-sm gap-md">
              <h3 className="font-bold text-h3 text-primary-container flex items-center gap-xs">
                <FileText size={20} className="text-[#d36c2b]" />
                Chi Tiết Hợp Đồng Thi Công
              </h3>
              
              {/* Scan Button */}
              <button 
                onClick={handleScanContract}
                disabled={isScanning}
                className="px-md py-sm bg-primary-container text-on-primary font-bold rounded-lg text-label-bold flex items-center gap-xs shadow-sm hover:opacity-90 disabled:opacity-60"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles size={16} />}
                {isScanning ? 'Đang đọc...' : 'AI Scan Hợp đồng'}
              </button>
            </div>

            <div className="space-y-lg text-body-md text-on-surface">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-md bg-surface-container-low p-md rounded-lg border border-outline-variant/60">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">SỐ HỢP ĐỒNG</span>
                  <span className="font-bold text-primary-container text-body-lg">{activeContract.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">NGÀY KÝ</span>
                  <span className="font-bold text-primary-container text-body-lg">{activeContract.date}</span>
                </div>
              </div>

              {/* Party A */}
              <div className="space-y-sm">
                <h4 className="font-bold text-primary-container border-l-4 border-l-secondary pl-sm text-body-lg">BÊN A (Chủ Đầu Tư)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm pl-md">
                  <div>Tên chủ nhà: <strong>{activeContract.partyA.name}</strong></div>
                  <div>Năm sinh: <strong>{activeContract.partyA.dob}</strong></div>
                  <div>CCCD/CMND: <strong>{activeContract.partyA.idCard}</strong></div>
                  <div>Địa chỉ xây dựng: <strong>{activeContract.partyA.address}</strong></div>
                </div>
              </div>

              {/* Party B */}
              <div className="space-y-sm">
                <h4 className="font-bold text-primary-container border-l-4 border-l-secondary pl-sm text-body-lg">BÊN B (Đơn Vị Thi Công)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm pl-md">
                  <div>Tên nhà thầu: <strong>{activeContract.partyB.name}</strong></div>
                  <div>Địa chỉ VP: <strong>{activeContract.partyB.address}</strong></div>
                  <div>Mã số thuế: <strong>{activeContract.partyB.mst}</strong></div>
                  <div>Đại diện pháp lý: <strong>{activeContract.partyB.representative}</strong></div>
                  <div className="sm:col-span-2">Tài khoản thanh toán: <strong>{activeContract.partyB.bank}</strong></div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-sm">
                <h4 className="font-bold text-primary-container border-l-4 border-l-[#d36c2b] pl-sm text-body-lg">ĐIỀU KHOẢN CHÍNH</h4>
                <div className="grid grid-cols-1 gap-xs pl-md bg-surface-container-low p-md rounded-lg border border-outline-variant/40">
                  <div>• Tổng giá trị: <strong className="text-[#d36c2b] text-body-lg">{activeContract.terms.value}</strong></div>
                  <div>• Thời gian thi công: <strong>{activeContract.terms.duration}</strong></div>
                  <div>• Ngày bàn giao dự kiến: <strong>{activeContract.terms.handoverDate}</strong></div>
                  <div>• Thời hạn bảo hành: <strong>{activeContract.terms.warranty}</strong></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
