import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function StatCard({
  icon: Icon,
  label,
  value,
  badgeText,
  badgeBgClass = 'bg-indigo-50 text-indigo-700',
  iconBgClass = 'bg-indigo-50',
  iconColorClass = 'text-theme-accent',
  onDetailsClick,
}) {
  const { t } = useTranslation();

  return (
    <div className="group relative flex flex-col justify-between rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top Header Row: Label & Badge or Icon */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-semibold text-slate-400 font-sans tracking-tight">
          {label}
        </span>
        {badgeText ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${badgeBgClass}`}
          >
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
            {badgeText}
          </span>
        ) : Icon ? (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${iconBgClass} ${iconColorClass}`}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        ) : null}
      </div>

      {/* Main Metric Row: Large Value & Details link */}
      <div className="flex items-end justify-between gap-3 mt-1">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          {value}
        </span>
        {onDetailsClick && (
          <button
            type="button"
            onClick={onDetailsClick}
            className="inline-flex items-center gap-0.5 text-xs font-bold text-theme-accent hover:underline group-hover:translate-x-0.5 transition-transform"
          >
            <span>{t('Details')}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
