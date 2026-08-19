import React from 'react';
import { Calendar, Clock, Wrench, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingMetrics({ metrics }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Olive Green Accent (Total Bookings) */}
      <div
        className="p-5 rounded-2xl shadow-sm text-white flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5"
        style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            {t('Total Bookings')}
          </span>
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {metrics.totalBookings}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
          <span className="w-2 h-2 rounded-full bg-white/90" />
          <span>{t('Active & Completed this month')}</span>
        </div>
      </div>

      {/* Card 2: White Card with Timer/Pulse Icon (Pending Dispatch) */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('Pending Dispatch')}
          </span>
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="w-5 h-5 animate-pulse text-amber-500" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {metrics.pendingDispatch}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>{t('Needs technician assignment')}</span>
        </div>
      </div>

      {/* Card 3: White Card with Tool/Gear Icon (In Progress) */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('In Progress')}
          </span>
          <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <Wrench className="w-5 h-5 text-sky-600" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {metrics.inProgress}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-sky-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>{t('Field work underway')}</span>
        </div>
      </div>

      {/* Card 4: White Card with Checkmark Icon (Completed Today) */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('Completed Today')}
          </span>
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {metrics.completedToday}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{t('Finished jobs today')}</span>
        </div>
      </div>
    </div>
  );
}
