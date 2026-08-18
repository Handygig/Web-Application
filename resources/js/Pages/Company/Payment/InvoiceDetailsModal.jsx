import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Building,
  User,
  Phone,
  MapPin,
  Wrench,
  ShieldCheck,
  CreditCard,
  Percent,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function InvoiceDetailsModal({ isOpen, onClose, transaction, companyName }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const handleCopyTxn = () => {
    navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5E6933] flex items-center justify-center text-white font-bold shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">
                  {t('Invoice & Settlement Breakdown')}
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-400/30">
                  {transaction.id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {companyName || 'Handy Gig Service Provider'} • {transaction.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-800 text-sm">
          {/* Quick Action bar & Copy TXN */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">{t('Transaction ID')}:</span>
              <span className="font-mono text-sm font-bold text-slate-900">{transaction.id}</span>
              <button
                onClick={handleCopyTxn}
                className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
                title={t('Copy ID')}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                {t('Print')}
              </button>
              <button
                onClick={() => alert(t(`Downloading official PDF receipt for ${transaction.id}...`))}
                className="px-3.5 py-1.5 bg-[#5E6933] hover:bg-[#4d5729] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                {t('Download PDF Receipt')}
              </button>
            </div>
          </div>

          {/* Job & Customer Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#5E6933]" />
                {t('Job Reference')}
              </span>
              <div className="font-bold text-slate-900 text-base flex items-center justify-between">
                <span>{transaction.jobId}</span>
                <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {transaction.serviceCategory || 'Service'}
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-xs">{transaction.serviceName}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {transaction.serviceAddress || '742 Evergreen Terrace, Sector 4'}
              </p>
            </div>

            {/* Customer Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#5E6933]" />
                {t('Customer Information')}
              </span>
              <div className="font-bold text-slate-900 text-base">{transaction.customerName}</div>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {transaction.customerPhone}
              </p>
              <p className="text-xs text-slate-500">
                {t('Payment Method')}: <strong className="text-slate-800 uppercase">{transaction.method}</strong>
              </p>
            </div>
          </div>

          {/* Itemized Cost & Platform Split Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5E6933]" />
              {t('Itemized Revenue & Commission Split')}
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-4">{t('Description')}</th>
                    <th className="py-2.5 px-4 text-right">{t('Amount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      {t('Base Service & Labor Charges')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formattedCurrency((transaction.grossAmount || 0) * 0.75)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">
                      {t('Parts & Specialized Materials')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formattedCurrency((transaction.grossAmount || 0) * 0.25)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="py-3 px-4">{t('Gross Total Charged to Customer')}</td>
                    <td className="py-3 px-4 text-right text-base">
                      {formattedCurrency(transaction.grossAmount)}
                    </td>
                  </tr>
                  <tr className="text-rose-600 bg-rose-50/40">
                    <td className="py-3 px-4 flex items-center gap-1.5 font-medium">
                      <Percent className="w-3.5 h-3.5 text-rose-500" />
                      {t('Handy Gig Platform Fee')} ({transaction.commissionPercentage || '10'}%)
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      -{formattedCurrency(transaction.platformFee)}
                    </td>
                  </tr>
                  <tr className="bg-[#EBF5EC] text-emerald-900 font-extrabold text-sm border-t-2 border-emerald-300">
                    <td className="py-3.5 px-4 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      {t('Company Net Earnings (Available)')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-base text-[#5E6933]">
                      {formattedCurrency(transaction.netPayout)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Technician Payout Share */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-700" />
                {t('Technician Payout Share')}
              </span>
              <p className="text-xs text-amber-800 font-semibold mt-1">
                {transaction.technicianName || 'David Miller (Master Plumber)'}
              </p>
              <p className="text-xs text-amber-700">
                {t('Assigned Rate')}: 60% of Company Net ({formattedCurrency((transaction.netPayout || 0) * 0.6)})
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
              {transaction.status === 'disbursed' ? t('Disbursed to Tech') : t('Scheduled for Weekly Payout')}
            </span>
          </div>

          {/* Transaction Status Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5E6933]" />
              {t('Transaction Processing Timeline')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-800">{t('Authorized')}</div>
                <div className="text-[10px] text-slate-500">{transaction.timestamp}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-800">{t('Customer Charged')}</div>
                <div className="text-[10px] text-slate-500">{formattedCurrency(transaction.grossAmount)}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-800">{t('Fee Deducted')}</div>
                <div className="text-[10px] text-slate-500">-{formattedCurrency(transaction.platformFee)}</div>
              </div>

              <div className="p-3 bg-[#EBF5EC] rounded-xl border border-emerald-300">
                <div className="w-6 h-6 rounded-full bg-[#5E6933] text-white flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#5E6933]">{t('Settled to Company')}</div>
                <div className="text-[10px] text-emerald-800 font-semibold">{formattedCurrency(transaction.netPayout)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition-all"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
