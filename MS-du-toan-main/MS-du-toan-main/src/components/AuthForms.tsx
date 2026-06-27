import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const AuthForms: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithEmail, registerWithEmail } = useAuth();
  const { t } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginView) {
        await loginWithEmail(email, password);
      } else {
        if (!fullName.trim()) {
          setError('Vui lòng nhập họ tên');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, fullName);
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại');
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 border-b border-outline-variant mb-6 pb-2">
        <button
          className={`font-bold transition-colors ${isLoginView ? 'text-primary border-b-2 border-primary' : 'text-neutral-slate hover:text-on-surface'}`}
          onClick={() => { setIsLoginView(true); setError(''); }}
        >
          Đăng nhập
        </button>
        <button
          className={`font-bold transition-colors ${!isLoginView ? 'text-primary border-b-2 border-primary' : 'text-neutral-slate hover:text-on-surface'}`}
          onClick={() => { setIsLoginView(false); setError(''); }}
        >
          Đăng ký
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginView && (
          <div>
            <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-1">HỌ VÀ TÊN</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary font-body-md"
              placeholder="Vd: Nguyễn Văn A"
              required={!isLoginView}
            />
          </div>
        )}
        <div>
          <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-1">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface border border-outline rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary font-body-md"
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <label className="font-label-caps text-[11px] font-bold text-neutral-grey block mb-1">MẬT KHẨU</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface border border-outline rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary font-body-md"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký')}
        </button>
      </form>

      <div className="relative mt-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface text-neutral-slate">Hoặc</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-3 bg-surface-container-high text-on-surface rounded-lg font-bold hover:bg-surface-container-highest flex items-center justify-center gap-2 border border-outline-variant transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {t('auth.login')}
      </button>
    </div>
  );
};
