import { useTranslation } from 'react-i18next';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const { t } = useTranslation();

  const bgColors = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 min-w-75 max-w-sm px-4 py-3 rounded-xl shadow-lg text-white font-medium animate-slide-up text-center ${bgColors[type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2 text-center w-full">
        <span>{icons[type]}</span>
        <span className="flex-1 text-center">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white transition"
          aria-label={t('common.close', { defaultValue: 'Chiudi' })}
        >
          ✕
        </button>
      </div>
    </div>
  );
}