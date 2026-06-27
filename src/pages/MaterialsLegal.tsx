import React, { useState } from 'react';
import { 
  ShieldCheck, Package, FileText, CheckCircle2, Search,
  Download, Eye, Lock, Globe, FileSignature, Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function MaterialsLegal() {
  const [materials, setMaterials] = useState([
    { id: 1, category: 'Sơn nước', name: 'Bột trét ngoại thất NIPPON', brand: 'NIPPON PAINT', desc: 'Bột trét xi măng làm phẳng tường ngoài trời, chống ẩm tốt', status: 'verified' },
    { id: 2, category: 'Sơn nước', name: 'Bột trét nội thất NIPPON', brand: 'NIPPON PAINT', desc: 'Bột trét mịn, bám dính tốt trong nhà', status: 'verified' },
    { id: 3, category: 'Sơn nước', name: 'Sơn lót ngoại thất kháng kiềm NIPPON', brand: 'NIPPON PAINT', desc: 'Sơn lót chống kiềm hóa và muối hóa vượt trội', status: 'verified' },
    { id: 4, category: 'Sơn nước', name: 'Sơn lót nội thất NIPPON', brand: 'NIPPON PAINT', desc: 'Kháng kiềm tốt, tăng độ bám cho lớp sơn phủ', status: 'verified' },
    { id: 5, category: 'Thiết bị điện', name: 'Cầu dao đơn 1 pha <32A', brand: 'PANASONIC', desc: 'Cầu dao tự động chống quá tải dòng điện', status: 'verified' },
    { id: 6, category: 'Thiết bị điện', name: 'Công tắc điện đơn 1 chiều', brand: 'PANASONIC', desc: 'Phím bấm nhạy, thiết kế phẳng hiện đại', status: 'verified' },
    { id: 7, category: 'Dây dẫn điện', name: 'Dây cáp điện đơn 2x2.5', brand: 'CADIVI', desc: 'Lõi đồng nguyên chất, vỏ nhựa PVC cách điện chất lượng cao', status: 'verified' }
  ]);

  const [documents, setDocuments] = useState([
    { id: 101, title: 'Hồ sơ bảo hộ nhãn hiệu Độc quyền Logo MS - Cục SHTT', date: '15/05/2024', type: 'SHTT', size: '2.4 MB', access: 'public' },
    { id: 102, title: 'Quy chuẩn sử dụng Logo và Bộ nhận diện thương hiệu MS', date: '20/04/2024', type: 'Thương hiệu', size: '1.8 MB', access: 'public' },
    { id: 103, title: 'Giấy phép xây dựng số 48/GPXD Hòn Đất - Nhà chị Hương', date: '05/04/2024', type: 'Pháp lý dự án', size: '4.2 MB', access: 'restricted' },
    { id: 104, title: 'Bản vẽ hồ sơ kỹ thuật thi công móng dầm sàn - Nhà chị Hương', date: '01/04/2024', type: 'Kỹ thuật', size: '12.5 MB', access: 'restricted' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="pt-24 p-lg pb-24 md:pb-lg md:pt-[5rem] space-y-lg">
      <div className="max-w-7xl mx-auto space-y-lg">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant pb-md">
          <div>
            <h1 className="text-h1 text-primary-container mb-xs">Vật Tư Tiêu Chuẩn & Pháp Chế</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Danh mục chủng loại vật tư cam kết (Sơn Nippon, Điện Panasonic, Cáp Cadivi) và kho lưu trữ văn bản pháp lý.
            </p>
          </div>
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          
          {/* Left Column: Standard Materials Catalog */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
            <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
              <h3 className="font-bold text-h3 text-primary-container flex items-center gap-xs">
                <Package size={22} className="text-[#d36c2b]" />
                Thư Viện Vật Tư Cam Kết
              </h3>
              <span className="bg-green-100 text-green-800 text-[10px] px-sm py-xs rounded font-bold">Cam kết đền bù 100%</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input 
                type="text" 
                placeholder="Tìm vật tư, thương hiệu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-outline rounded-lg py-sm pl-xl pr-md text-body-md focus:ring-1 focus:ring-primary-container outline-none"
              />
            </div>

            {/* Materials List */}
            <div className="space-y-sm max-h-[480px] overflow-y-auto pr-xs">
              {materials
                .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.brand.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(m => (
                  <div key={m.id} className="border border-outline-variant hover:border-primary-container p-md rounded-lg bg-surface hover:bg-surface-container-low transition-all flex justify-between items-start gap-md">
                    <div className="space-y-xs">
                      <div className="flex items-center gap-sm">
                        <span className="bg-primary-container text-on-primary text-[9px] px-sm py-2px rounded font-bold uppercase">{m.brand}</span>
                        <span className="text-label-sm text-on-surface-variant">{m.category}</span>
                      </div>
                      <h4 className="font-bold text-on-surface text-body-lg">{m.name}</h4>
                      <p className="text-body-md text-on-surface-variant">{m.desc}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-[10px] px-sm py-xs rounded-full font-bold flex items-center gap-2px shrink-0">
                      <ShieldCheck size={12} /> Hợp chuẩn
                    </span>
                  </div>
              ))}
            </div>
          </div>

          {/* Right Column: Legal Documents Database */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
            <div className="flex justify-between items-center border-b border-outline-variant pb-sm">
              <h3 className="font-bold text-h3 text-primary-container flex items-center gap-xs">
                <FileSignature size={22} className="text-[#d36c2b]" />
                Pháp Lý & Bản Quyền SHTT
              </h3>
            </div>

            <div className="space-y-sm">
              {documents.map(d => (
                <div key={d.id} className="border border-outline-variant p-md rounded-lg bg-surface hover:bg-surface-container-low transition-colors flex justify-between items-center">
                  <div className="space-y-2px">
                    <h4 className="font-bold text-on-surface text-body-md truncate w-64 md:w-80" title={d.title}>{d.title}</h4>
                    <div className="text-label-sm text-on-surface-variant flex items-center gap-md">
                      <span>Loại: <strong>{d.type}</strong></span>
                      <span>Dung lượng: {d.size}</span>
                    </div>
                    <div className="text-label-sm text-on-surface-variant">Ngày cập nhật: {d.date}</div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-xs">
                    <button 
                      onClick={() => alert(`Xem file: ${d.title}`)}
                      className="p-sm text-primary-container hover:bg-surface-container-high rounded-full transition-colors"
                      title="Xem tài liệu"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => alert(`Tải xuống: ${d.title}`)}
                      className="p-sm text-primary-container hover:bg-surface-container-high rounded-full transition-colors"
                      title="Tải về"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SHTT Note */}
            <div className="bg-[#fff9f6] border border-[#ffd3c2] text-[#d36c2b] p-md rounded-lg text-body-md flex gap-sm items-start">
              <Info className="shrink-0 mt-0.5" size={18} />
              <span>
                Nhãn hiệu Logo MS và Slogan *"Mind & Solid"* đã nộp đơn đăng ký bảo hộ độc quyền tại Cục Sở hữu Trí tuệ Việt Nam. Mọi hành vi sao chép không xin phép đều vi phạm luật SHTT.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
