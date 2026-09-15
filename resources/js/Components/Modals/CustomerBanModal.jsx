import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Check } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const REASON_OPTIONS = [
  'Policy Violation',
  'Fraud',
  'Abuse',
  'Suspicious Activity',
  'Multiple Violations',
  'Other',
];

export default function CustomerBanModal({
  open = false,
  customer = null,
  onClose,
  onConfirm,
  processing = false,
}) {
  const { t } = useTranslation();
  const [banType, setBanType] = useState('Permanent');
  const [reason, setReason] = useState('Policy Violation');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setBanType('Permanent');
      setReason('Policy Violation');
      setNotes('');
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

  if (!open || !customer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm({
        banType,
        reason,
        notes: notes.trim(),
      });
    }
  };

  return typeof document !== 'undefined'
    ? createPortal(
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
                <Lock className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900">{t('Ban Customer Account')}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {t('Restrict access for')}{' '}
                  <span className="font-semibold text-slate-800">{customer.full_name}</span>.{' '}
                  {t('Select the ban parameters and reason below.')}
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
                  {t('Ban Type')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBanType('Temporary')}
                    className={`rounded-xl p-3 text-xs font-bold transition border ${
                      banType === 'Temporary'
                        ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t('Temporary (30 Days)')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBanType('Permanent')}
                    className={`rounded-xl p-3 text-xs font-bold transition border ${
                      banType === 'Permanent'
                        ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t('Permanent Ban')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {t('Reason')} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REASON_OPTIONS.map((opt) => {
                    const isSelected = reason === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setReason(opt)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-left transition border ${
                          isSelected
                            ? 'border-red-500 bg-red-50 text-red-700 font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{t(opt)}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Additional Notes / Explanation')}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('Provide extra moderation context or evidence details...')}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
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
                  <Lock className="h-4 w-4" />
                  {t('Ban Account')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
}
