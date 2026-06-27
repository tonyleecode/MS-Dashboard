import React from 'react';
import { Bell, Settings, HelpCircle, Home, Menu } from 'lucide-react';
import clsx from 'clsx';
import logoImage from '../assets/images/MS-logo-main.png';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface TopBarProps {
  activeMenu: 'estimation' | 'history' | 'management';
  setActiveMenu: (menu: 'estimation' | 'history' | 'management') => void;
  onSettingsClick: () => void;
  onUserClick: () => void;
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeMenu, setActiveMenu, onSettingsClick, onUserClick, onNotificationsClick, onMenuClick }) => {
  const { unreadCount } = useNotifications();
  const { user, isAdmin } = useAuth();
  const { t } = useSettings();

  return (
    <header className="bg-surface dark:bg-surface-dim border-b border-outline-variant flex justify-between items-center w-full px-4 md:px-6 h-14 shrink-0 print:hidden">
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-surface-container-high transition-colors"
        >
          <Menu className="w-5 h-5 text-on-surface" />
        </button>
        <a href="https://xaydungms.vn/" title="Về trang chủ" className="flex items-center font-montserrat font-bold text-xl text-primary gap-2 hover:opacity-80 transition-opacity">
          <img src={logoImage} alt="MIND & SOLID" className="h-7 md:h-8 w-auto object-contain" />
        </a>
        <div className="hidden md:flex ml-8 gap-6 items-center text-[13px]">
          <button
            onClick={() => setActiveMenu('estimation')}
            className={clsx(
              'font-semibold transition-colors py-4 border-b-[3px]',
              activeMenu === 'estimation' ? 'text-primary border-primary' : 'text-neutral-grey hover:text-on-surface border-transparent'
            )}
          >
            {t('nav.estimation')}
          </button>
          <button
            onClick={() => setActiveMenu('history')}
            className={clsx(
              'font-semibold transition-colors py-4 border-b-[3px]',
              activeMenu === 'history' ? 'text-primary border-primary' : 'text-neutral-grey hover:text-on-surface border-transparent'
            )}
          >
            {t('nav.history')}
          </button>
          <button
            onClick={() => setActiveMenu('management')}
            className={clsx(
              'font-semibold transition-colors py-4 border-b-[3px]',
              activeMenu === 'management' ? 'text-primary border-primary' : 'text-neutral-grey hover:text-on-surface border-transparent'
            )}
          >
            {isAdmin ? t('nav.management') : t('nav.pricing')}
          </button>
          <a
            href="https://xaydungms.vn/#du-an"
            className="font-semibold transition-colors py-4 border-b-[3px] text-neutral-grey hover:text-on-surface border-transparent"
          >
            {t('nav.projects')}
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onNotificationsClick}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full pointer-events-none"></span>
          )}
        </button>
        <button 
          onClick={onSettingsClick}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={() => alert('Tính năng Hỗ trợ đang được phát triển')}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hidden"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button 
          onClick={onUserClick}
          className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden ml-2 border border-outline-variant hover:opacity-80 transition-opacity"
        >
          {user?.photoURL ? (
            <img
              alt={user.displayName || "User profile"}
              className="w-full h-full object-cover"
              src={user.photoURL}
             referrerPolicy="no-referrer"
            />
          ) : (
            <span className="font-bold text-sm text-primary">
              {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
