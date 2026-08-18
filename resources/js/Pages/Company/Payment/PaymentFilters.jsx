import React from 'react';
import { Search, Filter, Download, LayoutGrid, List, RefreshCw, X } from 'lucide-react';
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
  viewMode,
  setViewMode,
  onExportCSV,
  onResetFilters,
}) {
  const { t } = useTranslation();

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    methodFilter !== 'all' ||
    dateFilter !== 'all';

  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search by Transaction ID (TXN-9021), Job ID (JOB-4089), or Customer...')}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5E6933]/20 focus:border-[#5E6933] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('Status')}:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">{t('All Statuses')}</option>
              <option value="paid">{t('Paid / Settled')}</option>
              <option value="pending">{t('Pending Settlement')}</option>
              <option value="refunded">{t('Refunded')}</option>
              <option value="disbursed">{t('Disbursed to Tech')}</option>
            </select>
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('Method')}:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">{t('All Methods')}</option>
              <option value="stripe">{t('Stripe / Card')}</option>
              <option value="apple_pay">{t('Apple Pay')}</option>
              <option value="cod">{t('Cash on Delivery')}</option>
              <option value="bank_transfer">{t('Bank Transfer')}</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('Date')}:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">{t('All Time')}</option>
              <option value="today">{t('Today')}</option>
              <option value="this_week">{t('This Week')}</option>
              <option value="this_month">{t('This Month')}</option>
              <option value="last_30_days">{t('Last 30 Days')}</option>
            </select>
          </div>

          {/* Reset Filters button if active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-all flex items-center gap-1"
              title={t('Reset Filters')}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t('Reset')}
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={t('Table View')}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={t('Grid View')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV / PDF button */}
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#5E6933]" />
            {t('Export CSV / PDF')}
          </button>
        </div>
      </div>
    </div>
  );
}
