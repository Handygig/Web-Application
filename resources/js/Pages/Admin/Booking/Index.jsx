import React, { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Menu } from '@headlessui/react';
import {
  Tag,
  Clock,
  Calendar,
  User,
  Briefcase,
  Building,
  Search,
  RotateCcw,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Filter,
  DollarSign,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import BookingDetailModal from '@/Components/Modals/BookingDetailModal';
import QuickViewModal from '@/Components/Modals/QuickViewModal';

const INITIAL_MOCK_BOOKINGS = [
  {
    id: 'BK-001245',
    propertyName: 'Deluxe Apartment',
    category: 'Luxury Accommodation',
    location: 'Colombo, Sri Lanka',
    customerName: 'Kasun Perera',
    customerEmail: 'kasun.perera@email.com',
    customerPhone: '+94 77 123 4567',
    customerId: 'CUST-1001',
    providerName: 'ABC Properties Ltd',
    providerBusiness: 'ABC Real Estate Group',
    providerEmail: 'contact@abcproperties.com',
    providerPhone: '+94 11 234 5678',
    providerId: 'PRV-2001',
    bookingDate: 'Aug 18, 2026',
    timeSlot: '10:00 AM – 12:00 PM',
    amount: 'LKR 15,000',
    rawAmount: 15000,
    status: 'Confirmed',
    createdDate: 'Aug 15, 2026 – 10:30 AM',
    history: [
      { date: 'Aug 15, 2026 – 10:30 AM', title: 'Booking created by customer' },
      { date: 'Aug 15, 2026 – 11:10 AM', title: 'Booking confirmed by provider' },
    ],
  },
  {
    id: 'BK-001246',
    propertyName: 'Master Plumbing Repair',
    category: 'Home Maintenance',
    location: 'Kandy, Sri Lanka',
    customerName: 'Nimali Fernando',
    customerEmail: 'nimali.f@email.com',
    customerPhone: '+94 71 987 6543',
    customerId: 'CUST-1002',
    providerName: 'Vance Plumbing Solutions',
    providerBusiness: 'Vance Plumbing',
    providerEmail: 'vance@plumbing.com',
    providerPhone: '+94 81 555 0192',
    providerId: 'PRV-2002',
    bookingDate: 'Aug 19, 2026',
    timeSlot: '02:00 PM – 04:00 PM',
    amount: 'LKR 8,500',
    rawAmount: 8500,
    status: 'Pending',
    createdDate: 'Aug 15, 2026 – 12:45 PM',
    history: [
      { date: 'Aug 15, 2026 – 12:45 PM', title: 'Booking created by customer' },
    ],
  },
  {
    id: 'BK-001247',
    propertyName: 'Oceanfront Villa Resort',
    category: 'Villas & Resorts',
    location: 'Galle, Sri Lanka',
    customerName: 'Ruwan Jayasinghe',
    customerEmail: 'ruwan.j@email.com',
    customerPhone: '+94 76 543 2109',
    customerId: 'CUST-1003',
    providerName: 'Southern Palms Resorts',
    providerBusiness: 'Southern Palms Hospitality',
    providerEmail: 'reservations@southernpalms.lk',
    providerPhone: '+94 91 222 3344',
    providerId: 'PRV-2003',
    bookingDate: 'Aug 22, 2026',
    timeSlot: 'Full Day (Check-in 2:00 PM)',
    amount: 'LKR 45,000',
    rawAmount: 45000,
    status: 'Completed',
    createdDate: 'Aug 10, 2026 – 09:15 AM',
    history: [
      { date: 'Aug 10, 2026 – 09:15 AM', title: 'Booking created by customer' },
      { date: 'Aug 10, 2026 – 10:00 AM', title: 'Booking confirmed' },
      { date: 'Aug 14, 2026 – 05:00 PM', title: 'Booking completed successfully' },
    ],
  },
  {
    id: 'BK-001248',
    propertyName: 'BrightSpark Electrical Maintenance',
    category: 'Electrical Services',
    location: 'Negombo, Sri Lanka',
    customerName: 'Dinesh Cooray',
    customerEmail: 'dinesh.cooray@email.com',
    customerPhone: '+94 70 333 4455',
    customerId: 'CUST-1004',
    providerName: 'BrightSpark Tech Services',
    providerBusiness: 'BrightSpark Inc.',
    providerEmail: 'support@brightspark.lk',
    providerPhone: '+94 31 777 8899',
    providerId: 'PRV-2004',
    bookingDate: 'Aug 16, 2026',
    timeSlot: '09:00 AM – 11:00 AM',
    amount: 'LKR 12,000',
    rawAmount: 12000,
    status: 'Cancelled',
    createdDate: 'Aug 12, 2026 – 03:20 PM',
    history: [
      { date: 'Aug 12, 2026 – 03:20 PM', title: 'Booking created by customer' },
      { date: 'Aug 13, 2026 – 01:15 PM', title: 'Booking cancelled by admin' },
    ],
  },
  {
    id: 'BK-001249',
    propertyName: 'GreenHouse Eco Deep Cleaning',
    category: 'Cleaning Services',
    location: 'Colombo, Sri Lanka',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@email.com',
    customerPhone: '+94 77 888 9900',
    customerId: 'CUST-1005',
    providerName: 'Eco Clean Sri Lanka',
    providerBusiness: 'EcoClean Ltd',
    providerEmail: 'contact@ecoclean.lk',
    providerPhone: '+94 11 444 5566',
    providerId: 'PRV-2005',
    bookingDate: 'Aug 20, 2026',
    timeSlot: '08:00 AM – 12:00 PM',
    amount: 'LKR 18,500',
    rawAmount: 18500,
    status: 'Confirmed',
    createdDate: 'Aug 14, 2026 – 11:00 AM',
    history: [
      { date: 'Aug 14, 2026 – 11:00 AM', title: 'Booking created by customer' },
      { date: 'Aug 14, 2026 – 11:30 AM', title: 'Booking confirmed by provider' },
    ],
  },
  {
    id: 'BK-001250',
    propertyName: 'Executive Business Suite',
    category: 'Commercial Spaces',
    location: 'Colombo, Sri Lanka',
    customerName: 'Amelia Foster',
    customerEmail: 'amelia.foster@email.com',
    customerPhone: '+94 75 111 2233',
    customerId: 'CUST-1006',
    providerName: 'City Center Workspaces',
    providerBusiness: 'CityCenter Workspaces',
    providerEmail: 'info@citycenterwork.com',
    providerPhone: '+94 11 999 0011',
    providerId: 'PRV-2006',
    bookingDate: 'Aug 25, 2026',
    timeSlot: '09:00 AM – 05:00 PM',
    amount: 'LKR 35,000',
    rawAmount: 35000,
    status: 'Pending',
    createdDate: 'Aug 15, 2026 – 08:30 AM',
    history: [
      { date: 'Aug 15, 2026 – 08:30 AM', title: 'Booking created by customer' },
    ],
  },
  {
    id: 'BK-001251',
    propertyName: 'Sterling Climate Control HVAC',
    category: 'AC & Climate',
    location: 'Kurunegala, Sri Lanka',
    customerName: 'Yuki Tanaka',
    customerEmail: 'yuki.tanaka@email.com',
    customerPhone: '+94 78 444 1122',
    customerId: 'CUST-1007',
    providerName: 'Sterling Air HVAC',
    providerBusiness: 'Sterling HVAC',
    providerEmail: 'service@sterlinghvac.com',
    providerPhone: '+94 37 222 1100',
    providerId: 'PRV-2007',
    bookingDate: 'Aug 21, 2026',
    timeSlot: '11:00 AM – 01:00 PM',
    amount: 'LKR 9,800',
    rawAmount: 9800,
    status: 'Confirmed',
    createdDate: 'Aug 13, 2026 – 04:50 PM',
    history: [
      { date: 'Aug 13, 2026 – 04:50 PM', title: 'Booking created by customer' },
      { date: 'Aug 14, 2026 – 09:00 AM', title: 'Booking confirmed' },
    ],
  },
  {
    id: 'BK-001252',
    propertyName: 'Royal Palms Luxury Cottage',
    category: 'Villas & Cottages',
    location: 'Nuwara Eliya, Sri Lanka',
    customerName: 'Sofia Eriksson',
    customerEmail: 'sofia.e@email.com',
    customerPhone: '+94 72 888 1111',
    customerId: 'CUST-1008',
    providerName: 'Highland Luxury Stays',
    providerBusiness: 'Highland Hospitality',
    providerEmail: 'stay@highlandcottages.lk',
    providerPhone: '+94 52 333 4455',
    providerId: 'PRV-2008',
    bookingDate: 'Aug 28, 2026',
    timeSlot: 'Full Day',
    amount: 'LKR 52,000',
    rawAmount: 52000,
    status: 'Completed',
    createdDate: 'Aug 05, 2026 – 02:10 PM',
    history: [
      { date: 'Aug 05, 2026 – 02:10 PM', title: 'Booking created by customer' },
      { date: 'Aug 05, 2026 – 03:00 PM', title: 'Booking confirmed' },
      { date: 'Aug 09, 2026 – 12:00 PM', title: 'Booking completed successfully' },
    ],
  },
];

export default function BookingIndex() {
  const { t } = useTranslation();

  // Pure Frontend Local State Management
  const [bookingList, setBookingList] = useState(INITIAL_MOCK_BOOKINGS);

  // Search & Filter state
  const [activeTab, setActiveTab] = useState('all'); // all, pending, confirmed, completed, cancelled
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

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

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
      if (b.providerName) set.add(b.providerName);
    });
    return Array.from(set);
  }, [bookingList]);

  const customerOptions = useMemo(() => {
    const set = new Set();
    bookingList.forEach((b) => {
      if (b.customerName) set.add(b.customerName);
    });
    return Array.from(set);
  }, [bookingList]);

  // Filter & Sort logic
  const filteredBookings = useMemo(() => {
    return bookingList.filter((b) => {
      // Tab filter
      if (activeTab !== 'all' && b.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }

      // Provider filter
      if (providerFilter !== 'all' && b.providerName !== providerFilter) {
        return false;
      }

      // Customer filter
      if (customerFilter !== 'all' && b.customerName !== customerFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesCustName = b.customerName.toLowerCase().includes(q);
        const matchesCustEmail = b.customerEmail.toLowerCase().includes(q);
        const matchesProvName = b.providerName.toLowerCase().includes(q);
        const matchesPropName = b.propertyName.toLowerCase().includes(q);

        if (!matchesId && !matchesCustName && !matchesCustEmail && !matchesProvName && !matchesPropName) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'oldest') return a.id.localeCompare(b.id);
      if (sortOption === 'amount-high') return (b.rawAmount || 0) - (a.rawAmount || 0);
      if (sortOption === 'amount-low') return (a.rawAmount || 0) - (b.rawAmount || 0);
      return b.id.localeCompare(a.id); // newest default
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

  const startRecordNum = totalItems === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + itemsPerPage, totalItems);

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

    const headers = ['Booking ID', 'Customer', 'Customer Email', 'Provider', 'Property/Service', 'Booking Date', 'Amount', 'Status'];
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
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(t('Bookings CSV exported successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
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
    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedHistory = [
      ...(b.history || []),
      { date: nowFormatted, title: `Booking status changed to ${newStatus}` },
    ];

    setBookingList((prev) =>
      prev.map((item) =>
        item.id === b.id ? { ...item, status: newStatus, history: updatedHistory } : item
      )
    );

    if (selectedBooking && selectedBooking.id === b.id) {
      setSelectedBooking({
        ...selectedBooking,
        status: newStatus,
        history: updatedHistory,
      });
    }

    setToastMessage(t('Booking status updated successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handlePromptCancel = (b) => {
    setCancellingBooking(b);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (!cancellingBooking) return;
    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedHistory = [
      ...(cancellingBooking.history || []),
      { date: nowFormatted, title: 'Booking cancelled by admin' },
    ];

    setBookingList((prev) =>
      prev.map((b) =>
        b.id === cancellingBooking.id ? { ...b, status: 'Cancelled', history: updatedHistory } : b
      )
    );

    setIsCancelModalOpen(false);
    setCancellingBooking(null);
    setToastMessage(t('Booking cancelled successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <AppLayout>
      <Head title={t('Bookings')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2. Page Header */}
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

        {/* 3. Summary Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-theme-accent ring-4 ring-indigo-50/50">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Total Bookings')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Pending')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.pending.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-4 ring-sky-50/50">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Confirmed')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.confirmed.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Completed')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.completed.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Cancelled')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.cancelled.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 4. Booking Status Tabs & Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-200/50 p-1">
              {[
                { id: 'all', label: t('All'), count: stats.total },
                { id: 'pending', label: t('Pending'), count: stats.pending },
                { id: 'confirmed', label: t('Confirmed'), count: stats.confirmed },
                { id: 'completed', label: t('Completed'), count: stats.completed },
                { id: 'cancelled', label: t('Cancelled'), count: stats.cancelled },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-slate-100 text-slate-900' : 'bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')} <span className="font-bold text-slate-900">{filteredBookings.length}</span> {t('bookings')}
            </div>
          </div>

          {/* 5 & 6. Search Bar and Filter Controls */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Search className="h-4 w-4 text-theme-accent" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Search bookings...')}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
                />
              </div>

              {/* Clear filters & Sorting */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                {(searchQuery || activeTab !== 'all' || providerFilter !== 'all' || customerFilter !== 'all' || dateFilter !== 'all') && (
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
                  <option value="newest">{t('Newest Bookings')}</option>
                  <option value="oldest">{t('Oldest Bookings')}</option>
                  <option value="amount-high">{t('Highest Amount')}</option>
                  <option value="amount-low">{t('Lowest Amount')}</option>
                </select>
              </div>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              {/* Date Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t('Date Range')}
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                >
                  <option value="all">{t('All Dates')}</option>
                  <option value="today">{t('Today')}</option>
                  <option value="7days">{t('Last 7 days')}</option>
                  <option value="30days">{t('Last 30 days')}</option>
                </select>
              </div>

              {/* Provider Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t('Provider')}
                </label>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                >
                  <option value="all">{t('All Providers')}</option>
                  {providerOptions.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t('Customer')}
                </label>
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                >
                  <option value="all">{t('All Customers')}</option>
                  {customerOptions.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 15. Empty State */}
        {filteredBookings.length === 0 ? (
          <TableCard>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Tag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {searchQuery || activeTab !== 'all' || providerFilter !== 'all' || customerFilter !== 'all'
                  ? t('No matching bookings found.')
                  : t('No bookings found')}
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {searchQuery || activeTab !== 'all' || providerFilter !== 'all' || customerFilter !== 'all'
                  ? t('Try adjusting your search query or filter settings.')
                  : t('Bookings will appear here when customers make reservations.')}
              </p>

              {(searchQuery || activeTab !== 'all' || providerFilter !== 'all' || customerFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <RotateCcw className="h-4 w-4 text-slate-500" />
                  {t('Clear Filters')}
                </button>
              )}
            </div>
          </TableCard>
        ) : (
          /* 7. Bookings Table Layout */
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 w-[20%]">{t('Booking')}</th>
                    <th className="px-5 py-3.5 w-[20%]">{t('Customer')}</th>
                    <th className="px-5 py-3.5 w-[20%]">{t('Provider')}</th>
                    <th className="px-5 py-3.5 w-[18%]">{t('Date & Time')}</th>
                    <th className="px-5 py-3.5 w-[12%]">{t('Amount')}</th>
                    <th className="px-5 py-3.5 w-[10%]">{t('Status')}</th>
                    <th className="px-5 py-3.5 text-right w-[10%]">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {paginatedBookings.map((b) => {
                    const status = b.status || 'Pending';
                    const isPending = status === 'Pending';
                    const isConfirmed = status === 'Confirmed';
                    const isCompleted = status === 'Completed';
                    const isCancelled = status === 'Cancelled';

                    const custInitials = b.customerName
                      ? b.customerName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'C';

                    return (
                      <tr key={b.id} className="group hover:bg-slate-50/80 transition-colors">
                        {/* Booking & Service */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono font-bold text-slate-900 text-xs">{b.id}</span>
                            <span className="font-semibold text-slate-800 text-xs truncate max-w-[180px]">
                              {b.propertyName}
                            </span>
                          </div>
                        </td>

                        {/* Customer Info (Clickable Quick View) */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(e) => handleOpenCustomerQuickView(e, b)}
                            className="flex items-center gap-2.5 text-left group/cust hover:opacity-80 transition"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-xs">
                              {custInitials}
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-slate-900 text-xs group-hover/cust:text-theme-accent truncate">
                                {b.customerName}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">{b.customerEmail}</span>
                            </div>
                          </button>
                        </td>

                        {/* Provider Info (Clickable Quick View) */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(e) => handleOpenProviderQuickView(e, b)}
                            className="flex flex-col text-left group/prov hover:opacity-80 transition min-w-0"
                          >
                            <span className="font-semibold text-slate-900 text-xs group-hover/prov:text-theme-accent truncate">
                              {b.providerName}
                            </span>
                            {b.providerBusiness && (
                              <span className="text-[11px] text-slate-400 truncate">{b.providerBusiness}</span>
                            )}
                          </button>
                        </td>

                        {/* Date & Time */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col text-xs gap-0.5 whitespace-nowrap">
                            <span className="font-medium text-slate-800">{b.bookingDate}</span>
                            <span className="text-[11px] text-slate-400">{b.timeSlot || '10:00 AM – 12:00 PM'}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 text-xs">{b.amount}</span>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${
                              isPending
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : isConfirmed
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPending
                                  ? 'bg-amber-500'
                                  : isConfirmed
                                  ? 'bg-sky-500'
                                  : isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-red-500'
                              }`}
                            />
                            {status}
                          </span>
                        </td>

                        {/* Actions: View + Dropdown */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(b)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                              title={t('View Booking')}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              {t('View')}
                            </button>

                            {/* Dropdown Menu */}
                            <Menu as="div" className="relative inline-block text-left">
                              <Menu.Button className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition">
                                <MoreVertical className="h-4 w-4" />
                              </Menu.Button>

                              <Menu.Items className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 focus:outline-none text-xs font-medium divide-y divide-slate-100">
                                <div className="py-0.5">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handleViewDetails(b)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                                          active ? 'bg-slate-50' : ''
                                        }`}
                                      >
                                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                                        {t('View Details')}
                                      </button>
                                    )}
                                  </Menu.Item>

                                  {isPending && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          type="button"
                                          onClick={() => handleStatusChange(b, 'Confirmed')}
                                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sky-700 ${
                                            active ? 'bg-sky-50' : ''
                                          }`}
                                        >
                                          <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
                                          {t('Confirm Booking')}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  )}

                                  {isConfirmed && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          type="button"
                                          onClick={() => handleStatusChange(b, 'Completed')}
                                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-emerald-700 ${
                                            active ? 'bg-emerald-50' : ''
                                          }`}
                                        >
                                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                          {t('Mark Completed')}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  )}
                                </div>

                                {!isCancelled && !isCompleted && (
                                  <div className="py-0.5">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          type="button"
                                          onClick={() => handlePromptCancel(b)}
                                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                                            active ? 'bg-red-50' : ''
                                          }`}
                                        >
                                          <Ban className="h-3.5 w-3.5 text-red-500" />
                                          {t('Cancel Booking')}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                )}
                              </Menu.Items>
                            </Menu>
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
              {paginatedBookings.map((b) => {
                const status = b.status || 'Pending';
                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-xs block">{b.id}</span>
                        <h4 className="font-bold text-slate-800 text-sm mt-0.5">{b.propertyName}</h4>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700">
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-slate-400 block">{t('Customer')}</span>
                        <span className="font-medium text-slate-800 block truncate">{b.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Amount')}</span>
                        <span className="font-bold text-slate-900">{b.amount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Provider')}</span>
                        <span className="font-medium text-slate-800 block truncate">{b.providerName}</span>
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

            {/* 14. Pagination Controls & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t('Showing :start–:end of :total bookings', {
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

      {/* Booking Details Workspace Modal */}
      <BookingDetailModal
        open={isDetailModalOpen}
        booking={selectedBooking}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusChange={handleStatusChange}
        onPromptCancel={handlePromptCancel}
      />

      {/* Customer / Provider Quick View Modal */}
      <QuickViewModal
        open={isQuickViewOpen}
        type={quickViewType}
        data={quickViewData}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* Cancel Booking Confirmation Modal */}
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
