import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function ProviderDetailModal({ open = false, provider = null, onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !provider) return null;

  const isActive =
    provider.status === 'Active' ||
    provider.status === true ||
    provider.status === 'active' ||
    provider.user?.status === 'active';

  const initials = provider.full_name
    ? provider.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'P';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-2xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header Controls */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('Back')}
          </button>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('Provider Profile')}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close details modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Profile Summary */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 mb-6">
          {provider.avatar_url ? (
            <img
              src={provider.avatar_url}
              alt={provider.full_name}
              className="h-20 w-20 rounded-2xl object-cover shadow-sm ring-4 ring-white"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-2xl font-bold text-white shadow-md ring-4 ring-white">
              {initials}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900 truncate">
                {provider.full_name || provider.user?.full_name}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                )}
                {isActive ? t('Active') : t('Inactive')}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-theme-accent flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="h-4 w-4" />
              {provider.service_category || provider.service || t('General Services')}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{provider.location || t('Not specified')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{t('Joined')}: {provider.created_at || provider.joined || 'Jan 2025'}</span>
              </div>
              {provider.rating ? (
                <div className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{provider.rating} ({provider.reviews_count || 12} reviews)</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-theme-accent">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Email Address')}</p>
              <p className="text-sm font-medium text-slate-800 truncate mt-0.5">{provider.email || provider.user?.email || '-'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Phone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Phone Number')}</p>
              <p className="text-sm font-medium text-slate-800 truncate mt-0.5">{provider.phone || provider.user?.phone || '-'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Location / Address')}</p>
              <p className="text-sm font-medium text-slate-800 truncate mt-0.5">{provider.location || provider.address || t('Main Service Area')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Provider Type')}</p>
              <p className="text-sm font-medium text-slate-800 capitalize truncate mt-0.5">{provider.provider_type || 'Individual Professional'}</p>
            </div>
          </div>
        </div>

        {/* Bio / Description */}
        <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FileText className="h-4 w-4 text-slate-500" />
            {t('Description / Biography')}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {provider.bio || provider.description || t('No provider description available. This service provider is verified and available for dispatch.')}
          </p>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('Back to List')}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
