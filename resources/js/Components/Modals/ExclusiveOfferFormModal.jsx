import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import {
  X,
  Tag,
  Sparkles,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const COLOR_PRESETS = [
  { name: 'Olive Green', start: '#3D4127', end: '#636B2F', accent: '#D4DE95' },
  { name: 'Sage & Olive', start: '#636B2F', end: '#BAC095', accent: '#D4DE95' },
  { name: 'Deep Forest', start: '#1F2414', end: '#3D4127', accent: '#D4DE95' },
  { name: 'Golden Emerald', start: '#2E3D1A', end: '#5B702F', accent: '#F3E5AB' },
];

export default function ExclusiveOfferFormModal({
  open = false,
  offer = null,
  onClose,
}) {
  const { t } = useTranslation();
  const isEditing = Boolean(offer);

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    title: '',
    code: '',
    description: '',
    badge: 'EXCLUSIVE OFFER',
    discount_type: 'percentage',
    discount_value: '30',
    discount_text: '30% OFF',
    min_spend: '',
    max_discount_amount: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
    is_active: true,
    gradient_start: '#3D4127',
    gradient_end: '#636B2F',
    accent_color: '#D4DE95',
    icon_name: 'auto_awesome_rounded',
    terms: '',
  });

  useEffect(() => {
    if (!open) return;
    clearErrors();

    if (offer) {
      setData({
        title: offer.title || '',
        code: offer.code || '',
        description: offer.description || '',
        badge: offer.badge || 'EXCLUSIVE OFFER',
        discount_type: offer.discount_type || 'percentage',
        discount_value: offer.discount_value?.toString() || '',
        discount_text: offer.discount_text || '',
        min_spend: offer.min_spend?.toString() || '',
        max_discount_amount: offer.max_discount_amount?.toString() || '',
        start_date: offer.start_date ? offer.start_date.slice(0, 10) : '',
        end_date: offer.end_date ? offer.end_date.slice(0, 10) : '',
        usage_limit: offer.usage_limit?.toString() || '',
        is_active: Boolean(offer.is_active),
        gradient_start: offer.gradient_start || '#3D4127',
        gradient_end: offer.gradient_end || '#636B2F',
        accent_color: offer.accent_color || '#D4DE95',
        icon_name: offer.icon_name || 'auto_awesome_rounded',
        terms: offer.terms || '',
      });
    } else {
      reset();
    }
  }, [open, offer]);

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route('admin.exclusive-offers.update', offer.id), {
        onSuccess: () => onClose(),
      });
    } else {
      post(route('admin.exclusive-offers.store'), {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleApplyPreset = (preset) => {
    setData((prev) => ({
      ...prev,
      gradient_start: preset.start,
      gradient_end: preset.end,
      accent_color: preset.accent,
    }));
  };

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
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Tag className="h-4 w-4 text-theme-accent" />
            {isEditing ? t('Edit Exclusive Offer') : t('Create Exclusive Offer')}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Mobile Card Preview */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {t('App Banner Preview')}
          </label>
          <div
            className="rounded-2xl p-5 shadow-lg text-white transition-all duration-300 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${data.gradient_start || '#3D4127'}, ${data.gradient_end || '#636B2F'})`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/20 border border-white/30"
                style={{ color: data.accent_color || '#D4DE95' }}
              >
                <Tag className="w-3 h-3" />
                {data.badge || 'EXCLUSIVE OFFER'}
              </span>
              <span
                className="text-base font-extrabold"
                style={{ color: data.accent_color || '#D4DE95' }}
              >
                {data.discount_text || '30% OFF'}
              </span>
            </div>

            <h4 className="text-lg font-extrabold tracking-tight text-white mb-1">
              {data.title || 'Spring Deep Cleaning'}
            </h4>
            <p className="text-xs text-white/80 line-clamp-2 mb-4 font-medium">
              {data.description || 'Complete home sanitization with eco-safe solutions'}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs font-mono font-bold tracking-wider">
                <span>CODE: {data.code || 'CLEAN30'}</span>
                <Copy className="w-3.5 h-3.5 opacity-70" />
              </div>
              <span
                className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-slate-900 shadow-sm"
                style={{ backgroundColor: data.accent_color || '#D4DE95' }}
              >
                Claim Now
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Offer Title')} *
              </label>
              <input
                type="text"
                required
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="e.g. Spring Deep Cleaning"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
              {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Promo Code')} *
              </label>
              <input
                type="text"
                required
                value={data.code}
                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                placeholder="e.g. CLEAN30"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono font-bold tracking-wider uppercase focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
              {errors.code && <p className="mt-1 text-xs text-rose-500">{errors.code}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Badge Text')} *
              </label>
              <input
                type="text"
                required
                value={data.badge}
                onChange={(e) => setData('badge', e.target.value)}
                placeholder="EXCLUSIVE OFFER"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
              {errors.badge && <p className="mt-1 text-xs text-rose-500">{errors.badge}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Discount Type')} *
              </label>
              <select
                value={data.discount_type}
                onChange={(e) => {
                  const type = e.target.value;
                  setData('discount_type', type);
                  if (type === 'percentage') {
                    setData('discount_text', `${data.discount_value}% OFF`);
                  } else {
                    setData('discount_text', `$${data.discount_value} OFF`);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              >
                <option value="percentage">{t('Percentage (%)')}</option>
                <option value="fixed">{t('Fixed Amount ($)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Discount Value')} *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={data.discount_value}
                onChange={(e) => {
                  const val = e.target.value;
                  setData('discount_value', val);
                  if (data.discount_type === 'percentage') {
                    setData('discount_text', `${val}% OFF`);
                  } else {
                    setData('discount_text', `$${val} OFF`);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
              {errors.discount_value && <p className="mt-1 text-xs text-rose-500">{errors.discount_value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Discount Display Text')} *
              </label>
              <input
                type="text"
                required
                value={data.discount_text}
                onChange={(e) => setData('discount_text', e.target.value)}
                placeholder="30% OFF / $50 CASHBACK"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-theme-accent focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
              {errors.discount_text && <p className="mt-1 text-xs text-rose-500">{errors.discount_text}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Minimum Spend ($)')}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={data.min_spend}
                onChange={(e) => setData('min_spend', e.target.value)}
                placeholder="Optional min spend"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              {t('Offer Description')}
            </label>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Short description shown on the banner card..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              {t('Card Gradient & Color Theme')}
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    data.gradient_start === preset.start
                      ? 'border-theme-accent ring-2 ring-theme-accent/20 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{
                      background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                    }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Valid From (Start Date)')}
              </label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t('Valid Until (Expiration Date)')}
              </label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {t('Offer Status')}
              </span>
              <span className="text-xs text-slate-400">
                {data.is_active ? t('Active (Visible to customers)') : t('Inactive (Hidden from app)')}
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData('is_active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-accent"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2.5 rounded-xl bg-theme-accent hover:opacity-90 text-white text-sm font-bold shadow-md transition disabled:opacity-50"
            >
              {processing ? t('Saving...') : isEditing ? t('Update Offer') : t('Create Offer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
