import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  XCircle,
  Layers,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Search,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import StatCard from '@/Components/Cards/StatCard';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import EmptyState from '@/Components/Other/EmptyState';
import SearchBar from '@/Components/Inputs/SearchBar';
import SelectInput from '@/Components/Inputs/SelectInput';
import ClearFiltersButton from '@/Components/Buttons/ClearFiltersButton';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import FaqFormModal from '@/Components/Modals/FaqFormModal';

export default function FaqIndex({ faqs, stats, categories, filters }) {
  const { t } = useTranslation();
  const faqList = faqs?.data || [];

  // Filter state
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const [categoryFilter, setCategoryFilter] = useState(filters?.category || 'all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFaq, setDeletingFaq] = useState(null);

  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [togglingFaq, setTogglingFaq] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const applyFilters = (newSearch, newStatus, newCategory) => {
    router.get(
      route('admin.faqs.index'),
      {
        search: newSearch,
        status: newStatus,
        category: newCategory,
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
    router.get(route('admin.faqs.index'), {}, { preserveState: true });
  };

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setIsFormModalOpen(true);
  };

  const handlePromptToggle = (faq) => {
    setTogglingFaq(faq);
    setIsToggleModalOpen(true);
  };

  const handleConfirmToggle = () => {
    if (!togglingFaq) return;
    setActionProcessing(true);
    router.put(
      route('admin.faqs.toggle-active', togglingFaq.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsToggleModalOpen(false);
          setTogglingFaq(null);
          setActionProcessing(false);
        },
        onError: () => setActionProcessing(false),
      }
    );
  };

  const handlePromptDelete = (faq) => {
    setDeletingFaq(faq);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingFaq) return;
    setActionProcessing(true);
    router.delete(route('admin.faqs.destroy', deletingFaq.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingFaq(null);
        setActionProcessing(false);
      },
      onError: () => setActionProcessing(false),
    });
  };

  const categoryOptions = [
    { value: 'all', label: t('All Categories') },
    ...(categories || []).map((cat) => ({ value: cat, label: cat })),
  ];

  const statusOptions = [
    { value: 'all', label: t('All Status') },
    { value: 'active', label: t('Active Only') },
    { value: 'inactive', label: t('Inactive Only') },
  ];

  const columns = [
    {
      key: 'order',
      label: t('Priority'),
      className: 'w-20 text-center',
      render: (item) => (
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
          #{item.order ?? 0}
        </span>
      ),
    },
    {
      key: 'question',
      label: t('Question & Answer Excerpt'),
      className: 'min-w-[320px]',
      render: (item) => (
        <div className="py-1">
          <div className="text-sm font-bold text-slate-900 leading-snug">
            {item.question}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {item.answer}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      label: t('Category'),
      className: 'w-44',
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0f4a2d] border border-emerald-100">
          <Layers className="h-3 w-3" />
          {item.category || 'General'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: t('Status'),
      className: 'w-32',
      render: (item) =>
        item.is_active ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t('Active')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            <XCircle className="h-3.5 w-3.5" />
            {t('Inactive')}
          </span>
        ),
    },
    {
      key: 'actions',
      label: t('Actions'),
      className: 'w-36 text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handlePromptToggle(item)}
            title={item.is_active ? t('Deactivate FAQ') : t('Activate FAQ')}
            className={`p-1.5 rounded-lg border transition-colors ${
              item.is_active
                ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {item.is_active ? <Power className="h-3.5 w-3.5" /> : <PowerOff className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => handleEdit(item)}
            title={t('Edit FAQ')}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0f4a2d] hover:border-[#0f4a2d] hover:bg-emerald-50/50 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handlePromptDelete(item)}
            title={t('Delete FAQ')}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const hasFiltersApplied =
    Boolean(searchQuery) || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <AppLayout>
      <Head title={t('Help & FAQs - Admin Dashboard')} />

      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title={t('Frequently Asked Questions')}
          description={t(
            'Create, update and organize customer FAQs that dynamically appear on the mobile application.'
          )}
          actions={
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f4a2d] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#0c3c24] active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{t('Add New FAQ')}</span>
            </button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t('TOTAL FAQS')}
            value={stats?.total ?? 0}
            icon={HelpCircle}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-[#0f4a2d]"
          />
          <StatCard
            label={t('ACTIVE FAQS')}
            value={stats?.active ?? 0}
            badgeText={t('Live')}
            badgeBgClass="bg-emerald-100 text-emerald-800"
            icon={CheckCircle2}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-700"
          />
          <StatCard
            label={t('INACTIVE FAQS')}
            value={stats?.inactive ?? 0}
            icon={XCircle}
            iconBgClass="bg-slate-100"
            iconColorClass="text-slate-500"
          />
          <StatCard
            label={t('CATEGORIES')}
            value={stats?.categories ?? 0}
            icon={Layers}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-700"
          />
        </div>

        {/* Table Card */}
        <TableCard>
          {/* Filters Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('Search FAQs by question or answer...')}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-40">
                <SelectInput
                  value={categoryFilter}
                  onChange={handleCategoryFilter}
                  options={categoryOptions}
                />
              </div>

              <div className="w-36">
                <SelectInput
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  options={statusOptions}
                />
              </div>

              {hasFiltersApplied && (
                <ClearFiltersButton onClick={handleClearFilters} />
              )}
            </div>
          </div>

          {/* Table or Empty State */}
          {faqList.length > 0 ? (
            <div className="p-4 sm:p-5">
              <DataTable columns={columns} rows={faqList} />
              <div className="mt-4">
                <Paginator links={faqs?.links || []} />
              </div>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={HelpCircle}
                title={t('No FAQs Found')}
                description={
                  hasFiltersApplied
                    ? t('No questions match your current search or filters.')
                    : t('Get started by adding your first FAQ for the customer mobile application.')
                }
                action={
                  hasFiltersApplied ? (
                    <ClearFiltersButton onClick={handleClearFilters} />
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0f4a2d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3c24]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('Add First FAQ')}</span>
                    </button>
                  )
                }
              />
            </div>
          )}
        </TableCard>
      </div>

      {/* Form Modal (Add / Edit) */}
      <FaqFormModal
        open={isFormModalOpen}
        faq={editingFaq}
        existingCategories={categories}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingFaq(null);
        }}
      />

      {/* Toggle Active Confirmation Modal */}
      <ConfirmModal
        open={isToggleModalOpen}
        title={togglingFaq?.is_active ? t('Deactivate FAQ?') : t('Activate FAQ?')}
        message={
          togglingFaq?.is_active
            ? t('Deactivating this FAQ will immediately hide it from customer mobile applications.')
            : t('Activating this FAQ will make it visible to customers on the mobile app.')
        }
        confirmLabel={togglingFaq?.is_active ? t('Deactivate') : t('Activate')}
        cancelLabel={t('Cancel')}
        variant={togglingFaq?.is_active ? 'warning' : 'primary'}
        processing={actionProcessing}
        onConfirm={handleConfirmToggle}
        onCancel={() => {
          setIsToggleModalOpen(false);
          setTogglingFaq(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title={t('Delete FAQ?')}
        message={t(
          'Are you sure you want to delete this FAQ? This action cannot be undone and will permanently remove it.'
        )}
        confirmLabel={t('Delete FAQ')}
        cancelLabel={t('Cancel')}
        variant="danger"
        processing={actionProcessing}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingFaq(null);
        }}
      />
    </AppLayout>
  );
}
