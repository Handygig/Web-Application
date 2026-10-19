import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import { X, HelpCircle, Layers, Hash, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import TextInput from '@/Components/Inputs/TextInput';
import TextAreaInput from '@/Components/Inputs/TextAreaInput';

const CATEGORY_SUGGESTIONS = [
  'General',
  'Booking',
  'Payments',
  'Safety & Verification',
  'Service & Safety',
  'Emergency',
];

export default function FaqFormModal({
  open = false,
  faq = null,
  existingCategories = [],
  onClose,
}) {
  const { t } = useTranslation();
  const isEditing = Boolean(faq);

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    question: '',
    answer: '',
    category: 'General',
    order: '1',
    is_active: true,
  });

  const availableCategories = Array.from(
    new Set([...CATEGORY_SUGGESTIONS, ...(existingCategories || [])])
  ).filter(Boolean);

  useEffect(() => {
    if (!open) return;
    clearErrors();

    if (faq) {
      setData({
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'General',
        order: faq.order !== undefined && faq.order !== null ? String(faq.order) : '1',
        is_active: Boolean(faq.is_active),
      });
    } else {
      reset({
        question: '',
        answer: '',
        category: 'General',
        order: '1',
        is_active: true,
      });
    }
  }, [open, faq]);

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
      put(route('admin.faqs.update', faq.id), {
        onSuccess: () => onClose(),
      });
    } else {
      post(route('admin.faqs.store'), {
        onSuccess: () => onClose(),
      });
    }
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
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0f4a2d]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? t('Edit FAQ') : t('Create New FAQ')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Configure question, answer, category and display order for customer app.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wider mb-1.5">
              {t('Question')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="faq-question"
              rows={2}
              required
              value={data.question}
              onChange={(e) => setData('question', e.target.value)}
              placeholder={t('e.g. How do I book a home maintenance service?')}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0f4a2d] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f4a2d] transition-all resize-none ${
                errors.question ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.question && (
              <span className="text-xs text-red-500 mt-1 block font-medium">
                {errors.question}
              </span>
            )}
          </div>

          {/* Category & Order in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wider mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  {t('Category')}
                </span>{' '}
                <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="faq-category"
                required
                value={data.category}
                onChange={(e) => setData('category', e.target.value)}
                placeholder={t('e.g. Booking, Payments, Safety')}
                error={errors.category}
              />
              {/* Category suggestion chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setData('category', cat)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                      data.category === cat
                        ? 'bg-[#0f4a2d] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Order & Active status */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 tracking-wider mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                    {t('Display Priority / Order')}
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={data.order}
                  onChange={(e) => setData('order', e.target.value)}
                  placeholder="1"
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f4a2d] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0f4a2d] transition-all ${
                    errors.order ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {t('Lower numbers appear first in the customer app.')}
                </span>
                {errors.order && (
                  <span className="text-xs text-red-500 mt-1 block font-medium">
                    {errors.order}
                  </span>
                )}
              </div>

              {/* Active Toggle Switch */}
              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f4a2d] relative" />
                  <span className="text-xs font-semibold text-slate-700">
                    {data.is_active ? t('Active (Visible to users)') : t('Inactive (Draft/Hidden)')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Answer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wider mb-1.5">
              {t('Answer')} <span className="text-red-500">*</span>
            </label>
            <TextAreaInput
              id="faq-answer"
              rows={4}
              required
              value={data.answer}
              onChange={(e) => setData('answer', e.target.value)}
              placeholder={t('Provide a clear, detailed, and helpful answer...')}
              error={errors.answer}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2.5 rounded-xl bg-[#0f4a2d] text-sm font-semibold text-white shadow-sm hover:bg-[#0c3c24] active:scale-95 transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {processing && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{isEditing ? t('Save Changes') : t('Create FAQ')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
