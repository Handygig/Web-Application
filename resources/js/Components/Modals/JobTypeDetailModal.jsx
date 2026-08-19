import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Briefcase, Clock, Calendar, CheckCircle2, XCircle, Edit2, Power } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function JobTypeDetailModal({
  open = false,
  jobType = null,
  onClose,
  onEdit,
  onToggleActive,
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

  if (!open || !jobType) return null;

  const isActive = jobType.status === 'Active' || jobType.status === 'active';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-lg overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Briefcase className="h-4 w-4 text-theme-accent" />
            {t('Job Type Details')}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Banner Card */}
        <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-100 mb-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-md ring-4 ring-white">
              <Briefcase className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 truncate">{jobType.name}</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {isActive ? t('Active') : t('Inactive')}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-400">{jobType.code || `JT-${jobType.id}`}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(jobType);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              {t('Edit Job Type')}
            </button>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-1">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t('Description')}
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              {jobType.description || t('No description provided for this job type.')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Job Type ID')}
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">{jobType.code || `JT-${jobType.id}`}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Created Date')}
              </span>
              <span className="font-semibold text-slate-800 text-sm">{jobType.createdDate || jobType.created_at || 'Jan 10, 2025'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
