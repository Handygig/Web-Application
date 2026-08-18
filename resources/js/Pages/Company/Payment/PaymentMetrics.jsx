import React from 'react';
import { DollarSign, Wallet, Receipt, Percent, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PaymentMetrics({ metrics }) {
  const { t } = useTranslation();

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Olive Green Accent (Total Net Revenue / Available Balance) */}
      <div
        className="p-5 rounded-2xl shadow-sm text-white flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            {t('Total Net Revenue / Available')}
          </span>
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formattedCurrency(metrics?.netRevenue ?? 32450.00)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +12.5% {t('Gross Earnings')}
          </span>
          <span className="text-xs text-white/80 font-medium">{t('Ready for payout')}</span>
        </div>
      </div>

      {/* Card 2: White Card with Wallet/Cash Icon (Pending Payouts / In Escrow) */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('Pending Payouts / In Escrow')}
          </span>
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Wallet className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {formattedCurrency(metrics?.pendingPayouts ?? 4820.00)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {t('Ready for automated bank transfer')}
          </span>
        </div>
      </div>

      {/* Card 3: White Card with Receipt/Invoice Icon (Total Disbursed to Techs) */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('Total Disbursed to Techs')}
          </span>
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Receipt className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {formattedCurrency(metrics?.disbursedToTechs ?? 18240.00)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-[#EBF5EC] border border-emerald-200/70 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('Field staff payouts completed')}
          </span>
        </div>
      </div>

      {/* Card 4: White Card with Percent/Tag Icon (Platform Fee Deductions) */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('Platform Fee Deductions')}
          </span>
          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Percent className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {formattedCurrency(metrics?.platformFees ?? 3605.00)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2.5 py-1 rounded-full font-medium">
            10% {t('Platform Commission')}
          </span>
          <span className="text-xs text-slate-500 font-medium">{t('All gateway fees accounted')}</span>
        </div>
      </div>
    </div>
  );
}
