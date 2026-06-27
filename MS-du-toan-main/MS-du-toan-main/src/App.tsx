/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { EstimationProvider, useEstimation } from './context/EstimationContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { EstimationTool } from './pages/EstimationTool';
import { EstimationResult } from './pages/EstimationResult';
import { CalculationHistory } from './pages/CalculationHistory';
import { PriceManagement } from './pages/PriceManagement';
import { FloatingContact } from './components/FloatingContact';
import { Modal } from './components/Modal';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { Bell, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { AuthForms } from './components/AuthForms';

type View = 'estimation' | 'history' | 'management' | 'result';

function AppContent() {
  const [activeMenu, setActiveMenu] = useState<View>('estimation');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme, setTheme, language, setLanguage, t } = useSettings();
  const { user, login, logout, isAdmin } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const { resetEstimation } = useEstimation();

  const handleCalculate = () => {
    setActiveMenu('result');
  };

  const handleNewEstimate = () => {
    resetEstimation();
    setActiveMenu('estimation');
  };

  return (
    <div className="bg-background text-on-background h-screen flex flex-col font-sans overflow-hidden print:h-auto print:overflow-visible">
      <TopBar 
        activeMenu={activeMenu === 'result' ? 'estimation' : activeMenu} 
        setActiveMenu={setActiveMenu} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onUserClick={() => setIsUserMenuOpen(true)}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 flex overflow-hidden print:overflow-visible">
        <Sidebar 
          activeMenu={activeMenu === 'result' ? 'estimation' : activeMenu} 
          setActiveMenu={setActiveMenu} 
          onNewEstimate={handleNewEstimate} 
          onSettingsClick={() => setIsSettingsOpen(true)}
          onSupportClick={() => setIsSupportOpen(true)}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />
        
        <div className="flex-1 overflow-y-auto print:overflow-visible p-4 md:p-8 relative">
          {activeMenu === 'estimation' && <EstimationTool onCalculate={handleCalculate} />}
          {activeMenu === 'result' && <EstimationResult onBack={() => setActiveMenu('estimation')} />}
          {activeMenu === 'management' && <PriceManagement />}
          {activeMenu === 'history' && <CalculationHistory onSelect={() => setActiveMenu('result')} />}
        </div>
      </main>
      
      <FloatingContact />

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t('settings.title')}>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">{t('settings.theme')}</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={theme === 'light'} onChange={() => setTheme('light')} className="text-primary focus:ring-primary h-4 w-4" />
                <span>{t('settings.theme.light')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="text-primary focus:ring-primary h-4 w-4" />
                <span>{t('settings.theme.dark')}</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-outline-variant">
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">{t('settings.language')}</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={language === 'vi'} onChange={() => setLanguage('vi')} className="text-primary focus:ring-primary h-4 w-4" />
                <span>Tiếng Việt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={language === 'en'} onChange={() => setLanguage('en')} className="text-primary focus:ring-primary h-4 w-4" />
                <span>English</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title={t('support.title')}>
        <div className="space-y-4">
          <p className="text-neutral-slate">{t('support.desc')}</p>
          <div className="bg-surface-container rounded-lg p-4 font-medium text-primary flex justify-center">
            Email: hotro@xaydungms.vn
          </div>
        </div>
      </Modal>

      <Modal isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} title={t('auth.title')}>
        <div className="space-y-6">
          {user ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-outline">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                    {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white">{user.displayName || 'User'}</h3>
              <p className="text-neutral-slate mb-2">{user.email}</p>
              {isAdmin && (
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold mb-6">
                  Quản trị viên (Admin)
                </span>
              )}
              <button 
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="w-full py-3 bg-surface-container-high text-primary rounded-lg font-bold hover:bg-surface-container-highest mt-4 transition-colors"
              >
                {t('auth.logout')}
              </button>
            </div>
          ) : (
            <div className="text-left w-full">
              <p className="text-neutral-slate mb-6 text-sm text-center">{t('auth.loginDesc')}</p>
              <AuthForms />
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} title={t('notifications.title')}>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-neutral-slate">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{t('notifications.empty')}</p>
            </div>
          ) : (
            notifications.map(note => (
              <div 
                key={note.id} 
                className={`p-3 rounded-lg border flex gap-3 ${note.read ? 'bg-surface border-outline-variant opacity-70' : 'bg-primary/5 border-primary/20'}`}
              >
                <div className="mt-1">
                  <div className={`w-2 h-2 rounded-full ${note.read ? 'bg-transparent' : 'bg-primary'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-on-surface">{note.message}</p>
                  <p className="text-[10px] text-neutral-slate mt-1">{new Date(note.timestamp).toLocaleString(language === 'en' ? 'en-US' : 'vi-VN')}</p>
                </div>
                {!note.read && (
                  <button 
                    onClick={() => markAsRead(note.id)}
                    className="p-1 hover:bg-surface-container-high rounded self-start"
                  >
                    <X className="w-4 h-4 text-neutral-slate" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <NotificationProvider>
          <EstimationProvider>
            <AppContent />
          </EstimationProvider>
        </NotificationProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
