import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Menu } from '@headlessui/react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  ShieldAlert,
  Search,
  RotateCcw,
  Plus,
  Eye,
  Edit3,
  MoreVertical,
  PauseCircle,
  Lock,
  Trash2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import CustomerDetailModal from '@/Components/Modals/CustomerDetailModal';
import CustomerSuspendModal from '@/Components/Modals/CustomerSuspendModal';
import CustomerBanModal from '@/Components/Modals/CustomerBanModal';
import CustomerFormModal from '@/Components/Modals/CustomerFormModal';


const INITIAL_MOCK_CUSTOMERS = [
  {
    id: 1,
    customerId: 'CUST-1001',
    full_name: 'James Whitfield',
    email: 'james.whitfield@email.com',
    phone: '+1 555-0101',
    status: 'Active',
    customerType: 'Individual',
    joined: 'Jan 12, 2025',
    lastActive: 'Today, 10:30 AM',
    ordersCount: 24,
    totalSpent: '2,450.00',
    completedOrders: 22,
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    country: 'United States',
    accountAge: '1.6 yrs',
  },
  {
    id: 2,
    customerId: 'CUST-1002',
    full_name: 'Priya Nair',
    email: 'priya.nair@email.com',
    phone: '+44 20 7946 0102',
    status: 'Active',
    customerType: 'Business',
    joined: 'Feb 03, 2025',
    lastActive: 'Yesterday, 04:15 PM',
    ordersCount: 18,
    totalSpent: '1,890.00',
    completedOrders: 18,
    address: '10 Downing Street',
    city: 'London',
    country: 'United Kingdom',
    accountAge: '1.5 yrs',
  },
  {
    id: 3,
    customerId: 'CUST-1003',
    full_name: 'Carlos Romero',
    email: 'carlos.romero@email.com',
    phone: '+34 91 123 4567',
    status: 'Inactive',
    customerType: 'Individual',
    joined: 'Feb 18, 2025',
    lastActive: 'Aug 01, 2026',
    ordersCount: 5,
    totalSpent: '420.00',
    completedOrders: 4,
    address: 'Gran Via 45',
    city: 'Madrid',
    country: 'Spain',
    accountAge: '1.5 yrs',
  },
  {
    id: 4,
    customerId: 'CUST-1004',
    full_name: 'Amelia Foster',
    email: 'amelia.foster@email.com',
    phone: '+61 2 9876 5432',
    status: 'Active',
    customerType: 'Individual',
    joined: 'Mar 05, 2025',
    lastActive: 'Today, 08:45 AM',
    ordersCount: 31,
    totalSpent: '3,120.00',
    completedOrders: 30,
    address: '15 George Street',
    city: 'Sydney',
    country: 'Australia',
    accountAge: '1.4 yrs',
  },
  {
    id: 5,
    customerId: 'CUST-1005',
    full_name: 'Yuki Tanaka',
    email: 'yuki.tanaka@email.com',
    phone: '+81 3-1234-5678',
    status: 'Active',
    customerType: 'Business',
    joined: 'Mar 22, 2025',
    lastActive: 'Aug 14, 2026',
    ordersCount: 14,
    totalSpent: '1,650.00',
    completedOrders: 14,
    address: '1-1 Chiyoda',
    city: 'Tokyo',
    country: 'Japan',
    accountAge: '1.4 yrs',
  },
  {
    id: 6,
    customerId: 'CUST-1006',
    full_name: 'Sofia Eriksson',
    email: 'sofia.eriksson@email.com',
    phone: '+46 8 123 456',
    status: 'Suspended',
    customerType: 'Individual',
    joined: 'Apr 07, 2025',
    lastActive: 'Aug 10, 2026',
    ordersCount: 8,
    totalSpent: '780.00',
    completedOrders: 7,
    address: 'Kungsgatan 12',
    city: 'Stockholm',
    country: 'Sweden',
    accountAge: '1.3 yrs',
  },
  {
    id: 7,
    customerId: 'CUST-1007',
    full_name: 'Omar Al-Rashid',
    email: 'omar.rashid@email.com',
    phone: '+971 4 123 4567',
    status: 'Active',
    customerType: 'Individual',
    joined: 'Apr 14, 2025',
    lastActive: 'Aug 15, 2026',
    ordersCount: 22,
    totalSpent: '2,900.00',
    completedOrders: 21,
    address: 'Sheikh Zayed Road',
    city: 'Dubai',
    country: 'United Arab Emirates',
    accountAge: '1.3 yrs',
  },
  {
    id: 8,
    customerId: 'CUST-1008',
    full_name: 'Lena Hoffmann',
    email: 'lena.hoffmann@email.com',
    phone: '+49 30 12345678',
    status: 'Banned',
    customerType: 'Individual',
    joined: 'May 01, 2025',
    lastActive: 'Aug 05, 2026',
    ordersCount: 3,
    totalSpent: '250.00',
    completedOrders: 2,
    address: 'Unter den Linden 5',
    city: 'Berlin',
    country: 'Germany',
    accountAge: '1.2 yrs',
  },
];

