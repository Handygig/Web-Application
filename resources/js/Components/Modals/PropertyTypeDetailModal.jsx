import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Building2,
  Home,
  Hotel,
  Briefcase,
  Layers,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  Power,
  Building,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const ICON_MAP = {
  Apartment: Building2,
  House: Home,
  Villa: Home,
  Hotel: Hotel,
  Office: Briefcase,
  Commercial: Building,
  Default: Layers,
};

export default function PropertyTypeDetailModal({
  open = false,
  propertyType = null,
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

  if (!open || !propertyType) return null;

  const IconComp = ICON_MAP[propertyType.name] || ICON_MAP[propertyType.icon] || ICON_MAP.Default;
  const isActive = propertyType.status === 'Active' || propertyType.status === 'active';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-2xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Layers className="h-4 w-4 text-theme-accent" />
            {t('Property Type Details')}
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

        {/* Property Type Banner Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-md ring-4 ring-white">
              <IconComp className="h-8 w-8" />
            </div>

            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-bold text-slate-900">{propertyType.name}</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {isActive ? t('Active') : t('Inactive')}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-mono">
                <span>{propertyType.code || `PT-${propertyType.id}`}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 font-sans">
                  {propertyType.properties_count || 0} {t('Properties')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(propertyType);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              {t('Edit')}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onToggleActive) onToggleActive(propertyType);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-2xs transition ${
                isActive
                  ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              {isActive ? t('Deactivate') : t('Activate')}
            </button>
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="space-y-6">
          {/* Description */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t('Description')}</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {propertyType.description || t('No detailed description available for this property type.')}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Created Date')}
              </span>
              <span className="font-semibold text-slate-800 text-sm">{propertyType.created_at || 'Jan 15, 2025'}</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Last Updated')}
              </span>
              <span className="font-semibold text-slate-800 text-sm">{propertyType.updated_at || 'Aug 14, 2026'}</span>
            </div>
          </div>

          {/* Sample Associated Properties */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Assigned Platform Properties')}</h4>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {propertyType.properties_count || 0}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {(propertyType.sampleProperties || [
                { name: 'Grand Skyview Heights', location: 'Downtown, NY', status: 'Available' },
                { name: 'Pinecrest Luxury Residences', location: 'Brooklyn, NY', status: 'Available' },
                { name: 'Sunset Palms Complex', location: 'Miami, FL', status: 'Rented' },
              ]).map((prop, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-slate-800 block">{prop.name}</span>
                    <span className="text-slate-400 text-[11px]">{prop.location}</span>
                  </div>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {prop.status}
                  </span>
                </div>
              ))}
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
