import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import FloatingToast from '@/Components/Other/FloatingToast';
import ConfirmModal from '@/Components/Modals/ConfirmModal';
import {
  DollarSign,
  Plus,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Building,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

import PaymentMetrics from './PaymentMetrics';
import PaymentFilters from './PaymentFilters';
import PaymentTable from './PaymentTable';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import RequestPayoutModal from './RequestPayoutModal';

const PAYMENTS_STORAGE_KEY = 'company_payments_data_v2';

export default function PaymentIndex({ initialStats }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  const companyName = auth?.user?.name || t('Apex Home & Repair Services');

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Modal States
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Payment Reversal Modal State
  const [txnToReverse, setTxnToReverse] = useState(null);
  const [isReverseModalOpen, setIsReverseModalOpen] = useState(false);
  const [isReversing, setIsReversing] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mock Realistic Transactions & Invoices Dataset (Reversed/refunded rows removed)
  const defaultTransactions = useMemo(
    () => [
      {
        id: 'TXN-9021',
        jobId: 'JOB-4089',
        serviceName: t('Emergency Pipe Leak Repair'),
        serviceCategory: t('Plumbing'),
        serviceAddress: '742 Evergreen Terrace, Sector 4',
        customerName: 'Sarah Jenkins',
        customerPhone: '+94 77 234 5678',
        technicianName: 'David Miller (Master Plumber)',
        timestamp: 'Aug 18, 2026 • 09:15 AM',
        method: 'stripe',
        grossAmount: 180.0,
        commissionPercentage: 10,
        platformFee: 18.0,
        netPayout: 162.0,
        status: 'paid',
      },
      {
        id: 'TXN-9018',
        jobId: 'JOB-4084',
        serviceName: t('HVAC Unit Diagnostics & Tune-up'),
        serviceCategory: t('HVAC & Cooling'),
        serviceAddress: '1042 Elm Street, Suite 2B',
        customerName: 'Robert Chen',
        customerPhone: '+94 77 876 5432',
        technicianName: 'Alex Rivera (HVAC Tech)',
        timestamp: 'Aug 17, 2026 • 04:30 PM',
        method: 'apple_pay',
        grossAmount: 240.0,
        commissionPercentage: 10,
        platformFee: 24.0,
        netPayout: 216.0,
        status: 'disbursed',
      },
      {
        id: 'TXN-9014',
        jobId: 'JOB-4081',
        serviceName: t('Commercial Electrical Panel Upgrade'),
        serviceCategory: t('Electrical'),
        serviceAddress: '450 Commerce Blvd, Bldg A',
        customerName: 'Marcus Brody',
        customerPhone: '+94 77 345 6789',
        technicianName: 'James Wilson (Lead Electrician)',
        timestamp: 'Aug 17, 2026 • 11:20 AM',
        method: 'bank_transfer',
        grossAmount: 650.0,
        commissionPercentage: 10,
        platformFee: 65.0,
        netPayout: 585.0,
        status: 'pending',
      },
      {
        id: 'TXN-9009',
        jobId: 'JOB-4078',
        serviceName: t('High-Pressure Sewer Line Cleansing'),
        serviceCategory: t('Plumbing'),
        serviceAddress: '88 Westside Ave',
        customerName: 'Elena Rostova',
        customerPhone: '+94 77 901 2345',
        technicianName: 'Sam Patel (Plumbing Specialist)',
        timestamp: 'Aug 16, 2026 • 02:45 PM',
        method: 'stripe',
        grossAmount: 310.0,
        commissionPercentage: 10,
        platformFee: 31.0,
        netPayout: 279.0,
        status: 'paid',
      },
      {
        id: 'TXN-8995',
        jobId: 'JOB-4065',
        serviceName: t('Smart Home Security Wiring'),
        serviceCategory: t('Electrical'),
        serviceAddress: '1205 Oak Ridge Dr',
        customerName: 'David Kim',
        customerPhone: '+94 77 678 9012',
        technicianName: 'James Wilson (Lead Electrician)',
        timestamp: 'Aug 15, 2026 • 10:15 AM',
        method: 'cod',
        grossAmount: 420.0,
        commissionPercentage: 10,
        platformFee: 42.0,
        netPayout: 378.0,
        status: 'disbursed',
      },
      {
        id: 'TXN-8971',
        jobId: 'JOB-4038',
        serviceName: t('Tankless Water Heater Installation'),
        serviceCategory: t('Plumbing'),
        serviceAddress: '950 Pinecrest Way',
        customerName: 'Michael Scott',
        customerPhone: '+94 77 555 0199',
        technicianName: 'David Miller (Master Plumber)',
        timestamp: 'Aug 12, 2026 • 01:20 PM',
        method: 'stripe',
        grossAmount: 1150.0,
        commissionPercentage: 10,
        platformFee: 115.0,
        netPayout: 1035.0,
        status: 'paid',
      },
    ],
    [t]
  );

  // State Management - Persist in localStorage so reversals stay removed across refreshes
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((t) => t.status !== 'refunded' && t.status !== 'reversed');
          }
        } catch (e) {
          console.error('Failed to parse saved payments from localStorage:', e);
        }
      }
    }
    return defaultTransactions;
  });

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  // Dynamic Financial Metrics Summary calculated strictly from active non-refunded transactions
  const metrics = useMemo(() => {
    const activeTransactions = transactions.filter((t) => t.status !== 'refunded' && t.status !== 'reversed');

    const netRevenue = activeTransactions.reduce((sum, t) => sum + (Number(t.netPayout) || 0), 0);

    const pendingPayouts = activeTransactions
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + (Number(t.netPayout) || 0), 0);

    const disbursedToTechs = activeTransactions
      .filter((t) => t.status === 'disbursed')
      .reduce((sum, t) => sum + (Number(t.netPayout) || 0) * 0.6, 0);

    const platformFees = activeTransactions.reduce((sum, t) => sum + (Number(t.platformFee) || 0), 0);

    return {
      netRevenue,
      pendingPayouts,
      disbursedToTechs,
      platformFees,
    };
  }, [transactions]);

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Search term
      const matchesSearch =
        searchTerm === '' ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'paid' && (txn.status === 'paid' || txn.status === 'settled')) ||
        (statusFilter === 'pending' && txn.status === 'pending') ||
        (statusFilter === 'refunded' && txn.status === 'refunded') ||
        (statusFilter === 'disbursed' && txn.status === 'disbursed');

      // Method filter
      const matchesMethod = methodFilter === 'all' || txn.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [transactions, searchTerm, statusFilter, methodFilter, dateFilter]);

  // Handlers
  const handleViewInvoice = (txn) => {
    setSelectedInvoice(txn);
    setIsInvoiceModalOpen(true);
  };

  const handleDownloadReceipt = (txn) => {
    showNotification(t(`Downloading receipt for Transaction ${txn.id}...`), 'info');
  };

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Job ID',
      'Customer',
      'Phone',
      'Timestamp',
      'Method',
      'Gross Amount',
      'Platform Fee',
      'Net Payout',
      'Status',
    ];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.jobId,
      `"${t.customerName}"`,
      t.customerPhone,
      `"${t.timestamp}"`,
      t.method,
      t.grossAmount,
      t.platformFee,
      t.netPayout,
      t.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `HandyGig_Payments_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(t('Financial CSV report downloaded successfully!'), 'success');
  };

  const handleOpenReverseModal = (txn) => {
    setTxnToReverse(txn);
    setIsReverseModalOpen(true);
  };

  const handleConfirmReverse = () => {
    if (!txnToReverse) return;

    setIsReversing(true);

    // Immediately remove the reversed payment record from active table view and update localStorage
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== txnToReverse.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    showNotification(
      t('Payment :id successfully reversed.', { id: txnToReverse.id }),
      'success'
    );

    setIsReversing(false);
    setIsReverseModalOpen(false);
    setTxnToReverse(null);
  };

  const handlePayoutSubmit = ({ amount, bank, speed }) => {
    showNotification(
      t(
        `Payout request of $${amount.toLocaleString()} sent to ${bank} via ${speed.toUpperCase()} transfer!`
      ),
      'success'
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setDateFilter('all');
  };

  const paymentTabs = [
    { key: 'all', label: `${t('All')} (${transactions.length})` },
    {
      key: 'paid',
      label: `${t('Paid')} (${transactions.filter((t) => t.status === 'paid' || t.status === 'settled').length})`,
    },
    {
      key: 'pending',
      label: `${t('Pending')} (${transactions.filter((t) => t.status === 'pending').length})`,
    },
    {
      key: 'disbursed',
      label: `${t('Disbursed')} (${transactions.filter((t) => t.status === 'disbursed').length})`,
    },
    {
      key: 'refunded',
      label: `${t('Refunded')} (${transactions.filter((t) => t.status === 'refunded').length})`,
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Payments')} />

      <div className="flex w-full flex-col gap-6">
        {/* Floating Toast Notification */}
        <FloatingToast
          message={toastMessage?.msg}
          type={toastMessage?.type}
          onClose={() => setToastMessage(null)}
        />

        <PageHeader
          title={t('Payments & Invoices')}
          description={t(
            'Track revenue, net payouts, platform commission, and disbursement history.'
          )}
          action={
            <button
              type="button"
              onClick={() => setIsPayoutModalOpen(true)}
              className="bg-[#164e3b] hover:bg-emerald-900 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>{t('Request Payout')}</span>
            </button>
          }
        />

        {/* Top 4 Summary Metric Cards */}
        <PaymentMetrics metrics={metrics} />

        {/* 3. TABS & SEARCH / FILTER CONTROLS */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <TabSwitch tabs={paymentTabs} activeTab={statusFilter} onChange={setStatusFilter} />
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')}{' '}
              <span className="font-bold text-slate-900">{filteredTransactions.length}</span>{' '}
              {t('transactions')}
            </div>
          </div>

          <PaymentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onExportCSV={handleExportCSV}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Transactions & Invoices Data Table inside TableCard */}
        <TableCard>
          <PaymentTable
            transactions={filteredTransactions}
            onViewInvoice={handleViewInvoice}
            onDownloadReceipt={handleDownloadReceipt}
            onReversePayment={handleOpenReverseModal}
          />
        </TableCard>

        {/* Invoice Details & Receipt Modal */}
        <InvoiceDetailsModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          transaction={selectedInvoice}
          companyName={companyName}
        />

        {/* Request Payout Modal */}
        <RequestPayoutModal
          isOpen={isPayoutModalOpen}
          onClose={() => setIsPayoutModalOpen(false)}
          availableBalance={metrics.netRevenue}
          onSubmitPayout={handlePayoutSubmit}
        />

        {/* Payment Reversal Confirmation Modal */}
        <ConfirmModal
          open={isReverseModalOpen}
          title={t('Confirm Payment Reversal?')}
          message={
            txnToReverse
              ? t('Are you sure you want to reverse payment for Transaction :id ($:amount)? This action will issue a full refund to :customer and update your financial balance.', {
                  id: txnToReverse.id,
                  amount: typeof txnToReverse.grossAmount === 'number' ? txnToReverse.grossAmount.toFixed(2) : txnToReverse.grossAmount,
                  customer: txnToReverse.customerName,
                })
              : ''
          }
          confirmLabel={t('Confirm Reversal')}
          cancelLabel={t('Cancel')}
          variant="danger"
          icon={RotateCcw}
          centered={true}
          processing={isReversing}
          onConfirm={handleConfirmReverse}
          onCancel={() => {
            setIsReverseModalOpen(false);
            setTxnToReverse(null);
          }}
        />
      </div>
    </AppLayout>
  );
}
