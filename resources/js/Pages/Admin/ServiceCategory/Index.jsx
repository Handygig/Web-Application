import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Layers,
  Sparkles,
  Wrench,
  Zap,
  Paintbrush,
  Sprout,
  Tv,
  Wind,
  ShieldCheck,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import ServiceCategoryDetailModal from '@/Components/Modals/ServiceCategoryDetailModal';
import ServiceCategoryFormModal from '@/Components/Modals/ServiceCategoryFormModal';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import ServiceCategoryActionMenu from '@/Components/Table/ServiceCategoryActionMenu';

const ICON_MAP = {
  cleaning: Sparkles,
  plumbing: Wrench,
  electrical: Zap,
  painting: Paintbrush,
  gardening: Sprout,
  appliances: Tv,
  hvac: Wind,
  security: ShieldCheck,
  general: Layers,
  default: Layers,
};

export default function ServiceCategoryIndex({ serviceCategories, stats, filters }) {
  const { t } = useTranslation();
  const categoryList = serviceCategories?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

  // Modal states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Confirmation Modals
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingCategory, setTogglingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const handleSearch = (val) => {
    setSearchQuery(val);
    router.get(
      route('admin.service-categories.index'),
      {
        search: val,
        status: statusFilter,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    router.get(
      route('admin.service-categories.index'),
      {
        search: searchQuery,
        status: val,
      },
      { preserveState: true }
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    router.get(route('admin.service-categories.index'), {}, { preserveState: true });
  };

  const handleViewDetails = (cat) => {
    setSelectedCategory(cat);
    setIsDetailModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setIsFormModalOpen(true);
  };

  const handlePromptToggleActive = (cat) => {
    setTogglingCategory(cat);
    setIsToggleModalOpen(true);
  };

  const confirmToggleActive = () => {
    if (!togglingCategory) return;
    setActionProcessing(true);
    router.put(
      route('admin.service-categories.toggle-active', togglingCategory.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingCategory(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handlePromptDelete = (cat) => {
    setDeletingCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingCategory) return;
    setActionProcessing(true);
    router.delete(route('admin.service-categories.destroy', deletingCategory.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingCategory(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    if (editingCategory) {
      router.post(
        route('admin.service-categories.update', editingCategory.id),
        { ...data, _method: 'PUT' },
        {
          forceFormData: true,
          preserveScroll: true,
          onSuccess: () => {
            setIsFormModalOpen(false);
            setEditingCategory(null);
            setActionProcessing(false);
          },
          onError: () => setActionProcessing(false),
        }
      );
    } else {
      router.post(route('admin.service-categories.store'), data, {
        forceFormData: true,
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
      key: 'serviceCategory',
      label: t('Service Category'),
      render: (row) => {
        const iconKey = (row.icon || row.service_name || row.name || '').toLowerCase();
        const IconComponent = ICON_MAP[iconKey] || ICON_MAP.default;

        return (
          <div className="flex items-center gap-3">
            {row.image_url ? (
              <img
                src={row.image_url}
                alt={row.service_name || row.name}
                className="h-10 w-10 shrink-0 rounded-2xl object-cover shadow-2xs border border-slate-200 bg-white"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent shadow-2xs border border-theme-accent/20">
                <IconComponent className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <span className="block font-semibold text-slate-900 truncate">
                {row.service_name || row.name}
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                {row.code || `CAT-${row.id}`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'description',
      label: t('Description'),
      render: (row) => (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {row.description || t('No description provided.')}
        </p>
      ),
    },
    {
      key: 'servicesCount',
      label: t('Services'),
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.servicesCount ?? row.services_count ?? 0}
        </span>
      ),
    },
    {
      key: 'providersCount',
      label: t('Providers'),
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {row.providersCount ?? 0}
        </span>
      ),
    },
    {
      key: 'jobRequestsCount',
      label: t('Requests'),
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {row.jobRequestsCount ?? 0}
        </span>
      ),
    },
    {
      key: 'status',
      label: t('Status'),
      render: (row) => {
        const isActive = Boolean(row.is_active);
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
            {isActive ? t('Active') : t('Inactive')}
          </span>
        );
      },
    },
    {
      key: 'createdDate',
      label: t('Created Date'),
      render: (row) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
          {row.createdDate}
        </span>
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
            onClick={() => handleViewDetails(row)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            {t('View')}
          </button>

          <ServiceCategoryActionMenu
            category={row}
            onEdit={handleEdit}
            onPromptToggleActive={handlePromptToggleActive}
            onPromptDelete={handlePromptDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Service Categories')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Service Categories')}
          description={t('Create, manage, and structure service categories available on mobile apps and provider offerings.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add Category')}
            </button>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label={t('Total Categories')}
            value={stats?.total ?? 0}
            icon={Layers}
            variant="default"
          />
          <StatCard
            label={t('Active Categories')}
            value={stats?.active ?? 0}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            label={t('Inactive Categories')}
            value={stats?.inactive ?? 0}
            icon={XCircle}
            variant="warning"
          />
        </div>

        {/* Table & Filter Card */}
        <TableCard>
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('Search by category name, description...')}
                className="w-full sm:max-w-xs"
              />

              <div className="w-40">
                <SelectInput
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="w-full"
                >
                  <option value="all">{t('All Status')}</option>
                  <option value="active">{t('Active')}</option>
                  <option value="inactive">{t('Inactive')}</option>
                </SelectInput>
              </div>

              {(searchQuery || statusFilter !== 'all') && (
                <ClearFiltersButton onClick={handleClearFilters} />
              )}
            </div>
          </div>

          {categoryList.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Layers}
                title={t('No service categories found')}
                description={t('No categories matched your search criteria or none have been added yet.')}
                actionLabel={t('Add Service Category')}
                onAction={handleOpenAdd}
              />
            </div>
          ) : (
            <>
              <DataTable columns={columns} rows={categoryList} rowKey="id" />
              <div className="p-4 border-t border-slate-100">
                <Paginator links={serviceCategories.meta?.links || serviceCategories.links || []} />
              </div>
            </>
          )}
        </TableCard>
      </div>

      {/* Details Modal */}
      <ServiceCategoryDetailModal
        open={isDetailModalOpen}
        category={selectedCategory}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(cat) => handleEdit(cat)}
      />

      {/* Form Modal (Add / Edit) */}
      <ServiceCategoryFormModal
        open={isFormModalOpen}
        category={editingCategory}
        existingCategories={categoryList}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Toggle Active Confirmation Modal */}
      <ConfirmModal
        open={isToggleModalOpen}
        title={
          togglingCategory?.is_active
            ? t('Deactivate Category?')
            : t('Activate Category?')
        }
        message={
          togglingCategory?.is_active
            ? t('Deactivating this category will hide it from mobile service selection for customers.')
            : t('Activating this category makes it discoverable and bookable in the customer mobile app.')
        }
        confirmLabel={togglingCategory?.is_active ? t('Deactivate') : t('Activate')}
        variant={togglingCategory?.is_active ? 'danger' : 'success'}
        loading={actionProcessing}
        onConfirm={confirmToggleActive}
        onClose={() => {
          setIsToggleModalOpen(false);
          setTogglingCategory(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Service Category?')}
        message={t('Are you sure you want to permanently delete this category? This action cannot be undone.')}
        confirmLabel={t('Delete')}
        variant="danger"
        loading={actionProcessing}
        onConfirm={confirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCategory(null);
        }}
      />
    </AppLayout>
  );
}
