import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Briefcase,
  MapPin,
  History,
  CheckCircle2,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BannedAccountDetailModal({
  open = false,
  account = null,
  onClose,
  onUnban,
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !account) return null;

  const isTemporary = account.banType === 'Temporary';
  const initials = account.full_name
    ? account.full_name
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
        className="relative z-[100] w-full max-w-3xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-4 ring-red-50/50">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{t('Account & Ban Details')}</h3>
              <p className="text-xs text-slate-500">
                {t('Moderation overview for')}{' '}
                <span className="font-semibold text-slate-800">{account.full_name}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Banner Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-gradient-to-br from-red-50/60 to-slate-50 border border-red-100 mb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-md ring-4 ring-white">
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 truncate">{account.full_name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                <Lock className="h-3 w-3" />
                {t('Banned')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {account.accountType}
              </span>
            </div>

            {account.businessName && (
              <p className="mt-1 text-xs font-semibold text-theme-accent flex items-center justify-center sm:justify-start gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {account.businessName}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{account.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{account.phone || '+1 555-0199'}</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-slate-400">
                <span>{account.accountId || `ACC-${account.id}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information Panel */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/60 pb-2">
              {t('Account Information')}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="block text-slate-400 font-medium">{t('Account Type')}</span>
                <span className="font-semibold text-slate-800">{account.accountType}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">{t('Registration Date')}</span>
                <span className="font-semibold text-slate-800">
                  {account.joinedDate || 'Nov 14, 2024'}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">{t('Last Login')}</span>
                <span className="font-semibold text-slate-800">
                  {account.lastLogin || 'Aug 10, 2026'}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">{t('Previous Violations')}</span>
                <span className="font-semibold text-red-600">
                  {account.previousViolations ?? 1}
                </span>
              </div>
            </div>

            {account.accountType === 'Provider' && (
              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium">{t('Business Category')}</span>
                  <span className="font-semibold text-slate-800">
                    {account.category || 'General Service'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Location')}</span>
                  <span className="font-semibold text-slate-800">
                    {account.location || 'New York, NY'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ban Information Panel */}
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 border-b border-red-100 pb-2">
              {t('Ban Information')}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="block text-slate-400 font-medium">{t('Ban Type')}</span>
                <span className="font-bold text-slate-900">{account.banType}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">{t('Banned By')}</span>
                <span className="font-semibold text-slate-800">
                  {account.bannedBy || 'Admin Alex'}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">{t('Banned Date')}</span>
                <span className="font-semibold text-slate-800">{account.bannedDate}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">{t('Expiry Status')}</span>
                <span className="font-bold text-red-600">
                  {isTemporary ? account.expiryNotice || 'Expires in 12 days' : t('Permanent')}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-red-100/60">
              <span className="block text-xs font-semibold text-slate-400 mb-1">
                {t('Primary Ban Reason')}
              </span>
              <span className="inline-block rounded-lg bg-red-100/80 px-2.5 py-1 text-xs font-bold text-red-800 border border-red-200">
                {account.reason}
              </span>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-red-100">
                {account.detailedReason || account.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Ban History Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-slate-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('Ban History')}
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="py-2.5 px-3">{t('Date')}</th>
                  <th className="py-2.5 px-3">{t('Action')}</th>
                  <th className="py-2.5 px-3">{t('Ban Type')}</th>
                  <th className="py-2.5 px-3">{t('Reason')}</th>
                  <th className="py-2.5 px-3">{t('Admin')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(
                  account.history || [
                    {
                      date: account.bannedDate,
                      action: 'Account Banned',
                      banType: account.banType,
                      reason: account.reason,
                      admin: account.bannedBy || 'Admin Alex',
                    },
                  ]
                ).map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-medium text-slate-900">{h.date}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{h.action}</td>
                    <td className="py-2 px-3">{h.banType}</td>
                    <td className="py-2 px-3 text-slate-600 italic">{h.reason}</td>
                    <td className="py-2 px-3">{h.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('Close')}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onUnban) onUnban(account);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
          >
            <UserCheck className="h-4 w-4" />
            {t('Unban Account')}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
