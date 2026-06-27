import React, { useRef, useState } from 'react';
import { Upload, Ruler, Settings, Calculator, Home, Loader2, CheckCircle, FileImage } from 'lucide-react';
import clsx from 'clsx';
import { useEstimation } from '../context/EstimationContext';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from '../context/NotificationContext';
import { GoogleGenAI, Type } from '@google/genai';
import toast from 'react-hot-toast';

interface EstimationToolProps {
  onCalculate: () => void;
}

export const EstimationTool: React.FC<EstimationToolProps> = ({ onCalculate }) => {
  const { estimationData, setEstimationData } = useEstimation();
  const { t } = useSettings();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleInputChange = (field: keyof typeof estimationData, value: number | string) => {
    setEstimationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Vui lòng chọn file hình ảnh hoặc PDF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsExtracting(true);
    const toastId = toast.loading('Đang phân tích bản vẽ bằng AI...');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          let mimeType = file.type;
          if (!mimeType) {
            if (file.name.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
            else if (file.name.toLowerCase().endsWith('.png')) mimeType = 'image/png';
            else mimeType = 'image/jpeg';
          }
          const base64Data = result.split(',')[1];

          // @ts-ignore
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
             model: 'gemini-3.1-pro-preview',
             contents: [
               {
                 inlineData: { data: base64Data, mimeType }
               },
               "Kiểm tra file này. Đây có phải là một file bản vẽ mặt bằng nhà không? Nếu không phải, hãy gán isBlueprint = false. Nếu đúng là bản vẽ, gán isBlueprint = true và tìm kích thước tổng (chiều ngang, chiều dài bằng mét). Truy xuất số tầng (floors). Trả về JSON."
             ],
             config: {
               responseMimeType: "application/json",
               responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    isBlueprint: { type: Type.BOOLEAN, description: "True nếu đây là bản vẽ kỹ thuật/mặt bằng công trình" },
                    width: { type: Type.NUMBER, description: "Chiều ngang biên phủ bì của công trình (mét), 0 nếu không tìm thấy" },
                    length: { type: Type.NUMBER, description: "Chiều dài biên phủ bì của công trình (mét), 0 nếu không tìm thấy" },
                    floors: { type: Type.NUMBER, description: "Tổng số tầng, 1 nếu không ghi rõ" }
                  },
                  required: ["isBlueprint", "width", "length", "floors"]
               }
             }
          });

          const text = response.text || "{}";
          const data = JSON.parse(text);
          
          if (data.isBlueprint === false) {
             toast.error('File này có vẻ không phải là bản vẽ mặt bằng. Vui lòng kiểm tra lại.', { id: toastId });
             return;
          }

          if (data.width > 0) handleInputChange('width', data.width);
          if (data.length > 0) handleInputChange('length', data.length);
          if (data.floors > 0) handleInputChange('floors', Math.min(Math.max(1, data.floors), 10)); // bounds check

          toast.success('Đã trích xuất kích thước thành công!', { id: toastId });
        } catch (error: any) {
           console.error("Lỗi AI: ", error);
           toast.error(
             error?.message?.includes("not found") ? 'Có lỗi kết nối với AI (không tìm thấy model).' : 'AI không đọc được dữ liệu tài liệu này (có thể do file không phải bản vẽ, file bị lỗi hoặc quá phức tạp). Vui lòng điền tay.', 
             { id: toastId, duration: 5000 }
           );
        } finally {
          setIsExtracting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        toast.error('Lỗi khi đọc file trên máy của bạn.', { id: toastId });
        setIsExtracting(false);
      }
      reader.readAsDataURL(file);
    } catch (err) {
      setIsExtracting(false);
      toast.error('Có lỗi hệ thống xảy ra.', { id: toastId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-h1 text-3xl font-bold text-primary mb-2">{t('tool.title')}</h1>
          <p className="font-body-lg text-neutral-grey max-w-2xl">
            {t('tool.desc')}
          </p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => !isExtracting && fileInputRef.current?.click()}
            disabled={isExtracting}
            className={clsx(
              "border border-neutral-grey text-neutral-grey font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:border-secondary hover:bg-secondary hover:text-white transition-all",
              isExtracting && "opacity-70 cursor-not-allowed"
            )}
            title="Đọc kích thước từ ảnh/PDF bản vẽ mặt bằng"
          >
            {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileImage className="w-5 h-5" />}
            {isExtracting ? 'Đang phân tích...' : t('tool.upload')}
          </button>
        </div>
      </div>

      {/* Main Form Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Primary Dimensions */}
        <div className="md:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
              <Ruler className="w-6 h-6 text-primary" />
              <h2 className="font-h3 text-xl font-bold text-primary">{t('tool.basicDim')}</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-2">{t('tool.projectType')}</label>
                <div className="relative">
                  <select
                    value={estimationData.projectType || 'nha-cap-4'}
                    onChange={(e) => {
                      const type = e.target.value;
                      handleInputChange('projectType', type);
                      if (type === 'nha-2-tang') handleInputChange('floors', 2);
                      else if (type === 'nha-3-tang') handleInputChange('floors', 3);
                      else if (type === 'nha-4-tang') handleInputChange('floors', 4);
                      else if (type === 'nha-cap-4') handleInputChange('floors', 1);
                    }}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary appearance-none font-body-md"
                  >
                    <option value="nha-cap-4">{t('tool.projectType.nhaCap4')}</option>
                    <option value="nha-2-tang">{t('tool.projectType.nha2Tang')}</option>
                    <option value="nha-3-tang">{t('tool.projectType.nha3Tang')}</option>
                    <option value="nha-4-tang">{t('tool.projectType.nha4Tang')}</option>
                    <option value="biet-thu">{t('tool.projectType.bietThu')}</option>
                    <option value="cai-tao">{t('tool.projectType.caiTao')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-2">{t('tool.width')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={estimationData.width || ''}
                    onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary font-data-tabular"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-grey font-medium">m</span>
                </div>
              </div>
              <div>
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-2">{t('tool.length')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={estimationData.length || ''}
                    onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary font-data-tabular"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-grey font-medium">m</span>
                </div>
              </div>
              <div>
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-2">{t('tool.floors')}</label>
                <div className="relative">
                  <select
                    value={estimationData.floors}
                    onChange={(e) => {
                      const fl = parseInt(e.target.value, 10);
                      handleInputChange('floors', fl);
                      if (estimationData.projectType?.startsWith('nha-')) {
                        if (fl === 1) handleInputChange('projectType', 'nha-cap-4');
                        else if (fl === 2) handleInputChange('projectType', 'nha-2-tang');
                        else if (fl === 3) handleInputChange('projectType', 'nha-3-tang');
                        else if (fl === 4) handleInputChange('projectType', 'nha-4-tang');
                      }
                    }}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary appearance-none font-data-tabular"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {t('tool.floors.unit')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-container text-on-primary-container p-6 rounded-xl border border-primary relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-6 h-6" />
                <span className="font-h3 text-xl font-bold">{t('tool.tip.title')}</span>
              </div>
              <p className="font-body-md opacity-90">
                {t('tool.tip.desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Technical Specs */}
        <div className="md:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-4">
              <Settings className="w-6 h-6 text-primary" />
              <h2 className="font-h3 text-xl font-bold text-primary">{t('tool.techSpecs')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Loại Móng */}
              <div className="space-y-4">
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block">{t('tool.foundation')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'don', label: t('tool.foundation.don'), icon: Home },
                      { id: 'coc', label: t('tool.foundation.coc'), icon: Home },
                      { id: 'bang', label: t('tool.foundation.bang'), icon: Home },
                      { id: 'be', label: t('tool.foundation.be'), icon: Home },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleInputChange('foundation', m.id)}
                      className={clsx(
                        'flex flex-col items-center justify-center p-4 border rounded-lg transition-all gap-1',
                        estimationData.foundation === m.id
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline-variant bg-surface-container-low text-neutral-grey hover:border-primary hover:text-primary'
                      )}
                    >
                      <m.icon className="w-6 h-6 mb-1" />
                      <span className="text-sm">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tầng Hầm */}
              <div className="space-y-4">
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block">{t('tool.basement')}</label>
                <div className="space-y-2">
                  {(
                    [
                      { id: 'none', label: t('tool.basement.none') },
                      { id: 'shallow', label: t('tool.basement.shallow') },
                      { id: 'medium', label: t('tool.basement.medium') },
                      { id: 'deep', label: t('tool.basement.deep') },
                      { id: 'very_deep', label: t('tool.basement.very_deep') },
                    ] as const
                  ).map((m) => (
                    <label
                      key={m.id}
                      className={clsx(
                        'flex items-center p-3 border rounded-lg cursor-pointer transition-colors',
                        estimationData.basement === m.id
                          ? 'border-primary bg-primary/10'
                          : 'border-outline-variant bg-surface hover:bg-surface-container-high'
                      )}
                    >
                      <input
                        type="radio"
                        checked={estimationData.basement === m.id}
                        onChange={() => handleInputChange('basement', m.id)}
                        className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                      />
                      <span className="ml-3 font-body-md">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Loại Mái */}
              <div className="md:col-span-2 space-y-4">
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block">{t('tool.roof')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(
                    [
                      { id: 'ton', label: t('tool.roof.ton'), icon: Home },
                      { id: 'bang', label: t('tool.roof.bang'), icon: Home },
                      { id: 'ngoikeosat', label: t('tool.roof.ngoikeosat'), icon: Home },
                      { id: 'ngoiduc', label: t('tool.roof.ngoiduc'), icon: Home },
                    ] as const
                  ).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleInputChange('roof', r.id)}
                      className={clsx(
                        'flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all',
                        estimationData.roof === r.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-outline-variant bg-surface hover:bg-surface-container-high text-neutral-grey'
                      )}
                    >
                      <r.icon className={clsx('w-6 h-6 mb-2', estimationData.roof === r.id ? 'text-primary' : 'text-neutral-grey')} />
                      <span className="text-sm text-center">{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hình Thức Thi Công */}
              <div className="md:col-span-2 space-y-4">
                <label className="font-label-caps text-[11px] font-bold text-neutral-grey block">{t('tool.packageType')}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={clsx(
                      'relative flex items-center p-6 border rounded-xl cursor-pointer transition-colors',
                      estimationData.packageType === 'tho'
                        ? 'border-primary bg-primary/10'
                        : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'
                    )}
                    onClick={() => handleInputChange('packageType', 'tho')}
                  >
                    <input
                      type="radio"
                      checked={estimationData.packageType === 'tho'}
                      readOnly
                      className="w-5 h-5 text-primary border-outline-variant"
                    />
                    <div className="ml-4">
                      <div className="font-h3 text-xl font-bold text-primary">{t('tool.packageType.tho')}</div>
                      <div className="text-sm text-neutral-grey mt-1">{t('tool.packageType.tho.desc')}</div>
                    </div>
                  </label>

                  <div
                    className={clsx(
                      'relative p-6 border-2 rounded-xl cursor-pointer',
                      estimationData.packageType === 'trongoi'
                        ? 'border-primary bg-surface-container-lowest'
                        : 'border-outline-variant bg-surface-container-low'
                    )}
                    onClick={() => handleInputChange('packageType', 'trongoi')}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          checked={estimationData.packageType === 'trongoi'}
                          readOnly
                          className="w-5 h-5 text-primary border-outline-variant"
                        />
                        <div className="font-h3 text-xl font-bold text-primary">{t('tool.packageType.trongoi')}</div>
                      </div>
                      <span className="bg-accent text-on-primary text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">{t('tool.packageType.trongoi.desc')}</span>
                    </div>
                    {estimationData.packageType === 'trongoi' && (
                      <div className="space-y-2 ml-9">
                        <select
                          value={estimationData.packageLevel || 'kha'}
                          onChange={(e) => handleInputChange('packageLevel', e.target.value)}
                          className="w-full bg-surface-container-lowest border border-primary rounded-lg py-2 px-3 focus:ring-0 focus:border-primary font-body-md text-primary font-medium"
                        >
                          <option value="tieuchuan">{t('tool.packageLevel.tieuchuan')}</option>
                          <option value="kha">{t('tool.packageLevel.kha')}</option>
                          <option value="caocap">{t('tool.packageLevel.caocap')}</option>
                        </select>
                        <div className="flex items-center gap-1 text-sm text-neutral-grey mt-2">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          {t('tool.packageLevel.goodMaterial')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full width disclaimer */}
      <div className="mt-6">
        <div className="bg-surface-container-low border-l-4 border-secondary p-4 md:p-5 rounded-r-xl shadow-sm flex gap-4 items-start">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p className="text-sm text-neutral-slate">
            <span className="font-bold text-on-surface">{t('tool.disclaimer.title')}</span>{t('tool.disclaimer.desc')}
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-6 bg-surface-container-highest rounded-xl border border-outline-variant">
        <div className="hidden md:flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="font-h3 text-xl font-bold text-primary">{t('tool.ready.title')}</div>
            <div className="font-body-md text-neutral-grey">{t('tool.ready.desc')}</div>
          </div>
        </div>
        <button
          onClick={() => {
            addNotification(`Đã tính toán dự toán mới: ${estimationData.width}x${estimationData.length}m, ${estimationData.floors} tầng`);
            onCalculate();
          }}
          className="w-full md:w-auto bg-primary hover:bg-opacity-90 text-on-primary font-bold text-lg py-3 px-12 rounded-lg shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Calculator className="w-6 h-6" />
          {t('tool.calculateBtn')}
        </button>
      </div>
    </div>
  );
};
