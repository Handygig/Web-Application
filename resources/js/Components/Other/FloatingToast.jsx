import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function FloatingToast({
  message,
  type = 'delete_success',
  onClose,
  duration = 3500,
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!message || !onClose) return undefined;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const isDeleteSuccess = type === 'delete_success';
  const isStandardSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
      <div
        className={`w-auto max-w-sm rounded-xl border px-4 py-3 shadow-lg flex items-center justify-between gap-3 bg-white border-slate-200 ${
          isDeleteSuccess
            ? 'text-red-600'
            : isStandardSuccess
              ? 'text-emerald-700'
              : 'text-rose-700'
        }`}
        role="alert"
      >
        <div className="flex items-center gap-3">
          {isDeleteSuccess ? (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-600">
              <X className="w-3.5 h-3.5 text-red-600" />
            </div>
          ) : isStandardSuccess ? (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600">
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
          )}

          <span
            className={`text-sm font-bold ${
              isDeleteSuccess
                ? 'text-red-600'
                : isStandardSuccess
                  ? 'text-emerald-700'
                  : 'text-rose-700'
            }`}
          >
            {typeof message === 'string' ? message : t('Successfully deleted')}
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1 rounded-lg hover:bg-slate-100 transition-colors ml-2"
            aria-label={t('Dismiss')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
