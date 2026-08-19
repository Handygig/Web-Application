import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PauseCircle, FileText } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function CustomerSuspendModal({
  open = false,
  customer = null,
  onClose,
  onConfirm,
  processing = false,
}) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setErrorText('');
    }
  }, [open]);

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !customer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorText(t('Please provide a reason for suspending this account.'));
      return;
    }
    setErrorText('');
    if (onConfirm) {
      onConfirm(reason.trim());
    }
  };

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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
                <PauseCircle className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900">{t('Suspend Customer Account?')}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {t('Are you sure you want to suspend this customer\'s account?')} <span className="font-semibold text-slate-800">{customer.full_name}</span> {t('will temporarily lose account access.')}
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

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Suspension Reason')} *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (errorText) setErrorText('');
                    }}
                    placeholder={t('Enter the reason for suspending this customer account...')}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
                {errorText && <p className="mt-1 text-xs font-medium text-red-500">{errorText}</p>}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
                >
                  <PauseCircle className="h-4 w-4" />
                  {t('Suspend Account')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
}
