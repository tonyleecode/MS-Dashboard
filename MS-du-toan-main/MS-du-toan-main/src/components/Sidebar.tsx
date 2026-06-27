import React, { useState, useRef, useEffect } from 'react';
import { PenTool, History, Wallet, Settings as SettingsIcon, HelpCircle, Plus, Home, Building, X, Save, Edit3, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useEstimation } from '../context/EstimationContext';

interface SidebarProps {
  activeMenu: 'estimation' | 'history' | 'management';
  setActiveMenu: (menu: 'estimation' | 'history' | 'management' | 'result') => void;
  onNewEstimate: () => void;
  onSettingsClick: () => void;
  onSupportClick: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, onNewEstimate, onSettingsClick, onSupportClick, isOpen, setIsOpen }) => {
  const isDarkTheme = activeMenu === 'management';
  const { t } = useSettings();
  const { isAdmin } = useAuth();
  const { estimationData, setEstimationData, estimationStatus } = useEstimation();
  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getProjectTypeName = (type: string | undefined, floors: number) => {
    switch (type) {
      case 'nha-cap-4': return 'Nhà cấp 4';
      case 'nha-2-tang': return 'Nhà phố 2 tầng';
      case 'nha-3-tang': return 'Nhà phố 3 tầng';
      case 'nha-4-tang': return 'Nhà phố 4 tầng';
      case 'biet-thu': return `Biệt thự ${floors} tầng`;
      case 'cai-tao': return 'Cải tạo / Sửa chữa';
      default: return `Nhà phố ${floors} tầng`;
    }
  };

  const generatedName = (estimationData.width && estimationData.floors) 
    ? `${getProjectTypeName(estimationData.projectType, estimationData.floors)} mặt tiền ${estimationData.width}m`
    : 'Chưa đặt tên';

  const dynamicProjectName = estimationData.projectName || generatedName;

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstimationData((prev) => ({ ...prev, projectName: e.target.value }));
  };

  const handleBlurOrEnter = (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (e.type === 'blur' || (e as React.KeyboardEvent).key === 'Enter') {
      setIsEditingName(false);
    }
  };

  const handleMenuClick = (menu: 'estimation' | 'history' | 'management') => {
    setActiveMenu(menu);
    setIsOpen?.(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden" 
          onClick={() => setIsOpen?.(false)}
        />
      )}
    
      <aside className={clsx(
        "flex flex-col h-full p-6 gap-4 w-[280px] shrink-0 overflow-y-auto transition-transform duration-300 print:hidden z-50",
        "fixed md:static inset-y-0 left-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isDarkTheme ? "bg-primary text-on-primary border-r-0" : "bg-surface-container-lowest border-r border-outline-variant"
      )}>
        <div className="flex md:hidden justify-end -mt-2 -mr-2 mb-2">
          <button onClick={() => setIsOpen?.(false)} className="p-2 rounded-full hover:bg-black/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className={clsx(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            isDarkTheme ? "bg-white/10 text-white" : "bg-primary text-on-primary"
          )}>
            <PenTool className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <input
                ref={inputRef}
                type="text"
                value={estimationData.projectName || ''}
                placeholder={dynamicProjectName}
                onChange={handleNameChange}
                onBlur={handleBlurOrEnter}
                onKeyDown={handleBlurOrEnter}
                className={clsx(
                  "w-full px-1 py-0.5 rounded text-sm font-bold border-none outline-none ring-2 ring-secondary",
                  isDarkTheme ? "bg-primary text-white" : "bg-white text-primary"
                )}
              />
            ) : (
              <div 
                onClick={() => setIsEditingName(true)}
                className={clsx("font-h3 text-lg font-bold truncate leading-tight flex-1 cursor-text hover:opacity-80 transition-opacity", isDarkTheme ? "text-white" : "text-primary")} 
                title={dynamicProjectName}
              >
                {dynamicProjectName}
              </div>
            )}
            <div className={clsx(
              "font-body-md text-[10px] uppercase font-bold mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-max cursor-default", 
              estimationStatus === 'saved' ? 'bg-[#e6f4ea] text-[#137333] dark:bg-green-500/20 dark:text-green-300' :
              estimationStatus === 'draft' ? 'bg-[#fef7e0] text-[#b06000] dark:bg-orange-500/20 dark:text-orange-300' :
              'bg-[#e8f0fe] text-[#1967d2] dark:bg-blue-500/20 dark:text-blue-300'
            )}>
              {estimationStatus === 'saved' && <Save className="w-3 h-3" />}
              {estimationStatus === 'draft' && <Edit3 className="w-3 h-3" />}
              {estimationStatus === 'new' && <Sparkles className="w-3 h-3" />}
              {t(`app.status.${estimationStatus}`)}
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => handleMenuClick('estimation')}
          className={clsx(
            'w-full flex items-center gap-4 p-4 rounded-lg transition-transform',
            activeMenu === 'estimation' 
              ? 'bg-primary text-white font-bold shadow-sm' 
              : isDarkTheme ? 'text-white/70 hover:bg-white/10' : 'text-neutral-grey hover:bg-surface-container-high'
          )}
        >
          <PenTool className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">{t('nav.estimation')}</span>
        </button>
        <button
          onClick={() => handleMenuClick('history')}
          className={clsx(
            'w-full flex items-center gap-4 p-4 rounded-lg transition-transform',
            activeMenu === 'history' 
              ? 'bg-secondary-container text-secondary font-bold shadow-sm' 
              : isDarkTheme ? 'text-white/70 hover:bg-white/10' : 'text-neutral-grey hover:bg-surface-container-high'
          )}
        >
          <History className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">{t('nav.history')}</span>
        </button>
        <button
          onClick={() => handleMenuClick('management')}
          className={clsx(
            'w-full flex items-center gap-4 p-4 rounded-lg transition-transform',
            activeMenu === 'management' 
              ? 'bg-secondary text-white font-bold shadow-sm' 
              : isDarkTheme ? 'text-white/70 hover:bg-white/10' : 'text-neutral-grey hover:bg-surface-container-high'
          )}
        >
          <Wallet className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">
            {isAdmin ? t('nav.management') : t('nav.pricing')}
          </span>
        </button>
      </nav>
      
      {/* New Estimate button */}
      <div className="px-2 mt-4">
        <button
          onClick={() => {
            onNewEstimate();
            setIsOpen?.(false);
          }}
          className={clsx(
            "w-full hover:bg-opacity-90 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95",
            isDarkTheme ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : "bg-accent text-on-primary"
          )}
        >
          <Plus className="w-5 h-5" />
          {t('app.newEstimate')}
        </button>
      </div>

      <div className={clsx(
        "mt-auto pt-4 space-y-1",
        isDarkTheme ? "border-t border-white/10" : "border-t border-outline-variant"
      )}>
        <a href="https://xaydungms.vn/" target="_blank" rel="noopener noreferrer" className={clsx(
          "w-full flex items-center gap-4 p-4 transition-all rounded-lg",
          isDarkTheme ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-neutral-grey hover:bg-surface-container-high"
        )}>
          <Home className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">{t('nav.home')}</span>
        </a>
        <a href="https://xaydungms.vn/#du-an" target="_blank" rel="noopener noreferrer" className={clsx(
          "w-full flex items-center gap-4 p-4 transition-all rounded-lg",
          isDarkTheme ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-neutral-grey hover:bg-surface-container-high"
        )}>
          <Building className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">{t('nav.projects')}</span>
        </a>
        <button 
          onClick={() => {
            onSettingsClick();
            setIsOpen?.(false);
          }}
          className={clsx(
          "w-full flex items-center gap-4 p-4 transition-all rounded-lg",
          isDarkTheme ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-neutral-grey hover:bg-surface-container-high"
        )}>
          <SettingsIcon className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">{t('nav.settings')}</span>
        </button>
        <button 
          onClick={() => {
            onSupportClick();
            setIsOpen?.(false);
          }}
          className={clsx(
          "w-full flex items-center gap-4 p-4 transition-all rounded-lg",
          isDarkTheme ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-neutral-grey hover:bg-surface-container-high"
        )}>
          <HelpCircle className="w-5 h-5" />
          <span className="font-label-caps text-[11px] uppercase tracking-wider font-bold">{t('nav.support')}</span>
        </button>
      </div>
    </aside>
    </>
  );
};
