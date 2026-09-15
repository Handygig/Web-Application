import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Briefcase, CheckCircle2, XCircle, Plus, Eye } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import JobTypeDetailModal from '@/Components/Modals/JobTypeDetailModal';
import JobTypeFormModal from '@/Components/Modals/JobTypeFormModal';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import JobTypeActionMenu from '@/Components/Table/JobTypeActionMenu';

export default function JobTypeIndex({ jobTypes, stats, filters }) {
  const { t } = useTranslation();
  const jobTypeList = jobTypes?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

  // Modal states
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJobType, setEditingJobType] = useState(null);

  // Confirmation Modals
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingJobType, setTogglingJobType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingJobType, setDeletingJobType] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const handleSearch = (val) => {
    setSearchQuery(val);
    router.get(
      route('job-types.index'),
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
      route('job-types.index'),
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
    router.get(route('job-types.index'), {}, { preserveState: true });
  };

  const handleViewDetails = (jt) => {
    setSelectedJobType(jt);
    setIsDetailModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingJobType(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (jt) => {
    setEditingJobType(jt);
    setIsFormModalOpen(true);
  };

  const handlePromptToggleActive = (jt) => {
    setTogglingJobType(jt);
    setIsToggleModalOpen(true);
  };

  const confirmToggleActive = () => {
    if (!togglingJobType) return;
    setActionProcessing(true);
    router.put(
      route('job-types.toggle-active', togglingJobType.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingJobType(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handlePromptDelete = (jt) => {
    setDeletingJobType(jt);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingJobType) return;
    setActionProcessing(true);
    router.delete(route('job-types.destroy', deletingJobType.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingJobType(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    if (editingJobType) {
      router.put(route('job-types.update', editingJobType.id), data, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          setEditingJobType(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      });
    } else {
      router.post(route('job-types.store'), data, {
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
      key: 'jobType',
      label: t('Job Type'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent shadow-2xs border border-theme-accent/20">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-semibold text-slate-900 truncate">{row.name}</span>
            <span className="text-[11px] font-mono font-medium text-slate-400">{row.code}</span>
          </div>
        </div>
      ),
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

          <JobTypeActionMenu
            jobType={row}
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
      <Head title={t('Job Types')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Job Types')}
          description={t('Create and manage the job types available on the platform.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add Job Type')}
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Briefcase}
            label={t('Total Job Types')}
            value={stats.total.toLocaleString()}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-theme-accent"
            ringClass="ring-indigo-50/50"
          />
          <StatCard
            icon={CheckCircle2}
            label={t('Active')}
            value={stats.active.toLocaleString()}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
            ringClass="ring-emerald-50/50"
          />
          <StatCard
            icon={XCircle}
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
              placeholder={t('Search job types...')}
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

        {jobTypeList.length === 0 ? (
          <TableCard>
            <EmptyState
              icon={Briefcase}
              title={t('No job types found')}
              description={t('Try adjusting your search query or filter settings.')}
            />
          </TableCard>
        ) : (
          <TableCard>
            <DataTable columns={columns} rows={jobTypeList} rowKey="id" />

            <div className="p-4 border-t border-slate-100">
              <Paginator links={jobTypes.meta?.links || jobTypes.links || []} />
            </div>
          </TableCard>
        )}
      </div>

      <JobTypeDetailModal
        open={isDetailModalOpen}
        jobType={selectedJobType}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onToggleActive={handlePromptToggleActive}
      />

      <JobTypeFormModal
        open={isFormModalOpen}
        jobType={editingJobType}
        existingTypes={jobTypeList}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      <ConfirmModal
        open={isToggleModalOpen}
        title={
          togglingJobType?.status === 'Active' ? t('Deactivate Job Type?') : t('Activate Job Type?')
        }
        message={
          togglingJobType?.status === 'Active'
            ? t('Are you sure you want to deactivate this job type?')
            : t('Are you sure you want to activate this job type?')
        }
        confirmLabel={togglingJobType?.status === 'Active' ? t('Deactivate') : t('Activate')}
        cancelLabel={t('Cancel')}
        variant={togglingJobType?.status === 'Active' ? 'danger' : 'success'}
        onConfirm={confirmToggleActive}
        onCancel={() => {
          setIsToggleModalOpen(false);
          setTogglingJobType(null);
        }}
        processing={actionProcessing}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Job Type?')}
        message={t('Are you sure you want to delete this job type? This action cannot be undone.')}
        confirmLabel={t('Delete')}
        cancelLabel={t('Cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingJobType(null);
        }}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}
