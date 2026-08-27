import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Menu } from '@headlessui/react';
import {
  Layers,
  Building2,
  Home,
  Hotel,
  Briefcase,
  Building,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  RotateCcw,
  Plus,
  Eye,
  Edit3,
  MoreVertical,
  Power,
  Trash2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import PropertyTypeDetailModal from '@/Components/Modals/PropertyTypeDetailModal';
import PropertyTypeFormModal from '@/Components/Modals/PropertyTypeFormModal';
import PropertyTypeDeleteModal from '@/Components/Modals/PropertyTypeDeleteModal';

const INITIAL_PROPERTY_TYPES = [
  {
    id: 1,
    code: 'PT-001',
    name: 'Apartment',
    description: 'Residential apartment units in multi-story residential buildings and complexes.',
    icon: 'Apartment',
    properties_count: 128,
    status: 'Active',
    created_at: 'Jan 15, 2025',
    updated_at: 'Aug 14, 2026',
  },
  {
    id: 2,
    code: 'PT-002',
    name: 'House',
    description: 'Standalone residential houses and single-family detached homes with grounds.',
    icon: 'House',
    properties_count: 86,
    status: 'Active',
    created_at: 'Jan 18, 2025',
    updated_at: 'Aug 10, 2026',
  },
  {
    id: 3,
    code: 'PT-003',
    name: 'Villa',
    description: 'Premium standalone villas with private gardens and luxury amenities.',
    icon: 'House',
    properties_count: 42,
    status: 'Active',
    created_at: 'Feb 02, 2025',
    updated_at: 'Jul 28, 2026',
  },
  {
    id: 4,
    code: 'PT-004',
    name: 'Hotel',
    description: 'Hotel and hospitality properties providing guest accommodations.',
    icon: 'Hotel',
    properties_count: 24,
    status: 'Active',
    created_at: 'Feb 10, 2025',
    updated_at: 'Aug 02, 2026',
  },
  {
    id: 5,
    code: 'PT-005',
    name: 'Guest House',
    description: 'Bed & breakfast accommodations and small independent guest lodges.',
    icon: 'House',
    properties_count: 15,
    status: 'Active',
    created_at: 'Mar 01, 2025',
    updated_at: 'Jul 15, 2026',
  },
  {
    id: 6,
    code: 'PT-006',
    name: 'Office',
    description: 'Commercial office spaces, suites, and business corporate towers.',
    icon: 'Office',
    properties_count: 18,
    status: 'Inactive',
    created_at: 'Mar 12, 2025',
    updated_at: 'Aug 01, 2026',
  },
  {
    id: 7,
    code: 'PT-007',
    name: 'Commercial Property',
    description: 'Retail stores, shopping outlets, and commercial trade facilities.',
    icon: 'Commercial',
    properties_count: 12,
    status: 'Active',
    created_at: 'Apr 05, 2025',
    updated_at: 'Aug 05, 2026',
  },
  {
    id: 8,
    code: 'PT-008',
    name: 'Land',
    description: 'Undeveloped land plots, commercial zoning lots, and agricultural acreage.',
    icon: 'Land',
    properties_count: 0,
    status: 'Active',
    created_at: 'May 10, 2025',
    updated_at: 'May 10, 2025',
  },
  {
    id: 9,
    code: 'PT-009',
    name: 'Storage & Warehouse',
    description: 'Industrial storage units, distribution hubs, and warehouse facilities.',
    icon: 'Commercial',
    properties_count: 0,
    status: 'Inactive',
    created_at: 'Jun 20, 2025',
    updated_at: 'Jun 20, 2025',
  },
];

const ICON_MAP = {
  Apartment: Building2,
  House: Home,
  Villa: Home,
  Hotel: Hotel,
  Office: Briefcase,
  Commercial: Building,
  Land: Layers,
  Default: Layers,
};

export default function PropertyTypeIndex({ dbPropertyTypes, stats: serverStats, filters: serverFilters }) {
  const { t } = useTranslation();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Local dataset
  const [propertyTypeList, setPropertyTypeList] = useState(() => {
    if (dbPropertyTypes?.data && dbPropertyTypes.data.length > 0) {
      return dbPropertyTypes.data.map((pt) => ({
        id: pt.id,
        code: pt.code || `PT-${str_pad(pt.id, 3, '0')}`,
        name: pt.name,
        description: pt.description || '',
        icon: pt.icon || 'Apartment',
        properties_count: pt.properties_count || 0,
        status: pt.status ? pt.status.charAt(0).toUpperCase() + pt.status.slice(1) : 'Active',
        created_at: pt.created_at ? new Date(pt.created_at).toLocaleDateString() : 'Jan 2025',
        updated_at: pt.updated_at ? new Date(pt.updated_at).toLocaleDateString() : 'Aug 2026',
      }));
    }
    return INITIAL_PROPERTY_TYPES;
  });

  // Modal states
  const [selectedType, setSelectedType] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingType, setDeletingType] = useState(null);

  // Toggle active confirm modal
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingType, setTogglingType] = useState(null);

  const [actionProcessing, setActionProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const total = propertyTypeList.length;
    const active = propertyTypeList.filter((p) => p.status === 'Active').length;
    const inactive = propertyTypeList.filter((p) => p.status === 'Inactive').length;

    // Find most used type
    let mostUsed = { name: 'Apartment', count: 128 };
    if (propertyTypeList.length > 0) {
      const sortedByUsage = [...propertyTypeList].sort(
        (a, b) => (b.properties_count || 0) - (a.properties_count || 0)
      );
      if (sortedByUsage[0]) {
        mostUsed = {
          name: sortedByUsage[0].name,
          count: sortedByUsage[0].properties_count || 0,
        };
      }
    }

    return {
      total: serverStats?.total || total,
      active: serverStats?.active || active,
      inactive: serverStats?.inactive || inactive,
      mostUsed: serverStats?.most_used || mostUsed,
    };
  }, [propertyTypeList, serverStats]);

  // Filtering & Sorting logic
  const filteredTypes = useMemo(() => {
    return propertyTypeList.filter((pt) => {
      // Status filter
      if (statusFilter !== 'all' && pt.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Usage filter
      if (usageFilter === 'used' && (pt.properties_count || 0) === 0) {
        return false;
      }
      if (usageFilter === 'not_used' && (pt.properties_count || 0) > 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = pt.name.toLowerCase().includes(q);
        const matchesDesc = pt.description && pt.description.toLowerCase().includes(q);
        const matchesCode = pt.code && pt.code.toLowerCase().includes(q);

        if (!matchesName && !matchesDesc && !matchesCode) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOption === 'newest') return b.id - a.id;
      if (sortOption === 'oldest') return a.id - b.id;
      if (sortOption === 'most-used') return (b.properties_count || 0) - (a.properties_count || 0);
      if (sortOption === 'least-used') return (a.properties_count || 0) - (b.properties_count || 0);
      return 0;
    });
  }, [propertyTypeList, statusFilter, usageFilter, searchQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, usageFilter]);

  // Pagination bounds
  const totalItems = filteredTypes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTypes = filteredTypes.slice(startIndex, startIndex + itemsPerPage);

  const startRecordNum = totalItems === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + itemsPerPage, totalItems);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setUsageFilter('all');
    setSortOption('name-asc');
  };

  // Action handlers
  const handleViewDetails = (pt) => {
    setSelectedType(pt);
    setIsDetailModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingType(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (pt) => {
    setEditingType(pt);
    setIsFormModalOpen(true);
  };

  const handlePromptToggleActive = (pt) => {
    setTogglingType(pt);
    setIsToggleModalOpen(true);
  };

  const confirmToggleActive = () => {
    if (!togglingType) return;
    setActionProcessing(true);

    const isDeactivating = togglingType.status === 'Active';
    const newStatus = isDeactivating ? 'Inactive' : 'Active';

    setTimeout(() => {
      setPropertyTypeList((prev) =>
        prev.map((item) => (item.id === togglingType.id ? { ...item, status: newStatus } : item))
      );
      setActionProcessing(false);
      setIsToggleModalOpen(false);
      setTogglingType(null);
      setToastMessage(
        isDeactivating
          ? t('Property type deactivated successfully.')
          : t('Property type activated successfully.')
      );
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.put(route('property-types.toggle-active', togglingType.id), {}, { preserveScroll: true });
      } catch (e) {}
    }, 400);
  };

  const handlePromptDelete = (pt) => {
    setDeletingType(pt);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = (pt) => {
    setActionProcessing(true);

    setTimeout(() => {
      setPropertyTypeList((prev) => prev.filter((item) => item.id !== pt.id));
      setActionProcessing(false);
      setIsDeleteModalOpen(false);
      setDeletingType(null);
      setToastMessage(t('Property type deleted successfully.'));
      setTimeout(() => setToastMessage(''), 4000);

      try {
        router.delete(route('property-types.destroy', pt.id), { preserveScroll: true });
      } catch (e) {}
    }, 400);
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    setTimeout(() => {
      if (editingType) {
        setPropertyTypeList((prev) =>
          prev.map((pt) =>
            pt.id === editingType.id
              ? {
                  ...pt,
                  name: data.name,
                  description: data.description,
                  icon: data.icon,
                  status: data.status,
                  updated_at: 'Just now',
                }
              : pt
          )
        );
      } else {
        const nextId = Date.now();
        const newType = {
          id: nextId,
          code: `PT-${Math.floor(100 + Math.random() * 900)}`,
          name: data.name,
          description: data.description || 'Custom property type category.',
          icon: data.icon || 'Apartment',
          properties_count: 0,
          status: data.status || 'Active',
          created_at: 'Just now',
          updated_at: 'Just now',
        };
        setPropertyTypeList((prev) => [newType, ...prev]);
      }

      setActionProcessing(false);
      setIsFormModalOpen(false);
      setEditingType(null);
      setToastMessage(
        editingType
          ? t('Property type updated successfully.')
          : t('Property type created successfully.')
      );
      setTimeout(() => setToastMessage(''), 4000);

      try {
        if (editingType) {
          router.put(route('property-types.update', editingType.id), data, { preserveScroll: true });
        } else {
          router.post(route('property-types.store'), data, { preserveScroll: true });
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
      <Head title={t('Property Types')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <PageHeader
          title={t('Property Types')}
          description={t('Create and manage the property types available on the platform.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add Property Type')}
            </button>
          }
        />

        {/* 2. Summary Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Property Types */}
          <div className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-theme-accent/40 transition-all duration-200">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent ring-4 ring-theme-accent/5 group-hover:scale-105 transition-transform duration-200">
              <Layers className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Total Property Types')}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.total.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Active Types */}
          <div className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/60 group-hover:scale-105 transition-transform duration-200">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Active Types')}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.active.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Inactive Types */}
          <div className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 ring-4 ring-slate-100/60 group-hover:scale-105 transition-transform duration-200">
              <XCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Inactive Types')}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {stats.inactive.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Most Used Property Type */}
          <div className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/60 group-hover:scale-105 transition-transform duration-200">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Most Used Property Type')}</p>
              <p className="text-base font-bold text-slate-900 truncate mt-0.5" title={stats.mostUsed.name}>
                {stats.mostUsed.name}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                {stats.mostUsed.count} {t('Properties')}
              </span>
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
                placeholder={t('Search property types...')}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            {/* Clear filters & Sorting */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {(searchQuery || statusFilter !== 'all' || usageFilter !== 'all') && (
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
                <option value="name-asc">{t('Name A–Z')}</option>
                <option value="name-desc">{t('Name Z–A')}</option>
                <option value="newest">{t('Newest First')}</option>
                <option value="oldest">{t('Oldest First')}</option>
                <option value="most-used">{t('Most Used')}</option>
                <option value="least-used">{t('Least Used')}</option>
              </select>
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Statuses')}</option>
                <option value="active">{t('Active')}</option>
                <option value="inactive">{t('Inactive')}</option>
              </select>
            </div>

            {/* Usage Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Usage')}
              </label>
              <select
                value={usageFilter}
                onChange={(e) => setUsageFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Usage (Used & Unused)')}</option>
                <option value="used">{t('Used by Properties')}</option>
                <option value="not_used">{t('Not Used (0 Properties)')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 17. Error State */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-200 bg-red-50/50 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">{t('Unable to load property types.')}</h3>
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
          /* 16. Loading Skeleton State */
          <TableCard>
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-2xl bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </TableCard>
        ) : filteredTypes.length === 0 ? (
          /* 15. Empty State */
          <TableCard>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {searchQuery || statusFilter !== 'all' || usageFilter !== 'all'
                  ? t('No matching property types found.')
                  : t('No property types found')}
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {searchQuery || statusFilter !== 'all' || usageFilter !== 'all'
                  ? t('Try adjusting your search query or filter options.')
                  : t('Create your first property type to make it available when adding properties.')}
              </p>

              {searchQuery || statusFilter !== 'all' || usageFilter !== 'all' ? (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <RotateCcw className="h-4 w-4 text-slate-500" />
                  {t('Clear Filters')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-theme-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-theme-accent-hover transition shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  {t('Add Property Type')}
                </button>
              )}
            </div>
          </TableCard>
        ) : (
          /* 5. Property Types Table Layout */
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 w-[24%]">{t('Property Type')}</th>
                    <th className="px-5 py-3.5 w-[32%]">{t('Description')}</th>
                    <th className="px-5 py-3.5 w-[14%]">{t('Properties')}</th>
                    <th className="px-5 py-3.5 w-[12%]">{t('Status')}</th>
                    <th className="px-5 py-3.5 w-[10%]">{t('Created Date')}</th>
                    <th className="px-5 py-3.5 text-right w-[8%]">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {paginatedTypes.map((pt) => {
                    const IconComp = ICON_MAP[pt.name] || ICON_MAP[pt.icon] || ICON_MAP.Default;
                    const isActive = pt.status === 'Active' || pt.status === 'active';

                    return (
                      <tr key={pt.id} className="group hover:bg-slate-50/80 transition-colors">
                        {/* Property Type */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent shadow-2xs border border-theme-accent/20">
                              <IconComp className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-slate-900 truncate">{pt.name}</span>
                              <span className="text-[11px] font-mono font-medium text-slate-400">{pt.code || `PT-${pt.id}`}</span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-sm">
                            {pt.description || t('No description provided.')}
                          </p>
                        </td>

                        {/* Properties usage count */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                            <Building className="h-3.5 w-3.5 text-theme-accent" />
                            {pt.properties_count || 0} {t('Properties')}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {isActive ? t('Active') : t('Inactive')}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-5 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                          {pt.created_at}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(pt)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                              title={t('View Details')}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              {t('View')}
                            </button>

                            {/* Dropdown Menu */}
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
                                        onClick={() => handleEdit(pt)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                                          active ? 'bg-slate-50' : ''
                                        }`}
                                      >
                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                        {t('Edit Type')}
                                      </button>
                                    )}
                                  </Menu.Item>

                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handlePromptToggleActive(pt)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left ${
                                          isActive ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                                        } ${active ? (isActive ? 'bg-amber-50' : 'bg-emerald-50') : ''}`}
                                      >
                                        <Power className="h-3.5 w-3.5" />
                                        {isActive ? t('Deactivate') : t('Activate')}
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>

                                <div className="py-0.5">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handlePromptDelete(pt)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                                          active ? 'bg-red-50' : ''
                                        }`}
                                      >
                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        {t('Delete Type')}
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
              {paginatedTypes.map((pt) => {
                const IconComp = ICON_MAP[pt.name] || ICON_MAP[pt.icon] || ICON_MAP.Default;
                const isActive = pt.status === 'Active' || pt.status === 'active';

                return (
                  <div
                    key={pt.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent font-bold border border-theme-accent/20">
                          <IconComp className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{pt.name}</h4>
                          <span className="text-xs font-mono text-slate-400">{pt.code || `PT-${pt.id}`}</span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isActive ? t('Active') : t('Inactive')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{pt.description}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                      <span>{t('Properties')}: <strong className="text-slate-800">{pt.properties_count || 0}</strong></span>
                      <span>{pt.created_at}</span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(pt)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {t('View')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(pt)}
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

            {/* 14. Pagination Controls & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t('Showing :start–:end of :total property types', {
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

      {/* Property Type Detail Modal Workspace */}
      <PropertyTypeDetailModal
        open={isDetailModalOpen}
        propertyType={selectedType}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onToggleActive={handlePromptToggleActive}
      />

      {/* Form Modal (Add / Edit) */}
      <PropertyTypeFormModal
        open={isFormModalOpen}
        propertyType={editingType}
        existingTypes={propertyTypeList}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      {/* Activate / Deactivate Confirmation Modal */}
      <ConfirmModal
        open={isToggleModalOpen}
        title={
          togglingType?.status === 'Active'
            ? t('Deactivate Property Type?')
            : t('Activate Property Type?')
        }
        message={
          togglingType?.status === 'Active'
            ? t('Are you sure you want to deactivate this property type? It may no longer be available when creating new properties.')
            : t('Are you sure you want to activate this property type?')
        }
        confirmLabel={togglingType?.status === 'Active' ? t('Deactivate') : t('Activate')}
        cancelLabel={t('Cancel')}
        variant={togglingType?.status === 'Active' ? 'danger' : 'success'}
        processing={actionProcessing}
        onConfirm={confirmToggleActive}
        onCancel={() => {
          setIsToggleModalOpen(false);
          setTogglingType(null);
        }}
      />

      {/* Delete Safeguard Modal */}
      <PropertyTypeDeleteModal
        open={isDeleteModalOpen}
        propertyType={deletingType}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingType(null);
        }}
        onConfirmDelete={confirmDelete}
        onDeactivateInstead={(pt) => {
          setIsDeleteModalOpen(false);
          setDeletingType(null);
          handlePromptToggleActive(pt);
        }}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}
