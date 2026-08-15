import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertOctagon, Check, FileText } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const PREDEFINED_REASONS = [
  'Invalid document',
  'Expired document',
  'Missing document',
  'Information mismatch',
  'Document is unclear',
  'Business information could not be verified',
  'Other',
];

export default function KycRejectModal({
  open = false,
  providerName = '',
  onClose,
  onConfirm,
  processing = false,
}) {
  const { t } = useTranslation();
  const [selectedReasonOption, setSelectedReasonOption] = useState('Invalid document');
  const [customReasonText, setCustomReasonText] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedReasonOption('Invalid document');
      setCustomReasonText('');
      setErrorText('');
    }
  }, [open]);

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason =
      selectedReasonOption === 'Other'
        ? customReasonText.trim()
        : `${selectedReasonOption}${customReasonText.trim() ? `: ${customReasonText.trim()}` : ''}`;

    if (!finalReason) {
      setErrorText(t('Please provide a reason for rejecting this verification request.'));
      return;
    }

    setErrorText('');
    if (onConfirm) {
      onConfirm(finalReason);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-lg overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
            <AlertOctagon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">{t('Reject Verification')}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {t('Rejecting verification for')} <span className="font-semibold text-slate-800">{providerName}</span>. {t('Please specify the exact reason so the provider can rectify their submission.')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {t('Select Predefined Reason')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PREDEFINED_REASONS.map((option) => {
                const isSelected = selectedReasonOption === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedReasonOption(option)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-left transition border ${
                      isSelected
                        ? 'border-red-500 bg-red-50/70 text-red-700 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t(option)}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('Reason for Rejection')} *
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <textarea
                rows={3}
                required
                value={customReasonText}
                onChange={(e) => {
                  setCustomReasonText(e.target.value);
                  if (errorText) setErrorText('');
                }}
                placeholder={t('Enter the reason why this verification request is being rejected...')}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>
            {errorText && <p className="mt-1 text-xs font-medium text-red-500">{errorText}</p>}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
            >
              {t('Reject Verification')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
