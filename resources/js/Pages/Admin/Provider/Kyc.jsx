import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Search,
  RotateCcw,
  Eye,
  Check,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import KycRejectModal from '@/Components/Modals/KycRejectModal';
import KycReviewWorkspace from '@/Components/Provider/KycReviewWorkspace';

export default function ProviderKyc({ verifications, dbProviders }) {
  const { t } = useTranslation();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tab selection ('pending' selected by default per requirement)
  const [activeTab, setActiveTab] = useState('pending');

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const getInitialRequestsList = () => {
    const sourceData = verifications?.data || dbProviders;
    if (sourceData && sourceData.length > 0) {
      return sourceData.map((item) => {
        const isVerification = !!item.verification_type;
        const provider = isVerification ? item.provider : item;
        const lastKyc = isVerification ? item : (item.kyc_verifications?.[0] || {});
        
        return {
          id: lastKyc.id || item.id,
          applicationId: `APP-${9000 + (lastKyc.id || item.id)}`,
          providerName: provider?.user?.full_name || 'Provider Name',
          businessName: provider?.company?.business_name || provider?.user?.full_name || 'Business Name',
          email: provider?.user?.email || '',
          phone: provider?.user?.phone || '',
          address: provider?.location || 'New York, NY',
          country: 'United States',
          registrationDate: provider?.created_at ? new Date(provider.created_at).toLocaleDateString() : 'Jan 2025',
          verificationType: lastKyc.verification_type || (provider?.provider_type === 'company' ? 'KYB' : 'KYC'),
          submittedDate: lastKyc.created_at ? new Date(lastKyc.created_at).toLocaleString() : (item.created_at ? new Date(item.created_at).toLocaleString() : 'Jan 2025'),
          documentsCount: lastKyc.documents?.length || 0,
          status: lastKyc.status ? (lastKyc.status.charAt(0).toUpperCase() + lastKyc.status.slice(1).toLowerCase()) : 'Pending',
          reviewer: lastKyc.reviewer?.full_name || 'Admin',
          rejectionReason: lastKyc.rejection_reason || '',
          history: lastKyc.history || [],
          documents: lastKyc.documents || [],
        };
      });
    }
    return [];
  };

  // Request list dataset
  const [requestList, setRequestList] = useState(getInitialRequestsList);

  useEffect(() => {
    setRequestList(getInitialRequestsList());
  }, [verifications, dbProviders]);

  // Review Workspace Active Request
  const [activeReviewRequest, setActiveReviewRequest] = useState(null);

  // Modals state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const total = requestList.length;
    const pending = requestList.filter((r) => r.status === 'Pending').length;
    const approved = requestList.filter((r) => r.status === 'Approved').length;
    const rejected = requestList.filter((r) => r.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [requestList]);

  // Tab option definitions
  const statusTabs = [
    { key: 'all', label: `${t('All')} (${stats.total})` },
    { key: 'pending', label: `${t('Pending')} (${stats.pending})` },
    { key: 'approved', label: `${t('Approved')} (${stats.approved})` },
    { key: 'rejected', label: `${t('Rejected')} (${stats.rejected})` },
  ];

  // Filtering & Sorting logic
  const filteredRequests = useMemo(() => {
    return requestList.filter((r) => {
      // Tab filter
      if (activeTab === 'pending' && r.status !== 'Pending') return false;
      if (activeTab === 'approved' && r.status !== 'Approved') return false;
      if (activeTab === 'rejected' && r.status !== 'Rejected') return false;

      // Status dropdown filter
      if (statusFilter === 'pending' && r.status !== 'Pending') return false;
      if (statusFilter === 'approved' && r.status !== 'Approved') return false;
      if (statusFilter === 'rejected' && r.status !== 'Rejected') return false;

      // Type filter
      if (typeFilter === 'kyc' && r.verificationType !== 'KYC') return false;
      if (typeFilter === 'kyb' && r.verificationType !== 'KYB') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.providerName.toLowerCase().includes(q);
        const matchesBusiness = r.businessName.toLowerCase().includes(q);
        const matchesEmail = r.email.toLowerCase().includes(q);
        const matchesAppId = r.applicationId.toLowerCase().includes(q);
        if (!matchesName && !matchesBusiness && !matchesEmail && !matchesAppId) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'oldest') {
        return a.id - b.id;
      }
      return b.id - a.id; // newest default
    });
  }, [requestList, activeTab, statusFilter, typeFilter, searchQuery, sortOption]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setDateFilter('all');
    setStatusFilter('all');
    setSortOption('newest');
    setActiveTab('all');
  };

  const handleOpenReview = (req) => {
    setActiveReviewRequest(req);
  };

  const handleBackFromReview = () => {
    setActiveReviewRequest(null);
  };

  // Approve Workflow
  const handlePromptApprove = (req) => {
    setApprovingRequest(req);
    setIsApproveModalOpen(true);
  };

  const confirmApprove = () => {
    if (!approvingRequest) return;
    setActionProcessing(true);

    setTimeout(() => {
      const nowFormatted = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedHistory = [
        ...(approvingRequest.history || []),
        {
          date: nowFormatted,
          action: 'Verification Approved',
          status: 'Approved',
          reviewer: 'Current Admin',
          reason: 'All submitted checklist items and documents verified successfully.',
        },
      ];

      setRequestList((prev) =>
        prev.map((r) =>
          r.id === approvingRequest.id
            ? {
                ...r,
                status: 'Approved',
                reviewer: 'Current Admin',
                approvedAt: nowFormatted,
                history: updatedHistory,
              }
            : r
        )
      );

      if (activeReviewRequest && activeReviewRequest.id === approvingRequest.id) {
        setActiveReviewRequest({
          ...activeReviewRequest,
          status: 'Approved',
          reviewer: 'Current Admin',
          approvedAt: nowFormatted,
          history: updatedHistory,
        });
      }

      setActionProcessing(false);
      setIsApproveModalOpen(false);
      setApprovingRequest(null);
      setToastMessage(t('Provider verification has been approved successfully.'));
      setTimeout(() => setToastMessage(''), 4000);
    }, 400);
  };

  // Reject Workflow
  const handlePromptReject = (req) => {
    setRejectingRequest(req);
    setIsRejectModalOpen(true);
  };

  const confirmReject = (reason) => {
    if (!rejectingRequest) return;
    setActionProcessing(true);

    setTimeout(() => {
      const nowFormatted = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedHistory = [
        ...(rejectingRequest.history || []),
        {
          date: nowFormatted,
          action: 'Verification Rejected',
          status: 'Rejected',
          reviewer: 'Current Admin',
          reason: reason,
        },
      ];

      setRequestList((prev) =>
        prev.map((r) =>
          r.id === rejectingRequest.id
            ? {
                ...r,
                status: 'Rejected',
                reviewer: 'Current Admin',
                rejectionReason: reason,
                history: updatedHistory,
              }
            : r
        )
      );

      if (activeReviewRequest && activeReviewRequest.id === rejectingRequest.id) {
        setActiveReviewRequest({
          ...activeReviewRequest,
          status: 'Rejected',
          reviewer: 'Current Admin',
          rejectionReason: reason,
          history: updatedHistory,
        });
      }

      setActionProcessing(false);
      setIsRejectModalOpen(false);
      setRejectingRequest(null);
      setToastMessage(t('Provider verification has been rejected.'));
      setTimeout(() => setToastMessage(''), 4000);
    }, 400);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <AppLayout>
      <Head title={t('KYC/KYB Approvals')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Workspace Mode: If active review request is set */}
        {activeReviewRequest ? (
          <KycReviewWorkspace
            request={activeReviewRequest}
            onBack={handleBackFromReview}
            onApprove={handlePromptApprove}
            onReject={handlePromptReject}
            processing={actionProcessing}
          />
        ) : (
          <>
            {/* 1. Page Header */}
            <PageHeader
              title={t('KYC/KYB Approvals')}
              description={t('Review and verify provider-submitted KYC and KYB documents.')}
            />

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Pending Reviews')}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.pending}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Approved')}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.approved}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Rejected')}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.rejected}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-theme-accent ring-4 ring-indigo-50/50">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Total Submissions')}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
                </div>
              </div>
            </div>

            {/* 2. Approval Status Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {statusTabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/20'
                          : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {t('Showing')} <span className="font-bold text-slate-900">{filteredRequests.length}</span> {t('requests')}
              </div>
            </div>

            {/* 3. Search and Filters Controls */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-2xs backdrop-blur-xs">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search input */}
                <div className="relative w-full md:max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Search className="h-4 w-4 text-theme-accent" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Search providers...')}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 shadow-2xs placeholder:text-slate-400 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all"
                  />
                </div>

                {/* Clear filters & Sorting */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                  {(searchQuery || typeFilter !== 'all' || dateFilter !== 'all' || statusFilter !== 'all') && (
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
                    <option value="newest">{t('Sort: Newest First')}</option>
                    <option value="oldest">{t('Sort: Oldest First')}</option>
                  </select>
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Verification Type')}
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                  >
                    <option value="all">{t('All Types (KYC & KYB)')}</option>
                    <option value="kyc">{t('KYC (Individual)')}</option>
                    <option value="kyb">{t('KYB (Corporate)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Submission Date')}
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                  >
                    <option value="all">{t('All Time')}</option>
                    <option value="today">{t('Today')}</option>
                    <option value="7days">{t('Last 7 days')}</option>
                    <option value="30days">{t('Last 30 days')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Status Filter')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 py-2 text-xs text-slate-700 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                  >
                    <option value="all">{t('All Statuses')}</option>
                    <option value="pending">{t('Pending')}</option>
                    <option value="approved">{t('Approved')}</option>
                    <option value="rejected">{t('Rejected')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 17. Error Handling */}
            {error ? (
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-200 bg-red-50/50 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">{t('Unable to load verification requests.')}</h3>
                <p className="text-sm text-slate-600 mt-1 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('Retry')}
                </button>
              </div>
            ) : loading ? (
              /* 16. Loading Skeleton State */
              <TableCard>
                <div className="p-6 space-y-4 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                      <div className="h-8 bg-slate-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </TableCard>
            ) : filteredRequests.length === 0 ? (
              /* 15. Empty State */
              <TableCard>
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4 ring-4 ring-amber-50/50">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{t('No pending KYC/KYB approvals')}</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-md">
                    {t('Provider verification requests will appear here when providers submit their documents.')}
                  </p>
                </div>
              </TableCard>
            ) : (
              /* 4. Approval Requests Table */
              <TableCard>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="px-5 py-3.5">{t('Provider')}</th>
                        <th className="px-5 py-3.5">{t('Verification Type')}</th>
                        <th className="px-5 py-3.5">{t('Submitted Date')}</th>
                        <th className="px-5 py-3.5">{t('Documents')}</th>
                        <th className="px-5 py-3.5">{t('Status')}</th>
                        <th className="px-5 py-3.5">{t('Reviewer')}</th>
                        <th className="px-5 py-3.5 text-right">{t('Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {filteredRequests.map((req) => {
                        const isPending = req.status === 'Pending';
                        const isApproved = req.status === 'Approved';
                        const isRejected = req.status === 'Rejected';

                        const initials = req.providerName
                          ? req.providerName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()
                          : 'P';

                        return (
                          <tr key={req.id} className="group hover:bg-slate-50/80 transition-colors">
                            {/* Provider info */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 font-bold text-theme-accent text-xs shadow-2xs border border-theme-accent/20">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900 truncate">{req.providerName}</span>
                                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                      {req.applicationId}
                                    </span>
                                  </div>
                                  <span className="block text-xs font-medium text-theme-accent truncate">
                                    {req.businessName}
                                  </span>
                                  <span className="text-xs text-slate-400 truncate">{req.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Verification Type */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1 font-bold text-xs bg-indigo-50 text-theme-accent border border-indigo-100 px-2.5 py-1 rounded-lg">
                                {req.verificationType}
                              </span>
                            </td>

                            {/* Submitted Date */}
                            <td className="px-5 py-4 text-xs font-medium text-slate-600">{req.submittedDate}</td>

                            {/* Documents count */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                <FileCheck className="h-3.5 w-3.5 text-slate-500" />
                                {req.documentsCount} {t('Documents')}
                              </span>
                            </td>

                            {/* Status badge */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                  isApproved
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isRejected
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {isApproved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                                {isRejected && <XCircle className="h-3.5 w-3.5 text-red-600" />}
                                {isPending && <Clock className="h-3.5 w-3.5 text-amber-600" />}
                                {req.status}
                              </span>
                            </td>

                            {/* Reviewer */}
                            <td className="px-5 py-4 text-xs font-medium text-slate-600">
                              {req.reviewer || t('Not reviewed')}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleOpenReview(req)}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition shadow-2xs ${
                                  isPending
                                    ? 'bg-theme-accent text-white hover:bg-theme-accent-hover shadow-theme-accent/20'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                {isPending ? t('Review') : t('View details')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-4">
                  {filteredRequests.map((req) => {
                    const isPending = req.status === 'Pending';
                    const isApproved = req.status === 'Approved';
                    const isRejected = req.status === 'Rejected';

                    return (
                      <div
                        key={req.id}
                        className="flex flex-col gap-3 pt-4 first:pt-0 bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                              {req.applicationId}
                            </span>
                            <h4 className="font-bold text-slate-900">{req.providerName}</h4>
                            <p className="text-xs text-theme-accent font-medium">{req.businessName}</p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isRejected
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                          <span className="font-semibold text-slate-700">{req.verificationType}</span>
                          <span>{req.documentsCount} Documents</span>
                          <span>{req.submittedDate}</span>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenReview(req)}
                            className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                              isPending
                                ? 'bg-theme-accent text-white hover:bg-theme-accent-hover'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {isPending ? t('Review Submission') : t('View Details')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TableCard>
            )}
          </>
        )}
      </div>

      {/* 10. Approve Confirmation Modal */}
      <ConfirmModal
        open={isApproveModalOpen}
        title={t('Approve Verification?')}
        message={
          approvingRequest
            ? t('Are you sure you want to approve this provider\'s KYC/KYB verification?') + ` (${approvingRequest.providerName} - ${approvingRequest.verificationType}, ${approvingRequest.documentsCount} documents)`
            : ''
        }
        confirmLabel={t('Approve Verification')}
        cancelLabel={t('Cancel')}
        variant="primary"
        processing={actionProcessing}
        onConfirm={confirmApprove}
        onCancel={() => {
          setIsApproveModalOpen(false);
          setApprovingRequest(null);
        }}
      />

      {/* 11. Reject Workflow Modal */}
      <KycRejectModal
        open={isRejectModalOpen}
        providerName={rejectingRequest?.providerName || ''}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectingRequest(null);
        }}
        onConfirm={confirmReject}
        processing={actionProcessing}
      />
    </AppLayout>
  );
}
