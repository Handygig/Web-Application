import React, { useState } from 'react';
import {
  FileText,
  Download,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  CheckCircle2,
  Clock,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PaymentTable({
  transactions,
  viewMode,
  onViewInvoice,
  onDownloadReceipt,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxnForMenu, setSelectedTxnForMenu] = useState(null);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
            <CreditCard className="w-3.5 h-3.5" />
            {t('Stripe / Card')}
          </span>
        );
      case 'apple_pay':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300/80">
            <Smartphone className="w-3.5 h-3.5 text-slate-900" />
            {t('Apple Pay')}
          </span>
        );
      case 'cod':
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            {t('Cash on Delivery')}
          </span>
        );
      case 'bank_transfer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/70">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            {t('Bank Transfer')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CreditCard className="w-3.5 h-3.5" />
            {method}
          </span>
        );
    }
  };

  // Status Badge Renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'settled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF5EC] text-emerald-800 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('Paid & Settled')}
          </span>
        );
      case 'pending':
      case 'pending_settlement':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {t('Pending Settlement')}
          </span>
        );
      case 'disbursed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/80">
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            {t('Disbursed to Tech')}
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80">
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            {t('Refunded')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-12 rounded-2xl border border-slate-200/80 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-800">{t('No transactions found')}</h4>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          {t('Try adjusting your search criteria, payment method filters, or date range selection.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4">{t('Transaction & Job Ref')}</th>
                  <th className="py-3.5 px-4">{t('Customer & Date')}</th>
                  <th className="py-3.5 px-4">{t('Payment Method')}</th>
                  <th className="py-3.5 px-4">{t('Gross Amount')}</th>
                  <th className="py-3.5 px-4">{t('Platform Fee & Net')}</th>
                  <th className="py-3.5 px-4">{t('Payment Status')}</th>
                  <th className="py-3.5 px-4 text-right">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedTxns.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Transaction ID & Job Ref */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#5E6933] bg-[#EBF5EC] px-2 py-0.5 rounded-md border border-emerald-200">
                          {txn.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{txn.jobId}:</span>
                        <span className="truncate max-w-[180px]" title={txn.serviceName}>
                          {txn.serviceName}
                        </span>
                      </div>
                    </td>

                    {/* Customer & Date */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{txn.customerName}</div>
                      <div className="text-xs text-slate-500">{txn.customerPhone}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{txn.timestamp}</div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4">{renderMethodBadge(txn.method)}</td>

                    {/* Gross Amount */}
                    <td className="py-4 px-4 font-bold text-slate-900 text-base">
                      {formattedCurrency(txn.grossAmount)}
                    </td>

                    {/* Platform Fee & Net Payout */}
                    <td className="py-4 px-4">
                      <div className="text-xs text-rose-600 font-medium">
                        -{formattedCurrency(txn.platformFee)} ({txn.commissionPercentage || '10'}%)
                      </div>
                      <div className="font-extrabold text-[#5E6933] text-sm mt-0.5 flex items-center gap-1">
                        <span>{formattedCurrency(txn.netPayout)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{t('Net')}</span>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">{renderStatusBadge(txn.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewInvoice(txn)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#5E6933] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                          title={t('View Invoice')}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('Invoice')}</span>
                        </button>
                        <button
                          onClick={() => onDownloadReceipt(txn)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title={t('Download Receipt')}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTxns.map((txn) => (
            <div
              key={txn.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#5E6933] bg-[#EBF5EC] px-2 py-0.5 rounded-md border border-emerald-200">
                    {txn.id}
                  </span>
                  <div className="text-xs font-bold text-slate-800 mt-1">{txn.jobId}</div>
                </div>
                {renderStatusBadge(txn.status)}
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm truncate">{txn.serviceName}</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  {txn.customerName} • {txn.timestamp}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">{t('Gross Charged')}</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {formattedCurrency(txn.grossAmount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{t('Company Net')}</div>
                  <div className="text-lg font-extrabold text-[#5E6933]">
                    {formattedCurrency(txn.netPayout)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {renderMethodBadge(txn.method)}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewInvoice(txn)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#5E6933] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {t('View Invoice')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs text-slate-600">
        <div>
          {t('Showing')} <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')}{' '}
          <span className="font-bold text-slate-800">
            {Math.min(currentPage * itemsPerPage, transactions.length)}
          </span>{' '}
          {t('of')} <span className="font-bold text-slate-800">{transactions.length}</span> {t('transactions')}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-slate-800">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
