import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Tag,
  Copy,
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Percent,
  Layers,
  Edit2,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function ExclusiveOfferDetailModal({
  open = false,
  offer = null,
  onClose,
  onEdit,
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

  if (!open || !offer) return null;

  const isActive = Boolean(offer.is_active);

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Tag className="h-4 w-4 text-theme-accent" />
            {t('Offer Details')}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(offer);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {t('Edit')}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Live Banner Card */}
        <div
          className="rounded-2xl p-5 shadow-lg text-white mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${offer.gradient_start || '#3D4127'}, ${offer.gradient_end || '#636B2F'})`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/20 border border-white/30"
              style={{ color: offer.accent_color || '#D4DE95' }}
            >
              <Tag className="w-3 h-3" />
              {offer.badge || 'EXCLUSIVE OFFER'}
            </span>
            <span
              className="text-base font-extrabold"
              style={{ color: offer.accent_color || '#D4DE95' }}
            >
              {offer.discount_text || '30% OFF'}
            </span>
          </div>

          <h4 className="text-xl font-black tracking-tight text-white mb-1">
            {offer.title}
          </h4>
          <p className="text-xs text-white/80 line-clamp-2 mb-4 font-medium">
            {offer.description || 'No description provided.'}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs font-mono font-bold tracking-wider">
              <span>CODE: {offer.code}</span>
              <Copy className="w-3.5 h-3.5 opacity-70" />
            </div>
            <span
              className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-slate-900 shadow-sm"
              style={{ backgroundColor: offer.accent_color || '#D4DE95' }}
            >
              Claim Now
            </span>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              {t('Total Uses')}
            </span>
            <span className="text-lg font-black text-slate-800">
              {offer.usage_count || 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              {t('Usage Limit')}
            </span>
            <span className="text-lg font-black text-slate-800">
              {offer.usage_limit || '∞'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              {t('Min Spend')}
            </span>
            <span className="text-lg font-black text-slate-800">
              {offer.min_spend ? `$${Number(offer.min_spend).toFixed(2)}` : 'None'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              {t('Status')}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-black uppercase px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isActive ? t('Active') : t('Inactive')}
            </span>
          </div>
        </div>

        {/* Date validity & rules */}
        <div className="space-y-3 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="font-bold text-slate-500">{t('Validity Period')}</span>
            <span className="font-semibold text-slate-700">
              {offer.start_date ? new Date(offer.start_date).toLocaleDateString() : 'Immediate'} →{' '}
              {offer.end_date ? new Date(offer.end_date).toLocaleDateString() : 'No expiry'}
            </span>
          </div>

          {offer.terms && (
            <div className="pt-2">
              <span className="font-bold text-slate-500 block mb-1">{t('Terms & Conditions')}</span>
              <p className="text-slate-600 leading-relaxed">{offer.terms}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
