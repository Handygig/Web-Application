import React, { useState } from 'react';
import {
  FileText,
  Download,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PaymentTable({
  transactions = [],
  onViewInvoice,
  onDownloadReceipt,
  onReversePayment,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const paginatedTxns = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  // Method Badge Renderer
  const renderMethodBadge = (method) => {
    switch (method) {
      case 'stripe':
      case 'card':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 whitespace-nowrap">
            <CreditCard className="w-3.5 h-3.5" />
            {t('Stripe / Card')}
          </span>
        );
      case 'apple_pay':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300/80 whitespace-nowrap">
            <Smartphone className="w-3.5 h-3.5 text-slate-900" />
            {t('Apple Pay')}
          </span>
        );
      case 'cod':
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            {t('Cash on Delivery')}
          </span>
        );
      case 'bank_transfer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/70 whitespace-nowrap">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            {t('Bank Transfer')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
            <CreditCard className="w-3.5 h-3.5" />
            {method}
          </span>
        );
    }
  };

  // Status Badge Renderer with colored dot indicators (Matching Bookings & Employees status styles)
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'settled':
        return (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            {t('Paid & Settled')}
          </span>
        );
      case 'pending':
      case 'pending_settlement':
        return (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            {t('Pending Settlement')}
          </span>
        );
      case 'disbursed':
        return (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
            {t('Disbursed to Tech')}
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            {t('Refunded')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">{t('Transaction & Job Ref')}</th>
              <th className="px-6 py-4">{t('Customer & Date')}</th>
              <th className="px-6 py-4">{t('Payment Method')}</th>
              <th className="px-6 py-4 text-right">{t('Gross Amount')}</th>
              <th className="px-6 py-4 text-right">{t('Platform Fee & Net')}</th>
              <th className="px-6 py-4">{t('Payment Status')}</th>
              <th className="px-6 py-4 text-right">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p>{t('No transactions found matching your search or filters.')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTxns.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  onClick={() => onViewInvoice?.(txn)}
                >
                  {/* 1. Transaction ID & Job Ref */}
                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80 inline-block">
                        {txn.id}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="font-bold text-slate-800">{txn.jobId}</span>
                        <span className="text-slate-300">•</span>
                        <span className="truncate max-w-[150px]" title={txn.serviceName}>
                          {txn.serviceName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Customer & Date */}
                  <td className="px-6 py-4 align-middle">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-sm">{txn.customerName}</div>
                      <div className="text-xs text-slate-500 font-medium">{txn.customerPhone}</div>
                      <div className="text-xs text-slate-400 font-medium">{txn.timestamp}</div>
                    </div>
                  </td>

                  {/* 3. Payment Method */}
                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                    {renderMethodBadge(txn.method)}
                  </td>

                  {/* 4. Gross Amount */}
                  <td className="px-6 py-4 align-middle text-right whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">
                      {formattedCurrency(txn.grossAmount)}
                    </div>
                  </td>

                  {/* 5. Platform Fee & Net Payout */}
                  <td className="px-6 py-4 align-middle text-right whitespace-nowrap">
                    <div className="text-xs text-rose-600 font-semibold">
                      -{formattedCurrency(txn.platformFee)} ({txn.commissionPercentage || '10'}%)
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {formattedCurrency(txn.netPayout)} <span className="text-[10px] text-slate-400 font-normal">({t('Net')})</span>
                    </div>
                  </td>

                  {/* 6. Payment Status */}
                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                    {renderStatusBadge(txn.status)}
                  </td>

                  {/* 7. Actions */}
                  <td className="px-6 py-4 align-middle text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewInvoice?.(txn);
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                        title={t('View Invoice')}
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{t('Invoice')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadReceipt?.(txn);
                        }}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title={t('Download Receipt')}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {txn.status !== 'refunded' && txn.status !== 'reversed' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReversePayment?.(txn);
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title={t('Reverse Payment')}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-100 rounded-md border border-slate-200/80">
                          {t('Reversed')}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TABLE FOOTER / PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 px-6 py-3.5 border-t border-slate-100 text-xs text-slate-600">
        <div className="whitespace-nowrap">
          {t('Showing')}{' '}
          <span className="font-bold text-slate-900">
            {transactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>
          –
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * itemsPerPage, transactions.length)}
          </span>{' '}
          {t('of')} <span className="font-bold text-slate-900">{transactions.length}</span> {t('transactions')}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{t('Previous')}</span>
          </button>
          <span className="px-3 py-1 font-semibold text-slate-800">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 shadow-2xs"
          >
            <span>{t('Next')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
