import React from 'react';
import { Search, Filter, Tag, ChevronDown, LayoutGrid, List, X } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  viewMode,
  setViewMode,
  totalResults,
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Search Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Search by Job ID (JOB-4089), Customer Name, or Service...')}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns & View Toggles */}
      <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
        
        {/* Status Filter Dropdown */}
        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
          >
            <option value="all">{t('Status: All')}</option>
            <option value="pending_dispatch">{t('Pending Dispatch')}</option>
            <option value="scheduled">{t('Scheduled')}</option>
            <option value="in_progress">{t('In Progress')}</option>
            <option value="completed">{t('Completed')}</option>
            <option value="cancelled">{t('Cancelled')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative flex items-center">
          <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
          >
            <option value="all">{t('Category: All')}</option>
            <option value="Plumbing">{t('Plumbing')}</option>
            <option value="HVAC">{t('HVAC')}</option>
            <option value="Electrical">{t('Electrical')}</option>
            <option value="General Repair">{t('General Repair')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
        </div>

        {/* View Mode Toggle Buttons */}
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
            onClick={() => setViewMode('list')}
            title={t('Card List View')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Cards')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
