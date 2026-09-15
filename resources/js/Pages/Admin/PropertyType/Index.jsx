import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Layers,
  Building2,
  Home as HomeIcon,
  Hotel,
  Briefcase,
  Building,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  Plus,
  Eye,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import PropertyTypeDetailModal from '@/Components/Modals/PropertyTypeDetailModal';
import PropertyTypeFormModal from '@/Components/Modals/PropertyTypeFormModal';
import PropertyTypeDeleteModal from '@/Components/Modals/PropertyTypeDeleteModal';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import PropertyTypeActionMenu from '@/Components/Table/PropertyTypeActionMenu';

const ICON_MAP = {
  Apartment: Building2,
  House: HomeIcon,
  Villa: HomeIcon,
  Hotel: Hotel,
  Office: Briefcase,
  Commercial: Building,
  Land: Layers,
  Default: Layers,
};

export default function PropertyTypeIndex({ dbPropertyTypes, stats, filters }) {
  const { t } = useTranslation();
  const propertyTypeList = dbPropertyTypes?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

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

  const handleSearch = (val) => {
    setSearchQuery(val);
    router.get(
      route('property-types.index'),
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
      route('property-types.index'),
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
    router.get(route('property-types.index'), {}, { preserveState: true });
  };

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
    router.put(
      route('property-types.toggle-active', togglingType.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingType(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handlePromptDelete = (pt) => {
    setDeletingType(pt);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingType) return;
    setActionProcessing(true);
    router.delete(route('property-types.destroy', deletingType.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingType(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    if (editingType) {
      router.put(route('property-types.update', editingType.id), data, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          setEditingType(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      });
    } else {
      router.post(route('property-types.store'), data, {
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
      key: 'propertyType',
      label: t('Property Type'),
      render: (row) => {
        const IconComp = ICON_MAP[row.name] || ICON_MAP[row.icon] || ICON_MAP.Default;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent shadow-2xs border border-theme-accent/20">
              <IconComp className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block font-semibold text-slate-900 truncate">{row.name}</span>
              <span className="text-[11px] font-mono font-medium text-slate-400">{row.code}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'description',
      label: t('Description'),
      render: (row) => (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-sm">
          {row.description || t('No description provided.')}
        </p>
      ),
    },
    {
      key: 'properties',
      label: t('Properties'),
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
          <Building className="h-3.5 w-3.5 text-theme-accent" />
          {row.properties_count || 0} {t('Properties')}
        </span>
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
      key: 'created_at',
      label: t('Created Date'),
      render: (row) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
          {row.created_at}
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

          <PropertyTypeActionMenu
            propertyType={row}
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
      <Head title={t('Property Types')} />

      <div className="flex w-full flex-col gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Layers}
            label={t('Total Property Types')}
            value={stats.total.toLocaleString()}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-theme-accent"
            ringClass="ring-indigo-50/50"
          />
          <StatCard
            icon={CheckCircle2}
            label={t('Active Types')}
            value={stats.active.toLocaleString()}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
            ringClass="ring-emerald-50/50"
          />
          <StatCard
            icon={XCircle}
            label={t('Inactive Types')}
            value={stats.inactive.toLocaleString()}
            iconBgClass="bg-slate-100"
            iconColorClass="text-slate-500"
            ringClass="ring-slate-100/60"
          />
          <StatCard
            icon={TrendingUp}
            label={t('Most Used Type')}
            value={stats.mostUsed?.name || 'Apartment'}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
            ringClass="ring-amber-50/60"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t('Search property types...')}
              className="md:max-w-md"
            />

            <div className="flex items-center gap-3 self-end md:self-auto">
              {(searchQuery || statusFilter !== 'all') && (
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
            </div>
          </div>
        </div>

        {propertyTypeList.length === 0 ? (
          <TableCard>
            <EmptyState
              icon={Layers}
              title={t('No property types found')}
              description={t('Try adjusting your search query or filter settings.')}
            />
          </TableCard>
        ) : (
          <TableCard>
            <DataTable columns={columns} rows={propertyTypeList} rowKey="id" />

            <div className="p-4 border-t border-slate-100">
              <Paginator links={dbPropertyTypes.meta?.links || dbPropertyTypes.links || []} />
            </div>
          </TableCard>
        )}
      </div>

      <PropertyTypeDetailModal
        open={isDetailModalOpen}
        type={selectedType}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onToggleActive={handlePromptToggleActive}
        onDelete={handlePromptDelete}
      />

      <PropertyTypeFormModal
        open={isFormModalOpen}
        type={editingType}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingType(null);
        }}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      <ConfirmModal
        open={isToggleModalOpen}
        title={toggledTitle(togglingType, t)}
        message={toggledMessage(togglingType, t)}
        confirmLabel={togglingType?.status === 'Active' ? t('Deactivate') : t('Activate')}
        cancelLabel={t('Cancel')}
        variant={togglingType?.status === 'Active' ? 'warning' : 'primary'}
        onConfirm={confirmToggleActive}
        onCancel={() => {
          setIsToggleModalOpen(false);
          setTogglingType(null);
        }}
        processing={actionProcessing}
      />

      <PropertyTypeDeleteModal
        open={isDeleteModalOpen}
        type={deletingType}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingType(null);
        }}
        onConfirm={confirmDelete}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}

function toggledTitle(type, t) {
  if (!type) return '';
  return type.status === 'Active' ? t('Deactivate Property Type?') : t('Activate Property Type?');
}

function toggledMessage(type, t) {
  if (!type) return '';
  return type.status === 'Active'
    ? t(
        'Are you sure you want to deactivate the :name property type? It will not be selectable for new properties.',
        { name: type.name }
      )
    : t('Are you sure you want to activate the :name property type?', { name: type.name });
}
