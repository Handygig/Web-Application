import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Wrench,
  Layers,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  DollarSign,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import ServiceDetailModal from '@/Components/Modals/ServiceDetailModal';
import ServiceFormModal from '@/Components/Modals/ServiceFormModal';
import ServiceActionMenu from '@/Components/Table/ServiceActionMenu';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';

export default function ServiceIndex({ services, categories = [], stats, filters }) {
  const { t } = useTranslation();
  const serviceList = services?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category_id || 'all');

  // Modal states
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Confirmation Modals
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingService, setTogglingService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const applyFilters = (newSearch, newStatus, newCategory) => {
    router.get(
      route('admin.services.index'),
      {
        search: newSearch,
        status: newStatus,
        category_id: newCategory,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleSearch = (val) => {
    setSearchQuery(val);
    applyFilters(val, statusFilter, categoryFilter);
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    applyFilters(searchQuery, val, categoryFilter);
  };

  const handleCategoryFilter = (val) => {
    setCategoryFilter(val);
    applyFilters(searchQuery, statusFilter, val);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    router.get(route('admin.services.index'), {}, { preserveState: true });
  };

  const handleViewDetails = (srv) => {
    setSelectedService(srv);
    setIsDetailModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (srv) => {
    setEditingService(srv);
    setIsFormModalOpen(true);
  };

  const handlePromptToggleActive = (srv) => {
    setTogglingService(srv);
    setIsToggleModalOpen(true);
  };

  const confirmToggleActive = () => {
    if (!togglingService) return;
    setActionProcessing(true);
    router.put(
      route('admin.services.toggle-active', togglingService.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingService(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handlePromptDelete = (srv) => {
    setDeletingService(srv);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingService) return;
    setActionProcessing(true);
    router.delete(route('admin.services.destroy', deletingService.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingService(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    if (editingService) {
      router.post(
        route('admin.services.update', editingService.id),
        { ...data, _method: 'PUT' },
        {
          forceFormData: true,
          preserveScroll: true,
          onSuccess: () => {
            setIsFormModalOpen(false);
            setEditingService(null);
            setActionProcessing(false);
          },
          onError: () => setActionProcessing(false),
        }
      );
    } else {
      router.post(route('admin.services.store'), data, {
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
      key: 'service',
      label: t('Service'),
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={row.name}
              className="h-10 w-10 shrink-0 rounded-2xl object-cover shadow-2xs border border-slate-200 bg-white"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent shadow-2xs border border-theme-accent/20">
              <Wrench className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <span className="block font-semibold text-slate-900 truncate">
              {row.name}
            </span>
            <span className="text-[11px] font-mono font-medium text-slate-400">
              {row.code || `SRV-${row.id}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: t('Category'),
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {row.category_name || (row.category?.service_name ?? '-')}
        </span>
      ),
    },
    {
      key: 'base_price',
      label: t('Base Price'),
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">
          {row.formatted_price ?? (row.base_price ? `$${Number(row.base_price).toFixed(2)}` : t('Flexible'))}
        </span>
      ),
    },
    {
      key: 'description',
      label: t('Description'),
      render: (row) => (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-xs">
          {row.description || t('No description provided.')}
        </p>
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

          <ServiceActionMenu
            service={row}
            onViewDetails={handleViewDetails}
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
      <Head title={t('Services')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Services')}
          description={t('Define specific services offered under service categories with base pricing and visual previews.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add Service')}
            </button>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label={t('Total Services')}
            value={stats?.total ?? 0}
            icon={Wrench}
            variant="default"
          />
          <StatCard
            label={t('Active Services')}
            value={stats?.active ?? 0}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            label={t('Inactive Services')}
            value={stats?.inactive ?? 0}
            icon={XCircle}
            variant="warning"
          />
        </div>

        {/* Table & Filter Card */}
        <TableCard>
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('Search by service name or description...')}
                className="w-full sm:max-w-xs"
              />

              <div className="w-48">
                <SelectInput
                  value={categoryFilter}
                  onChange={handleCategoryFilter}
                  className="w-full"
                >
                  <option value="all">{t('All Categories')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.service_name || c.name}
                    </option>
                  ))}
                </SelectInput>
              </div>

              <div className="w-36">
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

              {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <ClearFiltersButton onClick={handleClearFilters} />
              )}
            </div>
          </div>

          <div className="p-0">
            {serviceList.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title={t('No services found')}
                description={
                  searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? t('No services matched your active search and filter criteria.')
                    : t('Get started by creating your first service under a category.')
                }
                action={
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-theme-accent/20 hover:bg-theme-accent-hover transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t('Add Service')}
                  </button>
                }
              />
            ) : (
              <>
                <DataTable columns={columns} rows={serviceList} rowKey="id" />
                <div className="border-t border-slate-100 p-4">
                  <Paginator links={services?.meta?.links || services?.links || []} pagination={services} />
                </div>

              </>
            )}
          </div>
        </TableCard>
      </div>

      {/* Form Modal (Add / Edit) */}
      <ServiceFormModal
        open={isFormModalOpen}
        service={editingService}
        categories={categories}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Detail Modal */}
      <ServiceDetailModal
        open={isDetailModalOpen}
        service={selectedService}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedService(null);
        }}
        onEdit={(srv) => {
          setIsDetailModalOpen(false);
          handleEdit(srv);
        }}
      />

      {/* Toggle Status Confirmation */}
      <ConfirmModal
        open={isToggleModalOpen}
        title={
          togglingService?.is_active
            ? t('Deactivate Service')
            : t('Activate Service')
        }
        message={
          togglingService?.is_active
            ? t('Are you sure you want to deactivate :name? Customers will not be able to select it for bookings.', {
                name: togglingService?.name,
              })
            : t('Are you sure you want to activate :name? It will become available for customer bookings.', {
                name: togglingService?.name,
              })
        }
        confirmText={
          togglingService?.is_active ? t('Deactivate') : t('Activate')
        }
        confirmVariant={togglingService?.is_active ? 'warning' : 'primary'}
        loading={actionProcessing}
        onConfirm={confirmToggleActive}
        onClose={() => {
          setIsToggleModalOpen(false);
          setTogglingService(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Service')}
        message={t(
          'Are you sure you want to permanently delete :name? This action cannot be undone.',
          { name: deletingService?.name }
        )}
        confirmText={t('Delete Service')}
        confirmVariant="danger"
        loading={actionProcessing}
        onConfirm={confirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingService(null);
        }}
      />
    </AppLayout>
  );
}
