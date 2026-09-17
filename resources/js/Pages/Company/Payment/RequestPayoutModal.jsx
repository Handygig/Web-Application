import React, { useState } from 'react';
import {
  X,
  Wallet,
  Building,
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-accent text-white flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold">{t('Request Revenue Payout')}</h3>
              <p className="text-xs text-white/80">
                {t('Transfer earnings directly to your company bank')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="payout-drawer-form" onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Available Balance Box */}
          <div className="p-4 rounded-2xl bg-[#EBF5EC] border border-emerald-300 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {t('Available Balance')}
              </span>
              <div className="text-2xl font-extrabold text-theme-accent mt-0.5">
                {formattedCurrency(availableBalance)}
              </div>
            </div>
            <span className="text-xs bg-emerald-200 text-emerald-900 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              {t('Cleared for Transfer')}
            </span>
          </div>

          {/* Amount Input & Quick Select Pills */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black block">
              {t('Payout Amount ($ USD)')} <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-extrabold text-slate-400">
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
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
                required
              />
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
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
                className="px-3 py-1.5 bg-[#EBF5EC] hover:bg-emerald-200 text-theme-accent rounded-xl text-xs font-extrabold transition-all"
              >
                {t('Max Available')}
              </button>
            </div>

            {numAmount > availableBalance && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {t('Amount exceeds available cleared balance.')}
              </p>
            )}
          </div>

          {/* Destination Bank Account Picker */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black block">
              {t('Destination Bank Account')} <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              >
                <option value="chase_4821">Chase Business Checking (•••• 4821) - Primary</option>
                <option value="bofa_9012">Bank of America Commercial (•••• 9012)</option>
                <option value="wells_1120">Wells Fargo Operating Account (•••• 1120)</option>
              </select>
            </div>
          </div>

          {/* Transfer Speed Choice */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black block">
              {t('Transfer Speed')} <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutSpeed('standard')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  payoutSpeed === 'standard'
                    ? 'bg-[#EBF5EC] border-theme-accent text-theme-accent shadow-2xs ring-2 ring-theme-accent/30'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">{t('Standard ACH')}</div>
                <div className="text-[11px] opacity-80 mt-1">1-2 Business Days • Free</div>
              </button>

              <button
                type="button"
                onClick={() => setPayoutSpeed('instant')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  payoutSpeed === 'instant'
                    ? 'bg-[#EBF5EC] border-theme-accent text-theme-accent shadow-2xs ring-2 ring-theme-accent/30'
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
        </form>

        {/* Fixed Footer Action Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 sticky bottom-0 z-20 backdrop-blur-md flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            {t('Cancel')}
          </button>
          
          <button
            type="submit"
            form="payout-drawer-form"
            disabled={isInvalid || isSubmitting}
            className="bg-theme-accent hover:bg-theme-accent-hover px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

      </div>
    </div>
  );
}
