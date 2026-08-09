import React from 'react';

export default function EmptyState({ icon: Icon, title, description, className = '' }) {
  return (
    <div
      className={`flex min-h-[320px] items-center justify-center rounded-[12px] border border-dashed border-slate-200 bg-white/40 px-6 py-14 text-center ${className}`}
    >
      <div className="max-w-md space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-theme-accent shadow-sm ring-1 ring-slate-100">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
