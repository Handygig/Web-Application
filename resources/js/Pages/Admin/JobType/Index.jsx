import React, { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Menu } from '@headlessui/react';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Search,
  RotateCcw,
  Plus,
  Eye,
  Edit3,
  MoreVertical,
  Power,
  Trash2,
  Clock,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import JobTypeDetailModal from '@/Components/Modals/JobTypeDetailModal';
import JobTypeFormModal from '@/Components/Modals/JobTypeFormModal';

const INITIAL_JOB_TYPES = [
  {
    id: 1,
    code: 'JT-001',
    name: 'Full-Time',
    description: 'Permanent employment with standard working hours and full benefits.',
    status: 'Active',
    createdDate: 'Jan 10, 2025',
  },
  {
    id: 2,
    code: 'JT-002',
    name: 'Part-Time',
    description: 'Flexible employment with less than standard weekly full-time hours.',
    status: 'Active',
    createdDate: 'Jan 15, 2025',
  },
  {
    id: 3,
    code: 'JT-003',
    name: 'Contract',
    description: 'Fixed-term project engagement specified for a dedicated duration.',
    status: 'Active',
    createdDate: 'Feb 01, 2025',
  },
  {
    id: 4,
    code: 'JT-004',
    name: 'Freelance',
    description: 'Independent contractor work performed on a task or project basis.',
    status: 'Active',
    createdDate: 'Feb 12, 2025',
  },
  {
    id: 5,
    code: 'JT-005',
    name: 'Temporary',
    description: 'Short-term coverage or seasonal employment support assignment.',
    status: 'Inactive',
    createdDate: 'Mar 05, 2025',
  },
  {
    id: 6,
    code: 'JT-006',
    name: 'Internship',
    description: 'Entry-level training position designed for practical skill development.',
    status: 'Active',
    createdDate: 'Mar 20, 2025',
  },
  {
    id: 7,
    code: 'JT-007',
    name: 'Remote',
    description: 'Fully remote work opportunity executable from any approved location.',
    status: 'Active',
    createdDate: 'Apr 02, 2025',
  },
  {
    id: 8,
    code: 'JT-008',
    name: 'On-Site',
    description: 'Physical workplace requirement at specified facility or office address.',
    status: 'Inactive',
    createdDate: 'Apr 18, 2025',
  },
];

