import React from 'react';
import { Tag, Clock, Wrench, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import StatCard from '@/Components/Cards/StatCard';

export default function BookingMetrics({ metrics }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <StatCard
        icon={Tag}
        label={t('Total Bookings')}
        value={metrics.totalBookings.toLocaleString()}
        iconBgClass="bg-indigo-50"
        iconColorClass="text-theme-accent"
        ringClass="ring-indigo-50/50"
      />

      <StatCard
        icon={Clock}
        label={t('Pending Dispatch')}
        value={metrics.pendingDispatch.toLocaleString()}
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
        ringClass="ring-amber-50/50"
      />

      <StatCard
        icon={Wrench}
        label={t('In Progress')}
        value={metrics.inProgress.toLocaleString()}
        iconBgClass="bg-sky-50"
        iconColorClass="text-sky-600"
        ringClass="ring-sky-50/50"
      />

      <StatCard
        icon={CheckCircle2}
        label={t('Completed Today')}
        value={metrics.completedToday.toLocaleString()}
        iconBgClass="bg-emerald-50"
        iconColorClass="text-emerald-600"
        ringClass="ring-emerald-50/50"
      />
    </div>
  );
}
