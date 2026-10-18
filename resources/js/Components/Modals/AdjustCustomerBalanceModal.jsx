import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import { X, Award, DollarSign, PlusCircle, MinusCircle, User } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function AdjustCustomerBalanceModal({
  open = false,
  customer = null,
  onClose,
}) {
  const { t } = useTranslation();

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    adjustment_type: 'points',
    operation: 'add',
    amount: '100',
    reason: '',
  });

  useEffect(() => {
    if (!open) return;
    clearErrors();
    reset();
  }, [open, customer]);

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
    post(route('admin.rewards.customers.adjust', customer.id), {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  const modalContent = (
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
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Award className="h-4 w-4 text-theme-accent" />
            {t('Adjust Customer Balance')}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customer Badge */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-slate-800 block">
              {customer.user?.full_name || customer.user?.name || 'Customer'}
            </span>
            <span className="text-xs text-slate-400 block">
              {customer.user?.email || customer.user?.phone}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-700">
              {customer.reward_points} <span className="text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-xs font-extrabold text-theme-accent">
              ${Number(customer.wallet_balance || 0).toFixed(2)}{' '}
              <span className="text-slate-400 font-normal">credits</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              {t('Balance Type')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setData('adjustment_type', 'points')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  data.adjustment_type === 'points'
                    ? 'border-theme-accent bg-theme-accent/5 text-theme-accent'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Award className="w-4 h-4" />
                {t('Reward Points')}
              </button>
              <button
                type="button"
                onClick={() => setData('adjustment_type', 'wallet')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  data.adjustment_type === 'wallet'
                    ? 'border-theme-accent bg-theme-accent/5 text-theme-accent'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                {t('Wallet Credits ($)')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              {t('Operation')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setData('operation', 'add')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  data.operation === 'add'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                {t('Add / Award')}
              </button>
              <button
                type="button"
                onClick={() => setData('operation', 'deduct')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  data.operation === 'deduct'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <MinusCircle className="w-4 h-4" />
                {t('Deduct / Debit')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              {data.adjustment_type === 'points' ? t('Points Amount') : t('Credit Amount ($)')} *
            </label>
            <input
              type="number"
              step={data.adjustment_type === 'points' ? '1' : '0.01'}
              min="1"
              required
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
            />
            {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              {t('Reason / Notes (Audit Log)')} *
            </label>
            <textarea
              rows={2}
              required
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
              placeholder="e.g. Compensation for delay / Loyalty promotion bonus"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
            />
            {errors.reason && <p className="mt-1 text-xs text-rose-500">{errors.reason}</p>}
          </div>

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
              {processing ? t('Saving...') : t('Apply Adjustment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
