import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function ClearFiltersButton({ onClick, className = '' }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-[4px] border border-[#7A7E884D] bg-transparent px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm hover:border-slate-400 active:scale-95 ${className}`}
    >
      <RotateCcw className="h-4 w-4 text-slate-500" />
      <span>{t('Clear Filters')}</span>
    </button>
  );
}
