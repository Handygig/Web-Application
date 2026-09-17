import React from 'react';
import {
  Search,
  CreditCard,
  Calendar,
  ChevronDown,
  LayoutGrid,
  List,
  RefreshCw,
  X,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PaymentFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  dateFilter,
  setDateFilter,
  onExportCSV,
  onResetFilters,
}) {
  const { t } = useTranslation();

  const hasActiveFilters =
    searchTerm !== '' || statusFilter !== 'all' || methodFilter !== 'all' || dateFilter !== 'all';

  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('Search by Transaction ID (TXN-9021), Job ID (JOB-4089), or Customer...')}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown Triggers & Export Action */}
      <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
        {/* Method Filter */}
        <div className="relative flex items-center">
          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
          >
            <option value="all">{t('Method: All')}</option>
            <option value="stripe">{t('Stripe / Card')}</option>
            <option value="apple_pay">{t('Apple Pay')}</option>
            <option value="cod">{t('Cash on Delivery')}</option>
            <option value="bank_transfer">{t('Bank Transfer')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative flex items-center">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
          >
            <option value="all">{t('Date: All Time')}</option>
            <option value="today">{t('Today')}</option>
            <option value="this_week">{t('This Week')}</option>
            <option value="this_month">{t('This Month')}</option>
            <option value="last_30_days">{t('Last 30 Days')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
        </div>

        {/* Reset Filters button if active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3.5 py-2.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-2xl transition-all flex items-center gap-1.5"
            title={t('Reset Filters')}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('Reset')}</span>
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setViewMode('table')}
            title={t('Table View')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Table')}</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            title={t('Grid View')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Grid')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
