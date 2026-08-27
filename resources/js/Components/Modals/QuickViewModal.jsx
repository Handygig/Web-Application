import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Briefcase, Mail, Phone, Calendar, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function QuickViewModal({
  open = false,
  type = 'customer', // 'customer' or 'provider'
  data = null,
  onClose,
}) {
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !data || !mounted || typeof window === 'undefined' || !window.document?.body) return null;

  const isCustomer = type === 'customer';

  const initials = (isCustomer ? data.name : data.name || data.providerName)
    ? (isCustomer ? data.name : data.name || data.providerName)
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-md overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            {isCustomer ? <User className="h-4 w-4 text-theme-accent" /> : <Briefcase className="h-4 w-4 text-theme-accent" />}
            {isCustomer ? t('Customer Quick View') : t('Provider Quick View')}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-white font-bold text-lg ring-4 ring-white shadow-xs">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-lg truncate">
              {isCustomer ? data.name : data.providerName || data.name}
            </h3>
            {!isCustomer && data.businessName && (
              <span className="text-xs font-semibold text-theme-accent block">{data.businessName}</span>
            )}
            <span className="text-xs font-mono font-medium text-slate-400 block mt-0.5">
              {isCustomer ? data.customerId || `CUST-${data.id || '102'}` : data.providerId || `PRV-${data.id || '204'}`}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {t('Email')}
            </span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">{data.email || 'user@example.com'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {t('Phone')}
            </span>
            <span className="font-semibold text-slate-800">{data.phone || '+94 77 123 4567'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              {t('Verification Status')}
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {t('Verified')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, window.document.body);
}
