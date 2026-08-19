import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Users,
  Eye,
  Edit3,
  Trash2,
  Filter,
  RotateCcw,
  Plus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import ProviderDetailModal from '@/Components/Modals/ProviderDetailModal';
import ProviderFormModal from '@/Components/Modals/ProviderFormModal';

const INITIAL_MOCK_PROVIDERS = [
  {
    id: 1,
    full_name: 'Marcus Vance',
    email: 'marcus.vance@servicepro.com',
    phone: '+1 555-0147',
    service: 'Plumbing & Pipefitting',
    location: 'New York, NY',
    status: 'Active',
    joined: 'Jan 10, 2025',
    bio: 'Licensed master plumber with 12+ years of residential and commercial experience.',
    rating: '4.9',
    reviews_count: 28,
  },
  {
    id: 2,
    full_name: 'Elena Rostova',
    email: 'elena.rostova@brightspark.io',
    phone: '+1 555-0284',
    service: 'Electrical & Automation',
    location: 'Chicago, IL',
    status: 'Active',
    joined: 'Feb 02, 2025',
    bio: 'Certified electrical technician specializing in modern smart home & EV charger installs.',
    rating: '4.8',
    reviews_count: 19,
  },
  {
    id: 3,
    full_name: 'David Sterling',
    email: 'david.sterling@hvacexperts.com',
    phone: '+1 555-0391',
    service: 'HVAC & Climate Control',
    location: 'Austin, TX',
    status: 'Inactive',
    joined: 'Feb 15, 2025',
    bio: 'Heating and cooling system installer specializing in energy efficient heat pumps.',
    rating: '4.6',
    reviews_count: 14,
  },
  {
    id: 4,
    full_name: 'Sarah Jenkins',
    email: 'sarah.j@greenhouseclean.com',
    phone: '+1 555-0482',
    service: 'Deep Cleaning & Sanitization',
    location: 'Los Angeles, CA',
    status: 'Active',
    joined: 'Mar 01, 2025',
    bio: 'Eco-friendly cleaning specialist providing eco-certified home and office sanitization.',
    rating: '5.0',
    reviews_count: 34,
  },
  {
    id: 5,
    full_name: 'Carlos Ruiz',
    email: 'carlos.ruiz@handymanpro.net',
    phone: '+1 555-0573',
    service: 'General Carpentry & Repairs',
    location: 'Miami, FL',
    status: 'Active',
    joined: 'Mar 18, 2025',
    bio: 'Skilled handyman with expertise in custom cabinetry, drywalls, and general home repair.',
    rating: '4.7',
    reviews_count: 22,
  },
  {
    id: 6,
    full_name: 'Amina Al-Mansoor',
    email: 'amina@solarfit.org',
    phone: '+1 555-0619',
    service: 'Solar & Renewable Energy',
    location: 'Seattle, WA',
    status: 'Active',
    joined: 'Apr 04, 2025',
    bio: 'Renewable energy contractor providing rooftop solar panel installation and battery backup systems.',
    rating: '4.9',
    reviews_count: 17,
  },
  {
    id: 7,
    full_name: 'Kenneth Thorne',
    email: 'k.thorne@pestshield.com',
    phone: '+1 555-0728',
    service: 'Pest Control & Prevention',
    location: 'Dallas, TX',
    status: 'Inactive',
    joined: 'Apr 20, 2025',
    bio: 'Professional pest control inspector providing organic and traditional pest elimination.',
    rating: '4.5',
    reviews_count: 11,
  },
  {
    id: 8,
    full_name: 'Olivia Chen',
    email: 'olivia.chen@landscapes.co',
    phone: '+1 555-0835',
    service: 'Lawn Care & Landscaping',
    location: 'Denver, CO',
    status: 'Active',
    joined: 'May 02, 2025',
    bio: 'Landscape architect and lawn maintenance contractor for luxury residential properties.',
    rating: '4.8',
    reviews_count: 30,
  },
];

