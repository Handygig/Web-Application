import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Tag,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Copy,
  TrendingUp,
  Sparkles,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import ExclusiveOfferFormModal from '@/Components/Modals/ExclusiveOfferFormModal';
import ExclusiveOfferDetailModal from '@/Components/Modals/ExclusiveOfferDetailModal';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import StatCard from '@/Components/Cards/StatCard';
import EmptyState from '@/Components/Other/EmptyState';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';

export default function ExclusiveOfferIndex({ offers, stats, filters }) {
  const { t } = useTranslation();
  const offerList = offers?.data || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

  // Modal states
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Confirmation Modals
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingOffer, setTogglingOffer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOffer, setDeletingOffer] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const applyFilters = (newSearch, newStatus) => {
    router.get(
      route('admin.exclusive-offers.index'),
      {
        search: newSearch,
        status: newStatus,
      },
      { preserveState: true, replace: true }
    );
  };

  const handleSearch = (val) => {
    setSearchQuery(val);
    applyFilters(val, statusFilter);
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    applyFilters(searchQuery, val);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    router.get(route('admin.exclusive-offers.index'), {}, { preserveState: true });
  };

  const handleViewDetails = (offer) => {
    setSelectedOffer(offer);
    setIsDetailModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormModalOpen(true);
  };

  const handlePromptToggleActive = (offer) => {
    setTogglingOffer(offer);
    setIsToggleModalOpen(true);
  };

  const handleConfirmToggleActive = () => {
    if (!togglingOffer) return;
    setActionProcessing(true);
    router.put(
      route('admin.exclusive-offers.toggle-active', togglingOffer.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingOffer(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handlePromptDelete = (offer) => {
    setDeletingOffer(offer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingOffer) return;
    setActionProcessing(true);
    router.delete(route('admin.exclusive-offers.destroy', deletingOffer.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingOffer(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const columns = [
    {
      key: 'offer',
      label: t('Offer & Campaign'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-black/10 text-white"
            style={{
              background: `linear-gradient(135deg, ${row.gradient_start || '#3D4127'}, ${row.gradient_end || '#636B2F'})`,
            }}
          >
            <Tag className="w-5 h-5" style={{ color: row.accent_color || '#D4DE95' }} />
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-slate-900 truncate text-sm">
              {row.title}
            </span>
            <span className="text-xs text-slate-500 block truncate max-w-sm">
              {row.description || t('No description provided.')}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'code',
      label: t('Promo Code'),
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 font-mono font-bold text-xs text-slate-800 border border-slate-200 shadow-2xs">
          <span>{row.code}</span>
        </span>
      ),
    },
    {
      key: 'discount',
      label: t('Discount'),
      render: (row) => (
        <div>
          <span className="font-extrabold text-sm text-theme-accent block">
            {row.discount_text}
          </span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
            {row.badge}
          </span>
        </div>
      ),
    },
    {
      key: 'usage',
      label: t('Usage / Limit'),
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700">
          <span className="font-black text-slate-900">{row.usage_count || 0}</span>
          <span className="text-slate-400"> / {row.usage_limit || '∞'}</span>
        </span>
      ),
    },
    {
      key: 'status',
      label: t('Status'),
      render: (row) => {
        const isActive = Boolean(row.is_active);
        return (
          <button
            type="button"
            onClick={() => handlePromptToggleActive(row)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
            />
            {isActive ? t('Active') : t('Inactive')}
          </button>
        );
      },
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
            title={t('View details')}
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            <span>{t('View')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-theme-accent hover:bg-slate-50 transition shadow-2xs"
            title={t('Edit offer')}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlePromptDelete(row)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition shadow-2xs"
            title={t('Delete offer')}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Exclusive Offers')} />

      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <PageHeader
          title={t('Exclusive Offers & Promos')}
          description={t('Configure promotions, banner discounts, and coupon campaigns displayed in the customer app.')}
          action={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>{t('Add New Offer')}</span>
            </button>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard
            label={t('Total Offers')}
            value={stats?.total ?? 0}
            icon={Tag}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
          />
          <StatCard
            label={t('Active Campaigns')}
            value={stats?.active ?? 0}
            icon={CheckCircle2}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
          />
          <StatCard
            label={t('Inactive / Draft')}
            value={stats?.inactive ?? 0}
            icon={XCircle}
            iconBgClass="bg-slate-100"
            iconColorClass="text-slate-600"
          />
          <StatCard
            label={t('Total Redemptions')}
            value={stats?.total_claims ?? 0}
            icon={TrendingUp}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-indigo-600"
          />
        </div>

        {/* Main Table Card */}
        <TableCard>
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('Search by title, promo code...')}
                className="w-full sm:max-w-xs"
              />
              <div className="w-40">
                <SelectInput
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
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

          <div className="p-0">
            {offerList.length === 0 ? (
              <EmptyState
                icon={Tag}
                title={t('No exclusive offers found')}
                description={
                  searchQuery || statusFilter !== 'all'
                    ? t('No offers matched your active search and filter criteria.')
                    : t('Get started by creating your first promotional offer.')
                }
                action={
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-4 py-2 text-xs font-semibold text-white shadow-md shadow-theme-accent/20 hover:bg-theme-accent-hover transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t('Add New Offer')}</span>
                  </button>
                }
              />
            ) : (
              <>
                <DataTable columns={columns} rows={offerList} rowKey="id" />
                <div className="border-t border-slate-100 p-4">
                  <Paginator links={offers?.links || []} />
                </div>
              </>
            )}
          </div>
        </TableCard>
      </div>

      {/* Form Modal */}
      <ExclusiveOfferFormModal
        open={isFormModalOpen}
        offer={editingOffer}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingOffer(null);
        }}
      />

      {/* Details Modal */}
      <ExclusiveOfferDetailModal
        open={isDetailModalOpen}
        offer={selectedOffer}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOffer(null);
        }}
        onEdit={(off) => handleEdit(off)}
      />

      {/* Toggle Status Confirmation */}
      <ConfirmModal
        open={isToggleModalOpen}
        onClose={() => setIsToggleModalOpen(false)}
        onConfirm={handleConfirmToggleActive}
        loading={actionProcessing}
        title={t('Toggle Offer Status')}
        message={
          togglingOffer?.is_active
            ? t('Are you sure you want to deactivate this offer? It will no longer be visible to customers in the app.')
            : t('Are you sure you want to activate this offer? It will immediately appear on customer app banners.')
        }
        confirmText={togglingOffer?.is_active ? t('Deactivate') : t('Activate')}
        confirmVariant={togglingOffer?.is_active ? 'warning' : 'primary'}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionProcessing}
        title={t('Delete Exclusive Offer')}
        message={t('Are you sure you want to permanently delete this offer? This action cannot be undone.')}
        confirmText={t('Delete')}
        confirmVariant="danger"
      />
    </AppLayout>
  );
}
