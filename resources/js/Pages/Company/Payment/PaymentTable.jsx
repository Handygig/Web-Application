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
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function PaymentTable({ transactions, viewMode, onViewInvoice, onDownloadReceipt }) {
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70 whitespace-nowrap">
            <CreditCard className="w-3.5 h-3.5" />
            {t('Stripe / Card')}
          </span>
        );
      case 'apple_pay':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300/80 whitespace-nowrap">
            <Smartphone className="w-3.5 h-3.5 text-slate-900" />
            {t('Apple Pay')}
          </span>
        );
      case 'cod':
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            {t('Cash on Delivery')}
          </span>
        );
      case 'bank_transfer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200/70 whitespace-nowrap">
            <Building className="w-3.5 h-3.5 text-sky-600" />
            {t('Bank Transfer')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF5EC] text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('Paid & Settled')}
          </span>
        );
      case 'pending':
      case 'pending_settlement':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {t('Pending Settlement')}
          </span>
        );
      case 'disbursed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/80 whitespace-nowrap">
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            {t('Disbursed to Tech')}
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 whitespace-nowrap">
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            {t('Refunded')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E4D9] p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-[#F9FAF7] rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4 border border-[#E2E4D9]">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-bold text-gray-900">{t('No transactions found')}</h4>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
          {t(
            'Try adjusting your search criteria, payment method filters, or date range selection.'
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === 'table' ? (
        /* TABLE CONTAINER & WRAPPER */
        <div className="bg-white rounded-2xl border border-[#E2E4D9] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-[#F9FAF7] border-b border-[#E2E4D9] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-48">{t('Transaction & Job Ref')}</th>
                  <th className="py-3.5 px-6 w-52">{t('Customer & Date')}</th>
                  <th className="py-3.5 px-6 w-44">{t('Payment Method')}</th>
                  <th className="py-3.5 px-6 w-36 text-right">{t('Gross Amount')}</th>
                  <th className="py-3.5 px-6 w-44 text-right">{t('Platform Fee & Net')}</th>
                  <th className="py-3.5 px-6 w-44">{t('Payment Status')}</th>
                  <th className="py-3.5 px-6 w-36 text-right">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F2EA] text-sm">
                {paginatedTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#FAFBF7] transition-colors group">
                    {/* Transaction ID & Job Ref */}
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-bold text-[#5E6933] bg-[#EBF5EC] px-2.5 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap inline-block">
                          {txn.id}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="font-bold text-gray-900 whitespace-nowrap">
                            {txn.jobId}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span
                            className="truncate max-w-[140px] text-gray-500"
                            title={txn.serviceName}
                          >
                            {txn.serviceName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer & Date */}
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-gray-900 text-sm">
                          {txn.customerName}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {txn.customerPhone}
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {txn.timestamp}
                        </div>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 align-middle">{renderMethodBadge(txn.method)}</td>

                    {/* Gross Amount */}
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                        {formattedCurrency(txn.grossAmount)}
                      </div>
                    </td>

                    {/* Platform Fee & Net Payout */}
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="text-xs text-rose-600 font-medium whitespace-nowrap">
                        -{formattedCurrency(txn.platformFee)} ({txn.commissionPercentage || '10'}%)
                      </div>
                      <div className="font-extrabold text-[#5E6933] text-sm mt-0.5 whitespace-nowrap">
                        {formattedCurrency(txn.netPayout)}{' '}
                        <span className="text-[10px] text-gray-400 font-normal">({t('Net')})</span>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6 align-middle">{renderStatusBadge(txn.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewInvoice(txn)}
                          className="px-3 py-1.5 bg-white border border-[#E2E4D9] hover:bg-[#5E6933] hover:text-white hover:border-[#5E6933] text-gray-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('Invoice')}</span>
                        </button>
                        <button
                          onClick={() => onDownloadReceipt(txn)}
                          className="p-1.5 bg-white border border-[#E2E4D9] hover:bg-gray-100 text-gray-600 rounded-lg transition-all shadow-2xs"
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

          {/* TABLE FOOTER / PAGINATION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F9FAF7] px-6 py-3.5 border-t border-[#E2E4D9] text-xs text-gray-600">
            <div className="whitespace-nowrap">
              {t('Showing')}{' '}
              <span className="font-bold text-gray-900">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>
              –
              <span className="font-bold text-gray-900">
                {Math.min(currentPage * itemsPerPage, transactions.length)}
              </span>{' '}
              {t('of')} <span className="font-bold text-gray-900">{transactions.length}</span>{' '}
              {t('transactions')}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-[#E2E4D9] text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t('Previous')}</span>
              </button>
              <span className="px-3 py-1 font-semibold text-gray-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-[#E2E4D9] text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1"
              >
                <span>{t('Next')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTxns.map((txn) => (
            <div
              key={txn.id}
              className="bg-white rounded-2xl border border-[#E2E4D9] p-5 shadow-sm space-y-4 hover:border-[#5E6933]/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#5E6933] bg-[#EBF5EC] px-2.5 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap">
                    {txn.id}
                  </span>
                  <div className="text-xs font-bold text-gray-900 mt-1.5 whitespace-nowrap">
                    {txn.jobId}
                  </div>
                </div>
                {renderStatusBadge(txn.status)}
              </div>

              <div>
                <h5 className="font-bold text-gray-900 text-sm truncate">{txn.serviceName}</h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  {txn.customerName} • {txn.timestamp}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0F2EA] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase text-gray-400">
                    {t('Gross Charged')}
                  </div>
                  <div className="text-base font-extrabold text-gray-900">
                    {formattedCurrency(txn.grossAmount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold uppercase text-gray-400">
                    {t('Company Net')}
                  </div>
                  <div className="text-base font-extrabold text-[#5E6933]">
                    {formattedCurrency(txn.netPayout)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {renderMethodBadge(txn.method)}
                <button
                  onClick={() => onViewInvoice(txn)}
                  className="px-3 py-1.5 bg-white border border-[#E2E4D9] hover:bg-[#5E6933] hover:text-white text-gray-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {t('Invoice')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
