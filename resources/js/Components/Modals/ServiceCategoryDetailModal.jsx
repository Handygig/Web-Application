import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Wrench,
  Layers,
  Edit2,
  Calendar,
  Briefcase,
  Users,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function ServiceCategoryDetailModal({
  open = false,
  category = null,
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

  if (!open || !category) return null;

  const isActive = Boolean(category.is_active);

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
            <Layers className="h-4 w-4 text-theme-accent" />
            {t('Service Category Details')}
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
        <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-100 mb-6">
          <div className="flex items-center gap-4 min-w-0">
            {category.image_url ? (
              <img
                src={category.image_url}
                alt={category.service_name || category.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-md ring-4 ring-white border border-slate-100 bg-white"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-md ring-4 ring-white">
                <Layers className="h-7 w-7" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 truncate">
                  {category.service_name || category.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                  />
                  {isActive ? t('Active') : t('Inactive')}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-400">
                {category.code || `CAT-${category.id}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(category);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              {t('Edit Category')}
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
              {category.description || t('No description provided for this service category.')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Wrench className="h-3.5 w-3.5" />
                {t('Services')}
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {category.servicesCount ?? category.services_count ?? 0}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Users className="h-3.5 w-3.5" />
                {t('Providers')}
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {category.providersCount ?? 0}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Briefcase className="h-3.5 w-3.5" />
                {t('Requests')}
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {category.jobRequestsCount ?? 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Category ID')}
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {category.code || `CAT-${category.id}`}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Calendar className="h-3.5 w-3.5" />
                {t('Created Date')}
              </div>
              <span className="font-semibold text-slate-800 text-sm">
                {category.createdDate || category.created_at || '-'}
              </span>
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
