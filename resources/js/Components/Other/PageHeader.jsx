import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, Plus } from 'lucide-react';

export default function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actionHref,
  actionLabel = 'Action',
  actionIcon: ActionIcon = Plus,
  action,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={backLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:scale-105 hover:bg-slate-50 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}

        <div className="min-w-0">
          <h1 className="text-[32px] font-bold tracking-tight text-slate-800">{title}</h1>
          {description ? <p className="text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>

      {action ? (
        <div className="shrink-0">{action}</div>
      ) : actionHref ? (
        <Link
          href={actionHref}
          className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ActionIcon className="h-4 w-4" />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
