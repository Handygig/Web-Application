import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TabSwitch from '@/Components/Other/TabSwitch';
import TableCard from '@/Components/Cards/TableCard';
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
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

import PaymentMetrics from './PaymentMetrics';
import PaymentFilters from './PaymentFilters';
import PaymentTable from './PaymentTable';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import RequestPayoutModal from './RequestPayoutModal';

export default function PaymentIndex({ initialStats }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  const companyName = auth?.user?.name || t('Apex Home & Repair Services');

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal States
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mock Realistic Transactions & Invoices Dataset
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-9021',
      jobId: 'JOB-4089',
      serviceName: t('Emergency Pipe Leak Repair'),
      serviceCategory: t('Plumbing'),
      serviceAddress: '742 Evergreen Terrace, Sector 4',
      customerName: 'Sarah Jenkins',
      customerPhone: '+1 (555) 234-5678',
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
      customerPhone: '+1 (555) 876-5432',
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
      customerPhone: '+1 (555) 345-6789',
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
      customerPhone: '+1 (555) 901-2345',
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
      customerPhone: '+1 (555) 678-9012',
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
      id: 'TXN-8982',
      jobId: 'JOB-4050',
      serviceName: t('Central Air Duct Inspection & Clean'),
      serviceCategory: t('HVAC & Cooling'),
      serviceAddress: '304 Birch Lane',
      customerName: 'Lisa Vance',
      customerPhone: '+1 (555) 432-1098',
      technicianName: 'Alex Rivera (HVAC Tech)',
      timestamp: 'Aug 14, 2026 • 03:00 PM',
      method: 'stripe',
      grossAmount: 290.0,
      commissionPercentage: 10,
      platformFee: 29.0,
      netPayout: 261.0,
      status: 'refunded',
    },
    {
      id: 'TXN-8971',
      jobId: 'JOB-4038',
      serviceName: t('Tankless Water Heater Installation'),
      serviceCategory: t('Plumbing'),
      serviceAddress: '950 Pinecrest Way',
      customerName: 'Michael Scott',
      customerPhone: '+1 (555) 555-0199',
      technicianName: 'David Miller (Master Plumber)',
      timestamp: 'Aug 12, 2026 • 01:20 PM',
      method: 'stripe',
      grossAmount: 1150.0,
      commissionPercentage: 10,
      platformFee: 115.0,
      netPayout: 1035.0,
      status: 'paid',
    },
  ]);

  // Overall Financial Metrics Summary
  const metrics = useMemo(() => {
    const totalNet = transactions
      .filter((t) => t.status !== 'refunded')
      .reduce((sum, t) => sum + t.netPayout, 0);

    const pendingPayouts = transactions
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.netPayout, 0);

    const disbursed = transactions
      .filter((t) => t.status === 'disbursed')
      .reduce((sum, t) => sum + t.netPayout * 0.6, 0); // 60% tech share

    const platformFees = transactions
      .filter((t) => t.status !== 'refunded')
      .reduce((sum, t) => sum + t.platformFee, 0);

    return {
      netRevenue: 32450.0 + totalNet,
      pendingPayouts: 4820.0 + pendingPayouts,
      disbursedToTechs: 18240.0 + disbursed,
      platformFees: 3605.0 + platformFees,
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
      const matchesMethod =
        methodFilter === 'all' ||
        txn.method === methodFilter;

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
    const headers = ['Transaction ID', 'Job ID', 'Customer', 'Phone', 'Timestamp', 'Method', 'Gross Amount', 'Platform Fee', 'Net Payout', 'Status'];
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
    link.setAttribute('download', `HandyGig_Payments_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification(t('Financial CSV report downloaded successfully!'), 'success');
  };

  const handlePayoutSubmit = ({ amount, bank, speed }) => {
    showNotification(
      t(`Payout request of $${amount.toLocaleString()} sent to ${bank} via ${speed.toUpperCase()} transfer!`),
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
    { key: 'paid', label: `${t('Paid')} (${transactions.filter((t) => t.status === 'paid' || t.status === 'settled').length})` },
    { key: 'pending', label: `${t('Pending')} (${transactions.filter((t) => t.status === 'pending').length})` },
    { key: 'disbursed', label: `${t('Disbursed')} (${transactions.filter((t) => t.status === 'disbursed').length})` },
    { key: 'refunded', label: `${t('Refunded')} (${transactions.filter((t) => t.status === 'refunded').length})` },
  ];

  return (
    <AppLayout>
      <Head title={t('Payments')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300 ${
              toastMessage.type === 'success'
                ? 'bg-[#EBF5EC] border-emerald-300 text-emerald-900'
                : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#5E6933]" />
              <span className="text-sm font-bold">{toastMessage.msg}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        <PageHeader
          title={t('Payments & Invoices')}
          description={t('Track revenue, net payouts, platform commission, and disbursement history.')}
          action={
            <button
              type="button"
              onClick={() => setIsPayoutModalOpen(true)}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>{t('Request Payout')}</span>
            </button>
          }
        />

        {/* 2. Top 4 Summary Metric Cards */}
        <PaymentMetrics metrics={metrics} />

        {/* 3. TABS & SEARCH / FILTER CONTROLS */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <TabSwitch tabs={paymentTabs} activeTab={statusFilter} onChange={setStatusFilter} />
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')} <span className="font-bold text-slate-900">{filteredTransactions.length}</span> {t('transactions')}
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

        {/* 4. Transactions & Invoices Data Table inside TableCard */}
        <TableCard>
          <PaymentTable
            transactions={filteredTransactions}
            viewMode={viewMode}
            onViewInvoice={handleViewInvoice}
            onDownloadReceipt={handleDownloadReceipt}
          />
        </TableCard>

        {/* 5. Invoice Details & Receipt Modal */}
        <InvoiceDetailsModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          transaction={selectedInvoice}
          companyName={companyName}
        />

        {/* 6. Request Payout Modal */}
        <RequestPayoutModal
          isOpen={isPayoutModalOpen}
          onClose={() => setIsPayoutModalOpen(false)}
          availableBalance={metrics.netRevenue}
          onSubmitPayout={handlePayoutSubmit}
        />
      </div>
    </AppLayout>
  );
}