export default function JobTypeIndex() {
  const { t } = useTranslation();

  // Pure Frontend Local State Management
  const [jobTypeList, setJobTypeList] = useState(INITIAL_JOB_TYPES);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');

  // Dynamically Calculated Statistics from Frontend State
  const stats = useMemo(() => {
    const total = jobTypeList.length;
    const active = jobTypeList.filter((j) => j.status === 'Active').length;
    const inactive = jobTypeList.filter((j) => j.status === 'Inactive').length;

    return { total, active, inactive };
  }, [jobTypeList]);

  // Filtering & Sorting logic
  const filteredJobTypes = useMemo(() => {
    return jobTypeList.filter((j) => {
      // Status Filter
      if (statusFilter !== 'all' && j.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = j.name.toLowerCase().includes(q);
        const matchesDesc = j.description && j.description.toLowerCase().includes(q);
        const matchesCode = j.code && j.code.toLowerCase().includes(q);

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
      return 0;
    });
  }, [jobTypeList, statusFilter, searchQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Pagination bounds
  const totalItems = filteredJobTypes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobTypes = filteredJobTypes.slice(startIndex, startIndex + itemsPerPage);

  const startRecordNum = totalItems === 0 ? 0 : startIndex + 1;
  const endRecordNum = Math.min(startIndex + itemsPerPage, totalItems);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortOption('name-asc');
  };

  // Action handlers
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
    const isDeactivating = togglingJobType.status === 'Active';
    const newStatus = isDeactivating ? 'Inactive' : 'Active';

    setJobTypeList((prev) =>
      prev.map((item) => (item.id === togglingJobType.id ? { ...item, status: newStatus } : item))
    );

    setIsToggleModalOpen(false);
    setTogglingJobType(null);
    setToastMessage(
      isDeactivating
        ? t('Job type deactivated successfully.')
        : t('Job type activated successfully.')
    );
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handlePromptDelete = (jt) => {
    setDeletingJobType(jt);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingJobType) return;
    setJobTypeList((prev) => prev.filter((item) => item.id !== deletingJobType.id));
    setIsDeleteModalOpen(false);
    setDeletingJobType(null);
    setToastMessage(t('Job type deleted successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFormSubmit = (data) => {
    if (editingJobType) {
      setJobTypeList((prev) =>
        prev.map((jt) =>
          jt.id === editingJobType.id
            ? {
                ...jt,
                name: data.name,
                description: data.description,
                status: data.status,
              }
            : jt
        )
      );
    } else {
      const nextId = Date.now();
      const newType = {
        id: nextId,
        code: `JT-${Math.floor(100 + Math.random() * 900)}`,
        name: data.name,
        description: data.description || 'Custom employment classification.',
        status: data.status || 'Active',
        createdDate: 'Just now',
      };
      setJobTypeList((prev) => [newType, ...prev]);
    }

    setIsFormModalOpen(false);
    setEditingJobType(null);
    setToastMessage(
      editingJobType
        ? t('Job type updated successfully.')
        : t('Job type created successfully.')
    );
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <AppLayout>
      <Head title={t('Job Types')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2. Page Header */}
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
              {t('+ Add Job Type')}
            </button>
          }
        />

        {/* 3. Calculated Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-theme-accent ring-4 ring-indigo-50/50">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Total Job Types')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Active')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.active}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 ring-4 ring-slate-100/50">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Inactive')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.inactive}</p>
            </div>
          </div>
        </div>

        {/* 4 & 5. Search and Filters Controls */}
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
                placeholder={t('Search job types...')}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
              />
            </div>

            {/* Clear filters & Sorting */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              {(searchQuery || statusFilter !== 'all') && (
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
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Status')}:</span>
            <div className="flex items-center gap-1.5">
              {['all', 'active', 'inactive'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold capitalize transition ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {st === 'all' ? t('All') : st === 'active' ? t('Active') : t('Inactive')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 15. Empty State */}
        {filteredJobTypes.length === 0 ? (
          <TableCard>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {searchQuery || statusFilter !== 'all'
                  ? t('No matching job types found.')
                  : t('No job types found')}
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                {searchQuery || statusFilter !== 'all'
                  ? t('Try adjusting your search query or status filter.')
                  : t('Create a job type to make it available on the platform.')}
              </p>

              {searchQuery || statusFilter !== 'all' ? (
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
                  {t('+ Add Job Type')}
                </button>
              )}
            </div>
          </TableCard>
        ) : (
          /* 6. Job Types Table Layout */
          <TableCard>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 w-[25%]">{t('Job Type')}</th>
                    <th className="px-5 py-3.5 w-[38%]">{t('Description')}</th>
                    <th className="px-5 py-3.5 w-[14%]">{t('Status')}</th>
                    <th className="px-5 py-3.5 w-[13%]">{t('Created Date')}</th>
                    <th className="px-5 py-3.5 text-right w-[10%]">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {paginatedJobTypes.map((jt) => {
                    const isActive = jt.status === 'Active' || jt.status === 'active';

                    return (
                      <tr key={jt.id} className="group hover:bg-slate-50/80 transition-colors">
                        {/* Job Type */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent shadow-2xs border border-theme-accent/20">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <span className="block font-semibold text-slate-900 truncate">{jt.name}</span>
                              <span className="text-[11px] font-mono font-medium text-slate-400">{jt.code || `JT-${jt.id}`}</span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {jt.description || t('No description provided.')}
                          </p>
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
                          {jt.createdDate || 'Jan 10, 2025'}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(jt)}
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
                                        onClick={() => handleEdit(jt)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                                          active ? 'bg-slate-50' : ''
                                        }`}
                                      >
                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                        {t('Edit Job Type')}
                                      </button>
                                    )}
                                  </Menu.Item>

                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handlePromptToggleActive(jt)}
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
                                        onClick={() => handlePromptDelete(jt)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                                          active ? 'bg-red-50' : ''
                                        }`}
                                      >
                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        {t('Delete')}
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
              {paginatedJobTypes.map((jt) => {
                const isActive = jt.status === 'Active' || jt.status === 'active';

                return (
                  <div
                    key={jt.id}
                    className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 text-theme-accent font-bold border border-theme-accent/20">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{jt.name}</h4>
                          <span className="text-xs font-mono text-slate-400">{jt.code || `JT-${jt.id}`}</span>
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

                    <p className="text-xs text-slate-600 line-clamp-2">{jt.description}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                      <span>{t('Created')}: <strong className="text-slate-800">{jt.createdDate || 'Jan 10, 2025'}</strong></span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(jt)}
                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {t('View')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(jt)}
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

            {/* Pagination Controls & Counter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                {t('Showing :start–:end of :total job types', {
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

      {/* Details Workspace Modal */}
      <JobTypeDetailModal
        open={isDetailModalOpen}
        jobType={selectedJobType}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onToggleActive={handlePromptToggleActive}
      />

      {/* Add / Edit Form Modal */}
      <JobTypeFormModal
        open={isFormModalOpen}
        jobType={editingJobType}
        existingTypes={jobTypeList}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Activate / Deactivate Confirmation Modal */}
      <ConfirmModal
        open={isToggleModalOpen}
        title={
          togglingJobType?.status === 'Active'
            ? t('Deactivate Job Type?')
            : t('Activate Job Type?')
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
      />

      {/* Delete Confirmation Modal */}
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
      />
    </AppLayout>
  );
}
