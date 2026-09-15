import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Users, Eye, Plus, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import ProviderDetailModal from '@/Components/Modals/ProviderDetailModal';
import ProviderFormModal from '@/Components/Modals/ProviderFormModal';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import ProviderActionMenu from '@/Components/Table/ProviderActionMenu';

export default function ProviderIndex({ providers, categories, stats, filters }) {
  const { t } = useTranslation();
  const providerList = providers?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category || 'all');

  // Modals state
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProvider, setDeletingProvider] = useState(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingProvider, setTogglingProvider] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const handleSearch = (val) => {
    setSearchQuery(val);
    router.get(
      route('admin.providers.index'),
      {
        search: val,
        status: statusFilter,
        category: categoryFilter,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    router.get(
      route('admin.providers.index'),
      {
        search: searchQuery,
        status: val,
        category: categoryFilter,
      },
      { preserveState: true }
    );
  };

  const handleCategoryFilter = (val) => {
    setCategoryFilter(val);
    router.get(
      route('admin.providers.index'),
      {
        search: searchQuery,
        status: statusFilter,
        category: val,
      },
      { preserveState: true }
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    router.get(route('admin.providers.index'), {}, { preserveState: true });
  };

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
    router.delete(route('admin.providers.destroy', deletingProvider.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingProvider(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handlePromptToggleActive = (provider) => {
    setTogglingProvider(provider);
    setIsToggleModalOpen(true);
  };

  const confirmToggleActive = () => {
    if (!togglingProvider) return;
    setActionProcessing(true);
    router.put(
      route('admin.providers.toggle-active', togglingProvider.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingProvider(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    if (editingProvider) {
      router.put(route('admin.providers.update', editingProvider.id), data, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          setEditingProvider(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      });
    } else {
      router.post(route('admin.providers.store'), data, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      });
    }
  };

  const columns = [
    {
      key: 'provider',
      label: t('Provider'),
      render: (row) => {
        const initials = row.full_name
          ? row.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'P';
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-sm">
              {initials}
            </div>
            <div>
              <span className="block font-semibold text-slate-900 text-sm">{row.full_name}</span>
              <span className="block text-xs text-slate-400 font-mono">ID: {row.id}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      label: t('Contact Info'),
      render: (row) => (
        <div className="flex flex-col text-xs gap-1 text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            {row.email}
          </span>
          {row.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {row.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'service',
      label: t('Service & City'),
      render: (row) => (
        <div className="flex flex-col text-xs gap-1 text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            {row.service}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {row.location}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('Status'),
      render: (row) => {
        const isActive = row.status === 'Active' || row.status === 'active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'joined',
      label: t('Joined'),
      render: (row) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{row.joined}</span>
      ),
    },
    {
      key: 'actions',
      label: t('Actions'),
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleView(row)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            {t('View')}
          </button>

          <ProviderActionMenu
            provider={row}
            onView={handleView}
            onEdit={handleEdit}
            onPromptToggleActive={handlePromptToggleActive}
            onPromptDelete={handleDeletePrompt}
          />
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Provider Management')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Provider Management')}
          description={t('View and manage service provider accounts and classifications.')}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label={t('Total Providers')}
            value={stats.total.toLocaleString()}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-theme-accent"
            ringClass="ring-indigo-50/50"
          />
          <StatCard
            icon={Users}
            label={t('Active')}
            value={stats.active.toLocaleString()}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
            ringClass="ring-emerald-50/50"
          />
          <StatCard
            icon={Users}
            label={t('Inactive')}
            value={stats.inactive.toLocaleString()}
            iconBgClass="bg-slate-100"
            iconColorClass="text-slate-500"
            ringClass="ring-slate-100/60"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t('Search providers...')}
              className="md:max-w-md"
            />

            <div className="flex items-center gap-3 self-end md:self-auto">
              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <ClearFiltersButton onClick={handleClearFilters} className="h-[46px]" />
              )}

              <SelectInput
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="min-w-[160px]"
              >
                <option value="all">{t('All Statuses')}</option>
                <option value="active">{t('Active')}</option>
                <option value="inactive">{t('Inactive')}</option>
              </SelectInput>

              <SelectInput
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="min-w-[160px]"
              >
                <option value="all">{t('All Services')}</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>
        </div>

        {providerList.length === 0 ? (
          <TableCard>
            <EmptyState
              icon={Users}
              title={t('No providers found')}
              description={t('Try adjusting your search query or filter settings.')}
            />
          </TableCard>
        ) : (
          <TableCard>
            <DataTable columns={columns} rows={providerList} rowKey="id" />

            <div className="p-4 border-t border-slate-100">
              <Paginator links={providers.meta?.links || providers.links || []} />
            </div>
          </TableCard>
        )}
      </div>

      <ProviderDetailModal
        open={isViewModalOpen}
        provider={selectedProvider}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDeletePrompt}
        onToggleActive={handlePromptToggleActive}
      />

      <ProviderFormModal
        open={isFormModalOpen}
        provider={editingProvider}
        categories={categories}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProvider(null);
        }}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      <ConfirmModal
        open={isToggleModalOpen}
        title={
          togglingProvider?.status === 'Active'
            ? t('Deactivate Provider Account?')
            : t('Activate Provider Account?')
        }
        message={
          togglingProvider?.status === 'Active'
            ? t('Are you sure you want to deactivate the provider account for :name?', {
                name: togglingProvider?.full_name,
              })
            : t('Are you sure you want to activate the provider account for :name?', {
                name: togglingProvider?.full_name,
              })
        }
        confirmLabel={togglingProvider?.status === 'Active' ? t('Deactivate') : t('Activate')}
        cancelLabel={t('Cancel')}
        variant={togglingProvider?.status === 'Active' ? 'danger' : 'success'}
        onConfirm={confirmToggleActive}
        onCancel={() => {
          setIsToggleModalOpen(false);
          setTogglingProvider(null);
        }}
        processing={actionProcessing}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Provider Account?')}
        message={t(
          'Are you sure you want to permanently delete this provider account? This action cannot be undone.'
        )}
        confirmLabel={t('Delete')}
        cancelLabel={t('Cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingProvider(null);
        }}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}
