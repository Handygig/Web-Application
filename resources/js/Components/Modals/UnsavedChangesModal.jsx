import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function UnsavedChangesModal({
  open = false,
  onStay,
  onLeave,
}) {
  const { t } = useTranslation();

  if (!open) return null;

  return typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
          onMouseDown={() => onStay && onStay()}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-[100] w-full max-w-md overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900">{t('Unsaved Changes')}</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t('You have unsaved changes on your profile. Are you sure you want to leave without saving?')}
                </p>
              </div>

              <button
                type="button"
                onClick={onStay}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onStay}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                {t('Stay')}
              </button>
              <button
                type="button"
                onClick={onLeave}
                className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95"
              >
                {t('Leave')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
}
