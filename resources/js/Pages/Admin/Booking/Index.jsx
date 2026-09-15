import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Menu } from '@headlessui/react';
import {
  Tag,
  Clock,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  Ban,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import BookingDetailModal from '@/Components/Modals/BookingDetailModal';
import QuickViewModal from '@/Components/Modals/QuickViewModal';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import TabSwitch from '@/Components/Other/TabSwitch';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import BookingActionMenu from '@/Components/Table/BookingActionMenu';
import { getBookingStatusStyles } from '@/Utils/helper';

export default function BookingIndex({ bookings }) {
  const { t } = useTranslation();
  const bookingList = bookings?.data || bookings || [];

  // Search & Filter state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  // Quick view modal state
  const [quickViewData, setQuickViewData] = useState(null);
  const [quickViewType, setQuickViewType] = useState('customer');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Calculate Statistics dynamically
  const stats = useMemo(() => {
    const total = bookingList.length;
    const pending = bookingList.filter((b) => b.status === 'Pending').length;
    const confirmed = bookingList.filter((b) => b.status === 'Confirmed').length;
    const completed = bookingList.filter((b) => b.status === 'Completed').length;
    const cancelled = bookingList.filter((b) => b.status === 'Cancelled').length;

    return { total, pending, confirmed, completed, cancelled };
  }, [bookingList]);

  // Unique options for Provider and Customer filters
  const providerOptions = useMemo(() => {
    const set = new Set();
    bookingList.forEach((b) => {
      if (b.providerName) {
        set.add(b.providerName);
      }
    });
    return Array.from(set);
  }, [bookingList]);

  const customerOptions = useMemo(() => {
    const set = new Set();
    bookingList.forEach((b) => {
      if (b.customerName) {
        set.add(b.customerName);
      }
    });
    return Array.from(set);
  }, [bookingList]);

  // Filter & Sort logic
  const filteredBookings = useMemo(() => {
    return bookingList
      .filter((b) => {
        if (activeTab !== 'all' && b.status.toLowerCase() !== activeTab.toLowerCase()) {
          return false;
        }
        if (providerFilter !== 'all' && b.providerName !== providerFilter) {
          return false;
        }
        if (customerFilter !== 'all' && b.customerName !== customerFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesId = b.id.toLowerCase().includes(q);
          const matchesCustName = b.customerName.toLowerCase().includes(q);
          const matchesCustEmail = b.customerEmail.toLowerCase().includes(q);
          const matchesProvName = b.providerName.toLowerCase().includes(q);
          const matchesPropName = b.propertyName.toLowerCase().includes(q);

          if (
            !matchesId &&
            !matchesCustName &&
            !matchesCustEmail &&
            !matchesProvName &&
            !matchesPropName
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'oldest') {
          return a.id.localeCompare(b.id);
        }
        if (sortOption === 'amount-high') {
          return (b.rawAmount || 0) - (a.rawAmount || 0);
        }
        if (sortOption === 'amount-low') {
          return (a.rawAmount || 0) - (b.rawAmount || 0);
        }
        return b.id.localeCompare(a.id);
      });
  }, [bookingList, activeTab, providerFilter, customerFilter, searchQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, providerFilter, customerFilter]);

  // Pagination bounds
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setDateFilter('all');
    setProviderFilter('all');
    setCustomerFilter('all');
    setSortOption('newest');
  };

  // CSV Export feature
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;

    const headers = [
      'Booking ID',
      'Customer',
      'Customer Email',
      'Provider',
      'Property/Service',
      'Booking Date',
      'Amount',
      'Status',
    ];
    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.customerName}"`,
      `"${b.customerEmail}"`,
      `"${b.providerName}"`,
      `"${b.propertyName}"`,
      `"${b.bookingDate}"`,
      `"${b.amount}"`,
      b.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Action handlers
  const handleViewDetails = (b) => {
    setSelectedBooking(b);
    setIsDetailModalOpen(true);
  };

  const handleOpenCustomerQuickView = (e, b) => {
    e.stopPropagation();
    setQuickViewType('customer');
    setQuickViewData({
      name: b.customerName,
      email: b.customerEmail,
      phone: b.customerPhone,
      customerId: b.customerId,
    });
    setIsQuickViewOpen(true);
  };

  const handleOpenProviderQuickView = (e, b) => {
    e.stopPropagation();
    setQuickViewType('provider');
    setQuickViewData({
      providerName: b.providerName,
      businessName: b.providerBusiness,
      email: b.providerEmail,
      phone: b.providerPhone,
      providerId: b.providerId,
    });
    setIsQuickViewOpen(true);
  };

  const handleStatusChange = (b, newStatus) => {
    router.patch(
      route('admin.bookings.status', b.realId),
      { status: newStatus.toLowerCase() },
      {
        preserveScroll: true,
      }
    );
  };

  const handlePromptCancel = (b) => {
    setCancellingBooking(b);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (!cancellingBooking) return;
    router.patch(
      route('admin.bookings.status', cancellingBooking.realId),
      { status: 'cancelled' },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setCancellingBooking(null);
        },
      }
    );
  };

  const tabs = [
    { key: 'all', label: `${t('All')} (${stats.total})` },
    { key: 'pending', label: `${t('Pending')} (${stats.pending})` },
    { key: 'confirmed', label: `${t('Confirmed')} (${stats.confirmed})` },
    { key: 'completed', label: `${t('Completed')} (${stats.completed})` },
    { key: 'cancelled', label: `${t('Cancelled')} (${stats.cancelled})` },
  ];

  const columns = [
    {
      key: 'booking',
      label: t('Booking'),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono font-bold text-slate-900 text-xs">{row.id}</span>
          <span className="font-semibold text-slate-800 text-xs truncate max-w-[180px]">
            {row.propertyName}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      label: t('Customer'),
      render: (row) => {
        const custInitials = row.customerName
          ? row.customerName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'C';
        return (
          <button
            type="button"
            onClick={(e) => handleOpenCustomerQuickView(e, row)}
            className="flex items-center gap-2.5 text-left group/cust hover:opacity-80 transition"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-xs">
              {custInitials}
            </div>
            <div className="min-w-0">
              <span className="block font-semibold text-slate-900 text-xs group-hover/cust:text-theme-accent truncate">
                {row.customerName}
              </span>
              <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                {row.customerEmail}
              </span>
            </div>
          </button>
        );
      },
    },
    {
      key: 'provider',
      label: t('Provider'),
      render: (row) => (
        <button
          type="button"
          onClick={(e) => handleOpenProviderQuickView(e, row)}
          className="flex flex-col text-left group/prov hover:opacity-80 transition min-w-0"
        >
          <span className="font-semibold text-slate-900 text-xs group-hover/prov:text-theme-accent truncate">
            {row.providerName}
          </span>
          {row.providerBusiness && (
            <span className="text-[11px] text-slate-400 truncate">{row.providerBusiness}</span>
          )}
        </button>
      ),
    },
    {
      key: 'dateTime',
      label: t('Date & Time'),
      render: (row) => (
        <div className="flex flex-col text-xs gap-0.5 whitespace-nowrap">
          <span className="font-medium text-slate-800">{row.bookingDate}</span>
          <span className="text-[11px] text-slate-400">{row.timeSlot || 'Flexible'}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: t('Amount'),
      render: (row) => <span className="font-bold text-slate-900 text-xs">{row.amount}</span>,
    },
    {
      key: 'status',
      label: t('Status'),
      render: (row) => {
        const styles = getBookingStatusStyles(row.status);
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${styles.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: t('Actions'),
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleViewDetails(row)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            {t('View')}
          </button>

          <BookingActionMenu
            booking={row}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onPromptCancel={handlePromptCancel}
          />
        </div>
      ),
    },
  ];

  // Map pagination links for Inertia/Paginator component compatibility
  const paginatorLinks = useMemo(() => {
    if (bookings?.meta?.links) {
      return bookings.meta.links;
    }
    if (bookings?.links) {
      return bookings.links;
    }

    const links = [];
    links.push({
      url: currentPage > 1 ? `?page=${currentPage - 1}` : null,
      label: '&laquo; Previous',
      active: false,
    });
    for (let i = 1; i <= totalPages; i++) {
      links.push({
        url: `?page=${i}`,
        label: String(i),
        active: currentPage === i,
      });
    }
    links.push({
      url: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
      label: 'Next &raquo;',
      active: false,
    });
    return links;
  }, [bookings, currentPage, totalPages]);

  return (
    <AppLayout>
      <Head title={t('Bookings')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Bookings')}
          description={t('View and manage customer bookings across the platform.')}
          action={
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all active:scale-95"
            >
              <Download className="h-4 w-4 text-slate-500" />
              {t('Export Bookings')}
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <StatCard
            icon={Tag}
            label={t('Total Bookings')}
            value={stats.total.toLocaleString()}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-theme-accent"
            ringClass="ring-indigo-50/50"
          />

          <StatCard
            icon={Clock}
            label={t('Pending')}
            value={stats.pending.toLocaleString()}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
            ringClass="ring-amber-50/50"
          />

          <StatCard
            icon={CheckCircle2}
            label={t('Confirmed')}
            value={stats.confirmed.toLocaleString()}
            iconBgClass="bg-sky-50"
            iconColorClass="text-sky-600"
            ringClass="ring-sky-50/50"
          />

          <StatCard
            icon={CheckCircle2}
            label={t('Completed')}
            value={stats.completed.toLocaleString()}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
            ringClass="ring-emerald-50/50"
          />

          <StatCard
            icon={Ban}
            label={t('Cancelled')}
            value={stats.cancelled.toLocaleString()}
            iconBgClass="bg-red-50"
            iconColorClass="text-red-600"
            ringClass="ring-red-50/50"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <TabSwitch tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')}{' '}
              <span className="font-bold text-slate-900">{filteredBookings.length}</span>{' '}
              {t('bookings')}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search bookings...')}
                className="md:max-w-md"
              />

              <div className="flex items-center gap-3 self-end md:self-auto">
                {(searchQuery ||
                  activeTab !== 'all' ||
                  providerFilter !== 'all' ||
                  customerFilter !== 'all' ||
                  dateFilter !== 'all') && (
                  <ClearFiltersButton onClick={handleClearFilters} className="h-[46px]" />
                )}

                <SelectInput
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="min-w-[160px]"
                >
                  <option value="newest">{t('Newest Bookings')}</option>
                  <option value="oldest">{t('Oldest Bookings')}</option>
                  <option value="amount-high">{t('Highest Amount')}</option>
                  <option value="amount-low">{t('Lowest Amount')}</option>
                </SelectInput>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <SelectInput
                label={t('Date Range')}
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">{t('All Dates')}</option>
                <option value="today">{t('Today')}</option>
                <option value="7days">{t('Last 7 days')}</option>
                <option value="30days">{t('Last 30 days')}</option>
              </SelectInput>

              <SelectInput
                label={t('Provider')}
                id="providerFilter"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <option value="all">{t('All Providers')}</option>
                {providerOptions.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </SelectInput>

              <SelectInput
                label={t('Customer')}
                id="customerFilter"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              >
                <option value="all">{t('All Customers')}</option>
                {customerOptions.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <TableCard>
            <EmptyState
              icon={Tag}
              title={t('No bookings found')}
              description={t('Try adjusting your search query or filter settings.')}
            />
          </TableCard>
        ) : (
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <DataTable columns={columns} rows={paginatedBookings} rowKey="id" />
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-4">
              {paginatedBookings.map((b) => {
                const status = b.status || 'Pending';
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-xs block">
                          {b.id}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-0.5">
                          {b.propertyName}
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700">
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-slate-400 block">{t('Customer')}</span>
                        <span className="font-medium text-slate-800 block truncate">
                          {b.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Amount')}</span>
                        <span className="font-bold text-slate-900">{b.amount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Provider')}</span>
                        <span className="font-medium text-slate-800 block truncate">
                          {b.providerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Date')}</span>
                        <span className="font-medium text-slate-700">{b.bookingDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(b)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {t('View Details')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100">
              <Paginator links={paginatorLinks} />
            </div>
          </TableCard>
        )}
      </div>

      <BookingDetailModal
        open={isDetailModalOpen}
        booking={selectedBooking}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusChange={handleStatusChange}
        onPromptCancel={handlePromptCancel}
      />

      <QuickViewModal
        open={isQuickViewOpen}
        type={quickViewType}
        data={quickViewData}
        onClose={() => setIsQuickViewOpen(false)}
      />

      <ConfirmModal
        open={isCancelModalOpen}
        title={t('Cancel Booking?')}
        message={
          cancellingBooking
            ? t('Are you sure you want to cancel booking :id for :customer with :provider?', {
                id: cancellingBooking.id,
                customer: cancellingBooking.customerName,
                provider: cancellingBooking.providerName,
              })
            : t('Are you sure you want to cancel this booking?')
        }
        confirmLabel={t('Cancel Booking')}
        cancelLabel={t('Keep Booking')}
        variant="danger"
        onConfirm={confirmCancel}
        onCancel={() => {
          setIsCancelModalOpen(false);
          setCancellingBooking(null);
        }}
      />
    </AppLayout>
  );
}
