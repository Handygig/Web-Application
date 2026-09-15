import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserCheck, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function UnbanConfirmModal({
  open = false,
  account = null,
  onClose,
  onConfirm,
  processing = false,
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !account) return null;

  return typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
          onMouseDown={() => onClose && onClose()}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-[100] w-full max-w-md overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
                <UserCheck className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900">{t('Unban Account?')}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {t(
                    'Are you sure you want to unban this account? The user will regain access to the platform.'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t('Account Name')}:</span>
                <span className="font-bold text-slate-800">{account.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t('Email Address')}:</span>
                <span className="font-semibold text-slate-800">{account.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t('Ban Type')}:</span>
                <span className="font-semibold text-slate-800">{account.banType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{t('Original Reason')}:</span>
                <span className="font-semibold text-red-600 truncate max-w-[180px]">
                  {account.reason}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                {t('Cancel')}
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={onConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                <UserCheck className="h-4 w-4" />
                {t('Unban Account')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
