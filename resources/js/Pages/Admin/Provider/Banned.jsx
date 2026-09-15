import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  ShieldAlert,
  Users,
  Briefcase,
  UserCheck,
  Search,
  RotateCcw,
  Eye,
  Lock,
  Clock,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import BannedAccountDetailModal from '@/Components/Modals/BannedAccountDetailModal';
import UnbanConfirmModal from '@/Components/Modals/UnbanConfirmModal';

export default function ProviderBanned({ bannedUsers }) {
  const { t } = useTranslation();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [banTypeFilter, setBanTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Local dataset
  const [bannedList, setBannedList] = useState(() => {
    if (bannedUsers && bannedUsers.length > 0) {
      return bannedUsers.map((u) => ({
        id: u.id,
        accountId: `ACC-${u.id}`,
        full_name: u.full_name || 'Banned User',
        email: u.email || '',
        phone: u.phone || '',
        accountType: u.role === 'provider' ? 'Provider' : 'Customer',
        banType: 'Permanent',
        reason: 'Policy Violation',
        detailedReason: 'Account suspended due to platform policy violations.',
        bannedDate: u.updated_at ? new Date(u.updated_at).toLocaleDateString() : 'Aug 2026',
        bannedBy: 'Admin',
        expiryNotice: 'Permanent',
        previousViolations: 1,
      }));
    }
    return [];
  });

  // Modal controls
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [unbanningAccount, setUnbanningAccount] = useState(null);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bannedList.length;
    const providers = bannedList.filter((b) => b.accountType === 'Provider').length;
    const customers = bannedList.filter((b) => b.accountType === 'Customer').length;
    const thisMonth = bannedList.filter(
      (b) => b.bannedDate?.includes('Aug') || b.bannedDate?.includes('2026')
    ).length;
    return { total, providers, customers, thisMonth };
  }, [bannedList]);

  // Filtering & Sorting
  const filteredAccounts = useMemo(() => {
    return bannedList
      .filter((acc) => {
        // Account type filter
        if (
          accountTypeFilter !== 'all' &&
          acc.accountType.toLowerCase() !== accountTypeFilter.toLowerCase()
        ) {
          return false;
        }

        // Ban type filter
        if (banTypeFilter !== 'all' && acc.banType.toLowerCase() !== banTypeFilter.toLowerCase()) {
          return false;
        }

        // Reason filter
        if (reasonFilter !== 'all' && acc.reason !== reasonFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = acc.full_name.toLowerCase().includes(q);
          const matchesEmail = acc.email.toLowerCase().includes(q);
          const matchesPhone = acc.phone && acc.phone.includes(q);
          const matchesId = acc.accountId && acc.accountId.toLowerCase().includes(q);
          const matchesBusiness = acc.businessName && acc.businessName.toLowerCase().includes(q);

          if (!matchesName && !matchesEmail && !matchesPhone && !matchesId && !matchesBusiness) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'oldest') return a.id - b.id;
        if (sortOption === 'name-asc') return a.full_name.localeCompare(b.full_name);
        if (sortOption === 'name-desc') return b.full_name.localeCompare(a.full_name);
        return b.id - a.id; // newest default
      });
  }, [bannedList, accountTypeFilter, banTypeFilter, reasonFilter, searchQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, accountTypeFilter, banTypeFilter, reasonFilter]);

  // Pagination bounds
  const totalItems = filteredAccounts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  const startRecordNum = totalItems === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + itemsPerPage, totalItems);

  const handleClearFilters = () => {
    setSearchQuery('');
    setAccountTypeFilter('all');
    setBanTypeFilter('all');
    setReasonFilter('all');
    setDateFilter('all');
    setSortOption('newest');
  };

  const handleViewDetails = (acc) => {
    setSelectedAccount(acc);
    setIsDetailModalOpen(true);
  };

  const handlePromptUnban = (acc) => {
    setUnbanningAccount(acc);
    setIsUnbanModalOpen(true);
  };

  const confirmUnban = () => {
    if (!unbanningAccount) return;
    setActionProcessing(true);

    setTimeout(() => {
      setBannedList((prev) => prev.filter((b) => b.id !== unbanningAccount.id));
      setActionProcessing(false);
      setIsUnbanModalOpen(false);
      setUnbanningAccount(null);

      setToastMessage(t('Account has been successfully unbanned.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.put(
          route('admin.providers.toggle-active', unbanningAccount.id),
          {},
          { preserveScroll: true }
        );
      } catch (e) {}
    }, 400);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <AppLayout>
      <Head title={t('Banned Accounts')} />

      <div className="flex w-full flex-col gap-6">
        {/* Notification Banner */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <PageHeader
          title={t('Banned Accounts')}
          description={t(
            'View and manage accounts that have been banned or suspended from the platform.'
          )}
        />

        {/* 2. Summary Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('Total Banned')}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-theme-accent ring-4 ring-indigo-50/50">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('Banned Providers')}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.providers}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-4 ring-sky-50/50">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('Banned Customers')}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.customers}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('Banned This Month')}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.thisMonth}</p>
            </div>
          </div>
        </div>

        {/* 3 & 4. Search and Filters Controls */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-theme-accent" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search banned accounts...')}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            {/* Clear filters & Sorting dropdown */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {(searchQuery ||
                accountTypeFilter !== 'all' ||
                banTypeFilter !== 'all' ||
                reasonFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  {t('Clear Filters')}
                </button>
              )}

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2 text-xs font-semibold text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="newest">{t('Sort: Newest Banned')}</option>
                <option value="oldest">{t('Sort: Oldest Banned')}</option>
                <option value="name-asc">{t('Name A–Z')}</option>
                <option value="name-desc">{t('Name Z–A')}</option>
              </select>
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            {/* Account Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Account Type')}
              </label>
              <select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Account Types')}</option>
                <option value="customer">{t('Customer')}</option>
                <option value="provider">{t('Provider')}</option>
              </select>
            </div>

            {/* Ban Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Ban Type')}
              </label>
              <select
                value={banTypeFilter}
                onChange={(e) => setBanTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Ban Types')}</option>
                <option value="temporary">{t('Temporary')}</option>
                <option value="permanent">{t('Permanent')}</option>
              </select>
            </div>

            {/* Ban Reason */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Ban Reason')}
              </label>
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Ban Reasons')}</option>
                <option value="Policy Violation">{t('Policy Violation')}</option>
                <option value="Fraud">{t('Fraud')}</option>
                <option value="Suspicious Activity">{t('Suspicious Activity')}</option>
                <option value="Abuse">{t('Abuse')}</option>
                <option value="Multiple Violations">{t('Multiple Violations')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 14. Error State */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-200 bg-red-50/50 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">
              {t('Unable to load banned accounts.')}
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
              {t('Retry')}
            </button>
          </div>
        ) : loading ? (
          /* 13. Loading Skeleton State */
          <TableCard>
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between gap-4 py-3 border-b border-slate-100"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </TableCard>
        ) : filteredAccounts.length === 0 ? (
          /* 12. Empty State */
          <TableCard>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 mb-4 ring-4 ring-emerald-50/50">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t('No banned accounts')}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {t('There are currently no accounts that have been banned or suspended.')}
              </p>
            </div>
          </TableCard>
        ) : (
          /* 5. Banned Accounts Table */
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5">{t('Account')}</th>
                    <th className="px-5 py-3.5">{t('Account Type')}</th>
                    <th className="px-5 py-3.5">{t('Ban Type')}</th>
                    <th className="px-5 py-3.5">{t('Reason')}</th>
                    <th className="px-5 py-3.5">{t('Banned Date')}</th>
                    <th className="px-5 py-3.5">{t('Banned By')}</th>
                    <th className="px-5 py-3.5">{t('Status')}</th>
                    <th className="px-5 py-3.5 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {paginatedAccounts.map((acc) => {
                    const initials = acc.full_name
                      ? acc.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'U';
                    const isTemp = acc.banType === 'Temporary';
                    const isExpired = acc.expiryNotice === 'Ban Expired';

                    return (
                      <tr key={acc.id} className="group hover:bg-slate-50/80 transition-colors">
                        {/* Account info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600 text-xs shadow-2xs border border-red-200">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-slate-900 truncate">
                                {acc.full_name}
                              </span>
                              {acc.businessName && (
                                <span className="block text-xs font-medium text-theme-accent truncate">
                                  {acc.businessName}
                                </span>
                              )}
                              <span className="text-xs text-slate-400 truncate">{acc.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Account Type */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-1 rounded-lg ${
                              acc.accountType === 'Provider'
                                ? 'bg-indigo-50 text-theme-accent border border-indigo-100'
                                : 'bg-sky-50 text-sky-700 border border-sky-100'
                            }`}
                          >
                            {acc.accountType}
                          </span>
                        </td>

                        {/* Ban Type & Expiry Notice */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-xs text-slate-800">{acc.banType}</span>
                            {isTemp && (
                              <span
                                className={`text-[11px] font-semibold ${
                                  isExpired ? 'text-amber-600 font-bold' : 'text-slate-500'
                                }`}
                              >
                                {acc.expiryNotice}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="px-5 py-4">
                          <span className="inline-block rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-100 truncate max-w-[140px]">
                            {acc.reason}
                          </span>
                        </td>

                        {/* Banned Date */}
                        <td className="px-5 py-4 text-xs font-medium text-slate-600">
                          {acc.bannedDate}
                        </td>

                        {/* Banned By */}
                        <td className="px-5 py-4 text-xs font-medium text-slate-600">
                          {acc.bannedBy || 'Admin'}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
                            <Lock className="h-3 w-3" />
                            {t('Banned')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(acc)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                              title={t('View Ban Details')}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              {t('View Details')}
                            </button>

                            <button
                              type="button"
                              onClick={() => handlePromptUnban(acc)}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
                              title={t('Unban Account')}
                            >
                              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                              {t('Unban')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {paginatedAccounts.map((acc) => {
                const initials = acc.full_name
                  ? acc.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'U';

                return (
                  <div
                    key={acc.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-600 text-sm border border-red-200">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{acc.full_name}</h4>
                          <span className="text-xs text-slate-400">{acc.email}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                        {t('Banned')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-slate-400 block">{t('Account Type')}</span>
                        <span className="font-semibold text-slate-800">{acc.accountType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Ban Type')}</span>
                        <span className="font-semibold text-slate-800">{acc.banType}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block">{t('Reason')}</span>
                        <span className="font-bold text-red-600">{acc.reason}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(acc)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {t('View Details')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePromptUnban(acc)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                        {t('Unban')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 15. Pagination Controls & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t('Showing :start–:end of :total accounts', {
                  start: startRecordNum,
                  end: endRecordNum,
                  total: totalItems,
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {t('Previous')}
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 rounded-xl text-xs font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-theme-accent text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {t('Next')}
                </button>
              </div>
            </div>
          </TableCard>
        )}
      </div>

      {/* Account Details & Ban Details Modal */}
      <BannedAccountDetailModal
        open={isDetailModalOpen}
        account={selectedAccount}
        onClose={() => setIsDetailModalOpen(false)}
        onUnban={handlePromptUnban}
      />

      {/* 8. Unban Confirmation Modal */}
      <UnbanConfirmModal
        open={isUnbanModalOpen}
        account={unbanningAccount}
        onClose={() => {
          setIsUnbanModalOpen(false);
          setUnbanningAccount(null);
        }}
        onConfirm={confirmUnban}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}
