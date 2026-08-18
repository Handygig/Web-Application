import React from 'react';
import { AlertCircle, Clock, CheckCircle2, XCircle, Wrench, Zap, Flame, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export function StatusBadge({ status }) {
  const { t } = useTranslation();

  switch (status) {
    case 'pending_dispatch':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          {t('Urgent Dispatch')}
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          {t('In Progress')}
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          {t('Scheduled')}
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EC] text-[#2F4F2F] border border-[#C6E2CB] shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" />
          {t('Completed')}
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-xs">
          <XCircle className="w-3.5 h-3.5 text-slate-400" />
          {t('Cancelled')}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}

export function UrgencyBadge({ urgency }) {
  const { t } = useTranslation();

  if (urgency === 'Emergency') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
        <Flame className="w-3 h-3 text-rose-600 fill-rose-500" />
        {t('Emergency')}
      </span>
    );
  }
  if (urgency === 'High') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
        <Zap className="w-3 h-3 text-orange-600" />
        {t('High Priority')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
      {t('Standard')}
    </span>
  );
}

export function CategoryBadge({ category }) {
  switch (category?.toLowerCase()) {
    case 'plumbing':
      return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">Plumbing</span>;
    case 'hvac':
      return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">HVAC</span>;
    case 'electrical':
      return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Electrical</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{category}</span>;
  }
}