export default function CustomerIndex({ dbCustomers, stats: serverStats, filters: serverFilters }) {
  const { t } = useTranslation();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Local dataset
  const [customerList, setCustomerList] = useState(() => {
    if (dbCustomers?.data && dbCustomers.data.length > 0) {
      return dbCustomers.data.map((c) => ({
        id: c.id,
        customerId: `CUST-${1000 + c.id}`,
        full_name: c.user?.full_name || c.full_name || 'Customer User',
        email: c.user?.email || c.email || '',
        phone: c.user?.phone || c.phone || '',
        status: c.user?.status ? c.user.status.charAt(0).toUpperCase() + c.user.status.slice(1) : 'Active',
        customerType: 'Individual',
        joined: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Jan 2025',
        lastActive: 'Recent',
        ordersCount: 12,
        totalSpent: '1,100.00',
        completedOrders: 11,
      }));
    }
    return INITIAL_MOCK_CUSTOMERS;
  });

  // Modal controls
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendingCustomer, setSuspendingCustomer] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banningCustomer, setBanningCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = customerList.length;
    const active = customerList.filter((c) => c.status === 'Active').length;
    const inactive = customerList.filter((c) => c.status === 'Inactive').length;
    const suspended = customerList.filter((c) => c.status === 'Suspended').length;
    const banned = customerList.filter((c) => c.status === 'Banned').length;
    const newCount = customerList.filter((c) => c.joined?.includes('2026') || c.joined?.includes('Aug') || c.joined === 'Just now').length;

    return {
      total: serverStats?.total || total,
      active: serverStats?.active || active,
      inactive: serverStats?.inactive || inactive,
      newCount: serverStats?.new || newCount,
      banned: serverStats?.banned || banned,
    };
  }, [customerList, serverStats]);

  // Filtering & Sorting logic
  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) => {
      // Status filter
      if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Customer type filter
      if (typeFilter !== 'all' && c.customerType.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.full_name.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        const matchesPhone = c.phone && c.phone.includes(q);
        const matchesId = c.customerId && c.customerId.toLowerCase().includes(q);

        if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'oldest') return a.id - b.id;
      if (sortOption === 'name-asc') return a.full_name.localeCompare(b.full_name);
      if (sortOption === 'name-desc') return b.full_name.localeCompare(a.full_name);
      if (sortOption === 'orders') return (b.ordersCount || 0) - (a.ordersCount || 0);
      return b.id - a.id; // newest default
    });
  }, [customerList, statusFilter, typeFilter, searchQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // Pagination bounds
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const startRecordNum = totalItems === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + itemsPerPage, totalItems);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
    setSortOption('newest');
  };

  // Actions
  const handleViewDetails = (c) => {
    setSelectedCustomer(c);
    setIsDetailModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (c) => {
    setEditingCustomer(c);
    setIsFormModalOpen(true);
  };

  const handlePromptSuspend = (c) => {
    setSuspendingCustomer(c);
    setIsSuspendModalOpen(true);
  };

  const confirmSuspend = (reason) => {
    if (!suspendingCustomer) return;
    setActionProcessing(true);

    setTimeout(() => {
      setCustomerList((prev) =>
        prev.map((c) => (c.id === suspendingCustomer.id ? { ...c, status: 'Suspended' } : c))
      );
      setActionProcessing(false);
      setIsSuspendModalOpen(false);
      setSuspendingCustomer(null);
      setToastMessage(t('Customer account has been suspended successfully.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.put(route('admin.customers.update', suspendingCustomer.id), { status: 'suspended' }, { preserveScroll: true });
      } catch (e) {}
    }, 400);
  };

  const handlePromptBan = (c) => {
    setBanningCustomer(c);
    setIsBanModalOpen(true);
  };

  const confirmBan = (banData) => {
    if (!banningCustomer) return;
    setActionProcessing(true);

    setTimeout(() => {
      setCustomerList((prev) =>
        prev.map((c) => (c.id === banningCustomer.id ? { ...c, status: 'Banned' } : c))
      );
      setActionProcessing(false);
      setIsBanModalOpen(false);
      setBanningCustomer(null);
      setToastMessage(t('Customer account has been banned successfully.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.put(route('admin.customers.update', banningCustomer.id), { status: 'banned' }, { preserveScroll: true });
      } catch (e) {}
    }, 400);
  };

  const handleReactivate = (c) => {
    setActionProcessing(true);
    setTimeout(() => {
      setCustomerList((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, status: 'Active' } : item))
      );
      setActionProcessing(false);
      setToastMessage(t('Customer account reactivated successfully.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.put(route('admin.customers.update', c.id), { status: 'active' }, { preserveScroll: true });
      } catch (e) {}
    }, 400);
  };

  const handlePromptDelete = (c) => {
    setDeletingCustomer(c);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingCustomer) return;
    setActionProcessing(true);

    setTimeout(() => {
      setCustomerList((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      setActionProcessing(false);
      setIsDeleteModalOpen(false);
      setDeletingCustomer(null);
      setToastMessage(t('Customer account deleted successfully.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.delete(route('admin.customers.destroy', deletingCustomer.id), { preserveScroll: true });
      } catch (e) {}
    }, 400);
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    setTimeout(() => {
      if (editingCustomer) {
        setCustomerList((prev) =>
          prev.map((c) =>
            c.id === editingCustomer.id
              ? {
                  ...c,
                  full_name: data.full_name,
                  email: data.email,
                  phone: data.phone,
                  status: data.status,
                  customerType: data.customerType,
                  address: data.address,
                  city: data.city,
                }
              : c
          )
        );
      } else {
        const newCustomer = {
          id: Date.now(),
          customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || '+1 555-0100',
          status: data.status || 'Active',
          customerType: data.customerType || 'Individual',
          joined: 'Just now',
          lastActive: 'Just now',
          ordersCount: 0,
          totalSpent: '0.00',
          completedOrders: 0,
          address: data.address || '123 Main St',
          city: data.city || 'Springfield',
          country: 'United States',
          accountAge: '0 days',
        };
        setCustomerList((prev) => [newCustomer, ...prev]);
      }

      setActionProcessing(false);
      setIsFormModalOpen(false);
      setEditingCustomer(null);
      setToastMessage(editingCustomer ? t('Customer profile updated.') : t('New customer added successfully.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        if (editingCustomer) {
          router.put(route('admin.customers.update', editingCustomer.id), data, { preserveScroll: true });
        } else {
          router.post(route('admin.customers.store'), data, { preserveScroll: true });
        }
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
      <Head title={t('Customer Management')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <PageHeader
          title={t('Customer Management')}
          description={t('View and manage customer accounts and activity.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add Customer')}
            </button>
          }
        />

        {/* 2. Summary Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-theme-accent ring-4 ring-indigo-50/50">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Total Customers')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Active')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.active.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 ring-4 ring-slate-100/50">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Inactive')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.inactive.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-4 ring-sky-50/50">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('New This Month')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.newCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Banned')}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.banned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 3 & 4. Search and Filters Controls */}
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
                placeholder={t('Search customers...')}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            {/* Clear filters & Sorting */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
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
                <option value="newest">{t('Newest Customers')}</option>
                <option value="oldest">{t('Oldest Customers')}</option>
                <option value="name-asc">{t('Name A–Z')}</option>
                <option value="name-desc">{t('Name Z–A')}</option>
                <option value="orders">{t('Most Orders')}</option>
              </select>
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            {/* Account Status Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Account Status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Statuses')}</option>
                <option value="active">{t('Active')}</option>
                <option value="inactive">{t('Inactive')}</option>
                <option value="suspended">{t('Suspended')}</option>
                <option value="banned">{t('Banned')}</option>
              </select>
            </div>

            {/* Customer Type Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Customer Type')}
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Types')}</option>
                <option value="individual">{t('Individual')}</option>
                <option value="business">{t('Business')}</option>
              </select>
            </div>

            {/* Registration Date Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Registration Date')}
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Time')}</option>
                <option value="today">{t('Today')}</option>
                <option value="7days">{t('Last 7 days')}</option>
                <option value="30days">{t('Last 30 days')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 20. Error State */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-200 bg-red-50/50 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">{t('Unable to load customer information.')}</h3>
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
          /* 19. Loading Skeleton State */
          <TableCard>
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </TableCard>
        ) : filteredCustomers.length === 0 ? (
          /* 18. Empty State */
          <TableCard>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t('No customers found')}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {t('Try changing your search or filter settings.')}
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              >
                <RotateCcw className="h-4 w-4 text-slate-500" />
                {t('Clear Filters')}
              </button>
            </div>
          </TableCard>
        ) : (
          /* 5. Customer Table Layout */
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3.5 w-[24%]">{t('Customer')}</th>
                    <th className="px-4 py-3.5 w-[26%]">{t('Contact')}</th>
                    <th className="px-4 py-3.5 w-[14%]">{t('Status')}</th>
                    <th className="px-4 py-3.5 w-[16%]">{t('Activity')}</th>
                    <th className="px-4 py-3.5 w-[10%]">{t('Orders')}</th>
                    <th className="px-4 py-3.5 text-right w-[10%]">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {paginatedCustomers.map((cust) => {
                    const initials = cust.full_name
                      ? cust.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'C';

                    const status = cust.status || 'Active';
                    const isActive = status === 'Active';
                    const isSuspended = status === 'Suspended';
                    const isBanned = status === 'Banned';

                    return (
                      <tr key={cust.id} className="group hover:bg-slate-50/80 transition-colors">
                        {/* Customer Info */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-xs shadow-2xs border border-theme-accent/20">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-slate-900 truncate">{cust.full_name}</span>
                              <span className="text-[11px] font-mono font-medium text-slate-400">{cust.customerId || `CUST-${cust.id}`}</span>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="flex items-center gap-1.5 text-slate-700 font-medium text-xs truncate">
                              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {cust.email}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {cust.phone || '+1 555-0101'}
                            </span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isSuspended
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : isBanned
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive
                                  ? 'bg-emerald-500'
                                  : isSuspended
                                  ? 'bg-amber-500'
                                  : isBanned
                                  ? 'bg-red-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {status}
                          </span>
                        </td>

                        {/* Activity (Joined & Last Active) */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col text-xs gap-0.5">
                            <span className="text-slate-700 font-medium whitespace-nowrap">
                              <span className="text-slate-400 text-[11px]">{t('Joined')}: </span>
                              {cust.joined}
                            </span>
                            <span className="text-slate-500 text-[11px] whitespace-nowrap">
                              <span className="text-slate-400">{t('Active')}: </span>
                              {cust.lastActive || 'Today'}
                            </span>
                          </div>
                        </td>

                        {/* Orders/Bookings */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                            <ShoppingBag className="h-3.5 w-3.5 text-theme-accent" />
                            {cust.ordersCount || 0} {t('Orders')}
                          </span>
                        </td>

                        {/* Actions: View Button + Dropdown Menu */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(cust)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                              title={t('View Profile')}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              {t('View')}
                            </button>

                            {/* Dropdown Menu for More Actions */}
                            <Menu as="div" className="relative inline-block text-left">
                              <Menu.Button className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition">
                                <MoreVertical className="h-4 w-4" />
                              </Menu.Button>

                              <Menu.Items className="absolute right-0 z-50 mt-1 w-44 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 focus:outline-none text-xs font-medium divide-y divide-slate-100">
                                <div className="py-0.5">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handleEdit(cust)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                                          active ? 'bg-slate-50' : ''
                                        }`}
                                      >
                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                        {t('Edit Customer')}
                                      </button>
                                    )}
                                  </Menu.Item>

                                  {!isActive && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          type="button"
                                          onClick={() => handleReactivate(cust)}
                                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-emerald-700 ${
                                            active ? 'bg-emerald-50' : ''
                                          }`}
                                        >
                                          <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                          {t('Reactivate')}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  )}

                                  {isActive && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          type="button"
                                          onClick={() => handlePromptSuspend(cust)}
                                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-amber-700 ${
                                            active ? 'bg-amber-50' : ''
                                          }`}
                                        >
                                          <PauseCircle className="h-3.5 w-3.5 text-amber-600" />
                                          {t('Suspend')}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  )}

                                  {!isBanned && (
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          type="button"
                                          onClick={() => handlePromptBan(cust)}
                                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                                            active ? 'bg-red-50' : ''
                                          }`}
                                        >
                                          <Lock className="h-3.5 w-3.5 text-red-500" />
                                          {t('Ban Account')}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  )}
                                </div>

                                <div className="py-0.5">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handlePromptDelete(cust)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                                          active ? 'bg-red-50' : ''
                                        }`}
                                      >
                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        {t('Delete Customer')}
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
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
              {paginatedCustomers.map((cust) => {
                const initials = cust.full_name
                  ? cust.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'C';
                const status = cust.status || 'Active';

                return (
                  <div
                    key={cust.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-sm border border-theme-accent/20">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{cust.full_name}</h4>
                          <span className="text-xs font-mono text-slate-400">{cust.customerId || `CUST-${cust.id}`}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700">
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-slate-400 block">{t('Email')}</span>
                        <span className="font-medium text-slate-800 truncate block">{cust.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{t('Orders')}</span>
                        <span className="font-bold text-slate-900">{cust.ordersCount || 0} Orders</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(cust)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {t('View')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(cust)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                        {t('Edit')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 17. Pagination Controls & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t('Showing :start–:end of :total customers', {
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

      {/* Customer Profile Workspace Details Modal */}
      <CustomerDetailModal
        open={isDetailModalOpen}
        customer={selectedCustomer}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onSuspend={handlePromptSuspend}
        onBan={handlePromptBan}
        onReactivate={handleReactivate}
      />

      {/* Add / Edit Form Modal */}
      <CustomerFormModal
        open={isFormModalOpen}
        customer={editingCustomer}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      {/* Suspend Confirmation Modal */}
      <CustomerSuspendModal
        open={isSuspendModalOpen}
        customer={suspendingCustomer}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setSuspendingCustomer(null);
        }}
        onConfirm={confirmSuspend}
        processing={actionProcessing}
      />

      {/* Ban Confirmation Modal */}
      <CustomerBanModal
        open={isBanModalOpen}
        customer={banningCustomer}
        onClose={() => {
          setIsBanModalOpen(false);
          setBanningCustomer(null);
        }}
        onConfirm={confirmBan}
        processing={actionProcessing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Customer Account?')}
        message={t('Are you sure you want to delete this customer account? All customer records and history will be permanently deleted.')}
        confirmLabel={t('Delete Customer')}
        cancelLabel={t('Cancel')}
        variant="danger"
        processing={actionProcessing}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingCustomer(null);
        }}
      />
    </AppLayout>
  );
}
