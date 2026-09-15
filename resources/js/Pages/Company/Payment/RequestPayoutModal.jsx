import React, { useState } from 'react';
import {
  X,
  Wallet,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function RequestPayoutModal({
  isOpen,
  onClose,
  availableBalance = 32450.0,
  onSubmitPayout,
}) {
  const { t } = useTranslation();
  const [payoutAmount, setPayoutAmount] = useState('5000');
  const [selectedBank, setSelectedBank] = useState('chase_4821');
  const [payoutSpeed, setPayoutSpeed] = useState('standard'); // 'standard' (ACH), 'instant'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const numAmount = parseFloat(payoutAmount) || 0;
  const isInvalid = numAmount <= 0 || numAmount > availableBalance;

  const handleQuickSelect = (val) => {
    if (val === 'max') {
      setPayoutAmount(availableBalance.toString());
    } else {
      setPayoutAmount(val.toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitPayout({
        amount: numAmount,
        bank: selectedBank,
        speed: payoutSpeed,
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#5E6933] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">{t('Request Revenue Payout')}</h3>
              <p className="text-xs text-white/80">
                {t('Transfer earnings directly to your company bank')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-800 text-sm">
          {/* Available Balance Box */}
          <div className="p-4 rounded-2xl bg-[#EBF5EC] border border-emerald-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {t('Available Balance')}
              </span>
              <div className="text-2xl font-extrabold text-[#5E6933]">
                {formattedCurrency(availableBalance)}
              </div>
            </div>
            <span className="text-xs bg-emerald-200 text-emerald-900 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              {t('Cleared for Transfer')}
            </span>
          </div>

          {/* Amount Input & Quick Select Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Payout Amount ($USD)')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                max={availableBalance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5E6933]/20 focus:border-[#5E6933]"
                required
              />
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickSelect(1000)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
              >
                +$1,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(5000)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
              >
                +$5,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(10000)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
              >
                +$10,000
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('max')}
                className="px-3 py-1.5 bg-[#EBF5EC] hover:bg-emerald-200 text-[#5E6933] rounded-xl text-xs font-extrabold transition-all"
              >
                {t('Max Available')}
              </button>
            </div>

            {numAmount > availableBalance && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {t('Amount exceeds available cleared balance.')}
              </p>
            )}
          </div>

          {/* Destination Bank Account Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Destination Bank Account')}
            </label>
            <div className="relative">
              <Building className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5E6933]/20 focus:border-[#5E6933]"
              >
                <option value="chase_4821">Chase Business Checking (•••• 4821) - Primary</option>
                <option value="bofa_9012">Bank of America Commercial (•••• 9012)</option>
                <option value="wells_1120">Wells Fargo Operating Account (•••• 1120)</option>
              </select>
            </div>
          </div>

          {/* Transfer Speed Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Transfer Speed')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutSpeed('standard')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  payoutSpeed === 'standard'
                    ? 'bg-[#EBF5EC] border-[#5E6933] text-[#5E6933]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">{t('Standard ACH')}</div>
                <div className="text-[11px] opacity-80 mt-1">1-2 Business Days • Free</div>
              </button>

              <button
                type="button"
                onClick={() => setPayoutSpeed('instant')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  payoutSpeed === 'instant'
                    ? 'bg-[#EBF5EC] border-[#5E6933] text-[#5E6933]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {t('Instant Transfer')}
                </div>
                <div className="text-[11px] opacity-80 mt-1">Within 30 Mins • 1% Fee</div>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={isInvalid || isSubmitting}
              className="px-6 py-2.5 bg-[#5E6933] hover:bg-[#4d5729] text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>{t('Processing Transfer...')}</span>
              ) : (
                <>
                  <span>{t('Confirm Payout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
