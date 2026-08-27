import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconBgClass = 'bg-indigo-50',
  iconColorClass = 'text-theme-accent',
  ringClass = 'ring-indigo-50/50',
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBgClass} ${iconColorClass} ring-4 ${ringClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
