import React from 'react';
import { Tag, Clock, Wrench, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import StatCard from '@/Components/Cards/StatCard';

export default function BookingMetrics({ metrics, onFilterSelect }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Tag}
        label={t('Total Bookings')}
        value={metrics.totalBookings.toLocaleString()}
        badgeText="+12%"
        badgeBgClass="bg-indigo-100/70 text-indigo-700"
        onDetailsClick={onFilterSelect ? () => onFilterSelect('all') : undefined}
      />

      <StatCard
        icon={Clock}
        label={t('Pending Dispatch')}
        value={metrics.pendingDispatch.toLocaleString()}
        badgeText={t('Action')}
        badgeBgClass="bg-amber-100/70 text-amber-700"
        onDetailsClick={onFilterSelect ? () => onFilterSelect('pending_dispatch') : undefined}
      />

      <StatCard
        icon={Wrench}
        label={t('In Progress')}
        value={metrics.inProgress.toLocaleString()}
        badgeText={t('Active')}
        badgeBgClass="bg-sky-100/70 text-sky-700"
        onDetailsClick={onFilterSelect ? () => onFilterSelect('in_progress') : undefined}
      />

      <StatCard
        icon={CheckCircle2}
        label={t('Completed Today')}
        value={metrics.completedToday.toLocaleString()}
        badgeText="100%"
        badgeBgClass="bg-emerald-100/70 text-emerald-700"
        onDetailsClick={onFilterSelect ? () => onFilterSelect('completed') : undefined}
      />
    </div>
  );
}

