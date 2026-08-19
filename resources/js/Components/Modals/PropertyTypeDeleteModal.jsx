import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Trash2, Power, Building2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PropertyTypeDeleteModal({
  open = false,
  propertyType = null,
  onClose,
  onConfirmDelete,
  onDeactivateInstead,
  processing = false,
}) {
  const { t } = useTranslation();

  if (!open || !propertyType) return null;

  const count = propertyType.properties_count || 0;
  const isUsed = count > 0;

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
            {isUsed ? (
              /* Blocked Deletion View */
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
                    <AlertTriangle className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900">{t('Cannot Delete Property Type')}</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {t('This property type cannot be deleted because it is currently being used by')}{' '}
                      <span className="font-bold text-slate-900">{count} {t('existing properties')}</span>.
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

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  {t('To prevent breaking property relationships, you can deactivate this property type instead. Inactive types will not appear when creating new properties.')}
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
                    onClick={() => {
                      if (onDeactivateInstead) onDeactivateInstead(propertyType);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
                  >
                    <Power className="h-4 w-4" />
                    {t('Deactivate Property Type')}
                  </button>
                </div>
              </div>
            ) : (
              /* Allowed Deletion View */
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
                    <Trash2 className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900">{t('Delete Property Type?')}</h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {t('Are you sure you want to permanently delete')} <span className="font-semibold text-slate-800">{propertyType.name}</span>? {t('This action cannot be undone.')}
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
                    onClick={() => {
                      if (onConfirmDelete) onConfirmDelete(propertyType);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('Delete')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )
    : null;
}
