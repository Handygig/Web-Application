import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PendingKycQueue({ items = [] }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 h-full flex flex-col">
      {/* Clean Header matching Revenue Overview Tile */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {t('Pending KYC Queue')}
          </h3>
        </div>

        <Link
          href={route('admin.providers.kyc')}
          className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <span>{t('View all')}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Queue Items List */}
      <div className="space-y-1 flex-1">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {t('No pending KYC verifications')}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-3 p-2.5 -mx-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-100/60 flex items-center justify-center text-emerald-800 shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#0f4a2d]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-s font-semibold text-slate-900 truncate">
                      {item.provider}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2 text-[14px] text-slate-400 mt-0.5 truncate">
                    <span className="truncate text-slate-500 font-medium">{item.type}</span>
                    <span>•</span>
                    <span className="shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={route('admin.providers.kyc')}
                className="px-3 py-1.5 text-xs font-semibold text-[#0f4a2d] bg-emerald-50/80 hover:bg-[#0f4a2d] hover:text-white rounded-xl border border-emerald-200/50 transition shadow-2xs shrink-0"
              >
                {t('Review')}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
