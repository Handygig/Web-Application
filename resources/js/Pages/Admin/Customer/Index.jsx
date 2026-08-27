import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  ShieldAlert,
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
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import CustomerActionMenu from '@/Components/Table/CustomerActionMenu';

export default function CustomerIndex({ dbCustomers, stats, filters }) {
  const { t } = useTranslation();
  const customerList = dbCustomers?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [sortOption, setSortOption] = useState('newest');

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendingCustomer, setSuspendingCustomer] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banningCustomer, setBanningCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const handleSearch = (val) => {
    setSearchQuery(val);
    router.get(route('admin.customers.index'), {
      search: val,
      status: statusFilter,
    }, { preserveState: true, replace: true });
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    router.get(route('admin.customers.index'), {
      search: searchQuery,
      status: val,
    }, { preserveState: true });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    router.get(route('admin.customers.index'), {}, { preserveState: true });
  };

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
    router.patch(route('admin.customers.suspend', suspendingCustomer.id), { reason }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSuspendModalOpen(false);
        setSuspendingCustomer(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handlePromptBan = (c) => {
    setBanningCustomer(c);
    setIsBanModalOpen(true);
  };

  const confirmBan = (banData) => {
    if (!banningCustomer) return;
    setActionProcessing(true);
    router.patch(route('admin.customers.ban', banningCustomer.id), banData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsBanModalOpen(false);
        setBanningCustomer(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handleReactivate = (c) => {
    setActionProcessing(true);
    router.patch(route('admin.customers.activate', c.id), {}, {
      preserveScroll: true,
      onSuccess: () => setActionProcessing(false),
      onError: () => setActionProcessing(false),
    });
  };

  const handlePromptDelete = (c) => {
    setDeletingCustomer(c);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingCustomer) return;
    setActionProcessing(true);
    router.delete(route('admin.customers.destroy', deletingCustomer.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingCustomer(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const handleFormSubmit = (data) => {
    setActionProcessing(true);
    if (editingCustomer) {
      router.put(route('admin.customers.update', editingCustomer.id), data, {
        preserveScroll: true,
        onSuccess: () => {
          setIsFormModalOpen(false);
          setEditingCustomer(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      });
    } else {
      router.post(route('admin.customers.store'), data, {
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
      key: 'customer',
      label: t('Customer'),
      render: (row) => {
        const initials = row.full_name
          ? row.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
          : 'C';
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-sm">
              {initials}
            </div>
            <div>
              <span className="block font-semibold text-slate-900 text-sm">{row.full_name}</span>
              <span className="block text-xs text-slate-400 font-mono">{row.customerId}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      label: t('Contact Info'),
      render: (row) => (
        <div className="flex flex-col text-xs gap-0.5">
          <span className="font-semibold text-slate-800">{row.email}</span>
          {row.phone && <span className="text-slate-400">{row.phone}</span>}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('Status'),
      render: (row) => {
        const s = row.status.toLowerCase();
        let badgeClass = 'bg-slate-50 text-slate-600 border border-slate-200';
        let dotClass = 'bg-slate-400';

        if (s === 'active') {
          badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
          dotClass = 'bg-emerald-500';
        } else if (s === 'suspended') {
          badgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
          dotClass = 'bg-amber-500';
        } else if (s === 'banned') {
          badgeClass = 'bg-red-50 text-red-700 border border-red-200';
          dotClass = 'bg-red-500';
        }

        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'joined',
      label: t('Member Since'),
      render: (row) => <span className="text-slate-600 text-sm">{row.joined}</span>,
    },
    {
      key: 'actions',
      label: t('Actions'),
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <CustomerActionMenu
            customer={row}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onPromptSuspend={handlePromptSuspend}
            onReactivate={handleReactivate}
            onPromptBan={handlePromptBan}
            onPromptDelete={handlePromptDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Customer Management')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Customer Management')}
          description={t('View and manage customer accounts and activity.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" />
              <span>{t('Add Customer')}</span>
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label={t('Total Customers')}
            value={stats.total.toLocaleString()}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-theme-accent"
            ringClass="ring-indigo-50/50"
          />
          <StatCard
            icon={UserCheck}
            label={t('Active')}
            value={stats.active.toLocaleString()}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
            ringClass="ring-emerald-50/50"
          />
          <StatCard
            icon={UserX}
            label={t('Suspended')}
            value={stats.suspended.toLocaleString()}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
            ringClass="ring-amber-50/50"
          />
          <StatCard
            icon={ShieldAlert}
            label={t('Banned')}
            value={stats.banned.toLocaleString()}
            iconBgClass="bg-red-50"
            iconColorClass="text-red-600"
            ringClass="ring-red-50/50"
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t('Search customers...')}
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
                <option value="suspended">{t('Suspended')}</option>
                <option value="banned">{t('Banned')}</option>
              </SelectInput>
            </div>
          </div>
        </div>

        {customerList.length === 0 ? (
          <TableCard>
            <EmptyState
              icon={Users}
              title={t('No customers found')}
              description={t('Try adjusting your search query or filter settings.')}
            />
          </TableCard>
        ) : (
          <TableCard>
            <DataTable columns={columns} rows={customerList} rowKey="id" />

            <div className="p-4 border-t border-slate-100">
              <Paginator links={dbCustomers.meta?.links || dbCustomers.links || []} />
            </div>
          </TableCard>
        )}
      </div>

      <CustomerDetailModal
        open={isDetailModalOpen}
        customer={selectedCustomer}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onSuspend={handlePromptSuspend}
        onActivate={handleReactivate}
        onBan={handlePromptBan}
      />

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

      <CustomerFormModal
        open={isFormModalOpen}
        customer={editingCustomer}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleFormSubmit}
        processing={actionProcessing}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete Customer Account?')}
        message={t('Are you sure you want to permanently delete this customer account? This action cannot be undone.')}
        confirmLabel={t('Delete Account')}
        cancelLabel={t('Keep Account')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingCustomer(null);
        }}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}
