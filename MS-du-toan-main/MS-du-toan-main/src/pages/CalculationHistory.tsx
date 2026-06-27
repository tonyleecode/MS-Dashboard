import React from 'react';
import { useEstimation } from '../context/EstimationContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Clock, Eye, Trash2, Home, LogIn } from 'lucide-react';

interface CalculationHistoryProps {
  onSelect: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({ onSelect }) => {
  const { savedEstimations, deleteEstimation, loadEstimation } = useEstimation();
  const { user, login } = useAuth();
  const { t } = useSettings();

  const handleLoad = (id: string) => {
    loadEstimation(id);
    onSelect();
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-h1 text-3xl font-bold text-primary">{t('history.title')}</h1>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <LogIn className="w-16 h-16 text-outline mb-4" />
          <h3 className="font-h3 text-xl font-bold text-primary mb-2">{t('auth.title')}</h3>
          <p className="text-neutral-slate mb-6">{t('auth.loginDesc')}</p>
          <button 
            onClick={login}
            className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90 flex items-center gap-2"
          >
            {t('auth.login')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-h1 text-3xl font-bold text-primary">{t('history.title')}</h1>
        </div>
      </div>

      {savedEstimations.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <Clock className="w-16 h-16 text-outline mb-4" />
          <h3 className="font-h3 text-xl font-bold text-primary mb-2">{t('history.empty')}</h3>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container font-label-caps text-[11px] font-bold text-neutral-slate uppercase">
                <th className="p-4 border-b border-outline-variant">{t('history.col.name')}</th>
                <th className="p-4 border-b border-outline-variant">{t('history.col.date')}</th>
                <th className="p-4 border-b border-outline-variant text-right">{t('history.col.area')}</th>
                <th className="p-4 border-b border-outline-variant text-right">{t('history.col.cost')}</th>
                <th className="p-4 border-b border-outline-variant text-center"></th>
              </tr>
            </thead>
            <tbody className="font-data-tabular">
              {savedEstimations.map((est) => (
                <tr key={est.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-primary">{est.projectName}</div>
                    <div className="text-xs text-neutral-slate">{est.id}</div>
                  </td>
                  <td className="p-4 text-neutral-slate">{new Date(est.date).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4 text-right font-medium">{est.totalArea.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-secondary">{est.totalCost.toLocaleString('vi-VN')}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleLoad(est.id)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn xoá dự toán này?')) {
                            deleteEstimation(est.id);
                          }
                        }}
                        className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                        title={t('history.action.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