export default function ProviderIndex({ providers: serverProviders, categories: serverCategories, filters: serverFilters }) {
  const { t } = useTranslation();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Local dataset initialized with server data or fallback mock dataset
  const [providerList, setProviderList] = useState(() => {
    if (serverProviders?.data && serverProviders.data.length > 0) {
      return serverProviders.data.map((p) => ({
        id: p.id,
        full_name: p.user?.full_name || p.full_name || 'Provider User',
        email: p.user?.email || p.email || '',
        phone: p.user?.phone || p.phone || '',
        service: p.service_categories?.[0]?.service_name || p.service || 'General Service',
        location: p.location || 'New York, NY',
        status: p.user?.status === 'active' || p.status === 'Active' ? 'Active' : 'Inactive',
        joined: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 2025',
        bio: p.bio || 'Registered service provider.',
      }));
    }
    return INITIAL_MOCK_PROVIDERS;
  });

  // Modals state
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProvider, setDeletingProvider] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  // Derive available categories & locations for filters
  const categoryOptions = useMemo(() => {
    const set = new Set();
    providerList.forEach((p) => {
      if (p.service) set.add(p.service);
    });
    if (serverCategories) {
      serverCategories.forEach((cat) => set.add(cat));
    }
    return Array.from(set);
  }, [providerList, serverCategories]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    providerList.forEach((p) => {
      if (p.location) set.add(p.location);
    });
    return Array.from(set);
  }, [providerList]);

  // Filtering logic
  const filteredProviders = useMemo(() => {
    return providerList.filter((p) => {
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        (p.full_name && p.full_name.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        (p.service && p.service.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.status === 'Active') ||
        (statusFilter === 'inactive' && p.status === 'Inactive');

      const matchesCategory =
        categoryFilter === 'all' || p.service === categoryFilter;

      const matchesLocation =
        locationFilter === 'all' || p.location === locationFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  }, [providerList, searchQuery, statusFilter, categoryFilter, locationFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, locationFilter]);

  // Pagination calculation
  const totalItems = filteredProviders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProviders = filteredProviders.slice(startIndex, startIndex + itemsPerPage);

  const startRecordNum = totalItems === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + itemsPerPage, totalItems);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setLocationFilter('all');
  };

  // Actions
  const handleView = (provider) => {
    setSelectedProvider(provider);
    setIsViewModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setIsFormModalOpen(true);
  };

  const handleDeletePrompt = (provider) => {
    setDeletingProvider(provider);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingProvider) return;
    setActionProcessing(true);

    setTimeout(() => {
      setProviderList((prev) => prev.filter((p) => p.id !== deletingProvider.id));
      setActionProcessing(false);
      setIsDeleteModalOpen(false);
      setDeletingProvider(null);

      // Trigger server request if route available
      try {
        router.delete(route('admin.providers.destroy', deletingProvider.id), {
          preserveScroll: true,
          onError: () => {},
        });
      } catch (e) {
        // Fallback gracefully for pure mock environment
      }
    }, 400);
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    setTimeout(() => {
      if (editingProvider) {
        setProviderList((prev) =>
          prev.map((p) =>
            p.id === editingProvider.id
              ? {
                  ...p,
                  full_name: data.full_name,
                  email: data.email,
                  phone: data.phone,
                  service: data.service_category,
                  location: data.location,
                  bio: data.bio,
                  status: data.status === 'active' ? 'Active' : 'Inactive',
                }
              : p
          )
        );
      } else {
        const newProvider = {
          id: Date.now(),
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || '+1 555-0000',
          service: data.service_category || 'General Service',
          location: data.location || 'New York, NY',
          status: data.status === 'active' ? 'Active' : 'Inactive',
          joined: 'Just now',
          bio: data.bio || 'Newly added service provider.',
          rating: '5.0',
          reviews_count: 1,
        };
        setProviderList((prev) => [newProvider, ...prev]);
      }
      setActionProcessing(false);
      setIsFormModalOpen(false);
      setEditingProvider(null);

      try {
        if (editingProvider) {
          router.put(route('admin.providers.update', editingProvider.id), data, { preserveScroll: true });
        } else {
          router.post(route('admin.providers.store'), data, { preserveScroll: true });
        }
      } catch (e) {}
    }, 400);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <AppLayout>
      <Head title={t('View Providers')} />

      <div className="flex w-full flex-col gap-6">
        {/* 1. Page Header */}
        <PageHeader
          title={t('View Providers')}
          description={t('View and manage all registered service providers.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add Provider')}
            </button>
          }
        />

        {/* 2 & 3. Search and Filters Section */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-sm">
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
                placeholder={t('Search providers...')}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            {/* Clear Filters button */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  {t('Clear Filters')}
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2 text-xs font-semibold text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Statuses')}</option>
                <option value="active">{t('Active')}</option>
                <option value="inactive">{t('Inactive')}</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Category / Service')}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2 text-xs font-semibold text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Categories')}</option>
                {categoryOptions.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('Location')}
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2 text-xs font-semibold text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
              >
                <option value="all">{t('All Locations')}</option>
                {locationOptions.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 10. Error State */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-200 bg-red-50/50 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">{t('Failed to load providers')}</h3>
            <p className="text-sm text-slate-600 mt-1 mb-4">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
              {t('Retry')}
            </button>
          </div>
        ) : loading ? (
          /* 9. Loading Skeleton State */
          <TableCard>
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 w-1/4">
                    <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-1/5"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </TableCard>
        ) : filteredProviders.length === 0 ? (
          /* 8. Empty State */
          <TableCard>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t('No providers found')}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {t('Try changing your search or filters, or add a new provider.')}
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-6 bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                {t('Add Provider')}
              </button>
            </div>
          </TableCard>
        ) : (
          /* 4. Provider List Layout */
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5">{t('Provider')}</th>
                    <th className="px-5 py-3.5">{t('Contact')}</th>
                    <th className="px-5 py-3.5">{t('Service')}</th>
                    <th className="px-5 py-3.5">{t('Location')}</th>
                    <th className="px-5 py-3.5">{t('Status')}</th>
                    <th className="px-5 py-3.5 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {paginatedProviders.map((provider) => {
                    const isActive = provider.status === 'Active';
                    const initials = provider.full_name
                      ? provider.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'P';

                    return (
                      <tr
                        key={provider.id}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Provider column: avatar + name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-sm shadow-xs border border-theme-accent/20">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-slate-900 truncate">
                                {provider.full_name}
                              </span>
                              <span className="text-xs text-slate-400">
                                {t('Joined')}: {provider.joined}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact column: email + phone */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {provider.email}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {provider.phone}
                            </span>
                          </div>
                        </td>

                        {/* Service column */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-theme-accent border border-indigo-100">
                            <Briefcase className="h-3.5 w-3.5" />
                            {provider.service}
                          </span>
                        </td>

                        {/* Location column */}
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {provider.location}
                          </span>
                        </td>

                        {/* Status column */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            {isActive ? t('Active') : t('Inactive')}
                          </span>
                        </td>

                        {/* Actions column: View / Edit / Delete */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleView(provider)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
                              title={t('View Profile')}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              {t('View')}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(provider)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
                              title={t('Edit Provider')}
                            >
                              <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                              {t('Edit')}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePrompt(provider)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition shadow-2xs"
                              title={t('Delete Provider')}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              {t('Delete')}
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
              {paginatedProviders.map((provider) => {
                const isActive = provider.status === 'Active';
                const initials = provider.full_name
                  ? provider.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'P';

                return (
                  <div
                    key={provider.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-base border border-theme-accent/20">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{provider.full_name}</h4>
                          <span className="text-xs text-slate-400">{provider.service}</span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isActive ? t('Active') : t('Inactive')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{provider.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{provider.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{provider.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleView(provider)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {t('View')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(provider)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                        {t('Edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePrompt(provider)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50/60 p-2 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 7. Pagination Controls & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t('Showing :start–:end of :total providers', {
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
                          ? 'bg-theme-accent text-white shadow-xs'
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

      {/* 6. View Provider Profile Modal */}
      <ProviderDetailModal
        open={isViewModalOpen}
        provider={selectedProvider}
        onClose={() => setIsViewModalOpen(false)}
      />

      {/* Add / Edit Provider Modal */}
      <ProviderFormModal
        open={isFormModalOpen}
        provider={editingProvider}
        categories={categoryOptions}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      {/* 5. Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Provider')}
        message={t('Are you sure you want to delete this provider? This action cannot be undone.')}
        confirmLabel={t('Delete')}
        cancelLabel={t('Cancel')}
        variant="danger"
        processing={actionProcessing}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingProvider(null);
        }}
      />
    </AppLayout>
  );
}
