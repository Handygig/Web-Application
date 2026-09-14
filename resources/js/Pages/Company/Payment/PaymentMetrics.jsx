import React from 'react';
import { DollarSign, Wallet, Receipt, Percent } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import StatCard from '@/Components/Cards/StatCard';

export default function PaymentMetrics({ metrics }) {
  const { t } = useTranslation();

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <StatCard
        icon={DollarSign}
        label={t('Total Net Revenue')}
        value={formattedCurrency(metrics?.netRevenue ?? 32450.0)}
        iconBgClass="bg-indigo-50"
        iconColorClass="text-theme-accent"
        ringClass="ring-indigo-50/50"
      />

      <StatCard
        icon={Wallet}
        label={t('Pending Payouts')}
        value={formattedCurrency(metrics?.pendingPayouts ?? 4820.0)}
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
        ringClass="ring-amber-50/50"
      />

      <StatCard
        icon={Receipt}
        label={t('Disbursed to Techs')}
        value={formattedCurrency(metrics?.disbursedToTechs ?? 18240.0)}
        iconBgClass="bg-emerald-50"
        iconColorClass="text-emerald-600"
        ringClass="ring-emerald-50/50"
      />

      <StatCard
        icon={Percent}
        label={t('Platform Fees')}
        value={formattedCurrency(metrics?.platformFees ?? 3605.0)}
        iconBgClass="bg-purple-50"
        iconColorClass="text-purple-600"
        ringClass="ring-purple-50/50"
      />
    </div>
  );
}
