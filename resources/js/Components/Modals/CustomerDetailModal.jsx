import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Clock,
  Ban,
  PauseCircle,
  History,
  Activity,
  Edit2,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function CustomerDetailModal({
  open = false,
  customer = null,
  onClose,
  onEdit,
  onSuspend,
  onBan,
  onReactivate,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !customer) return null;

  const initials = customer.full_name
    ? customer.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'C';

  const status = customer.status || 'Active';
  const isActive = status === 'Active';
  const isSuspended = status === 'Suspended';
  const isBanned = status === 'Banned';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-4xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <User className="h-4 w-4 text-theme-accent" />
            {t('Customer Profile')}
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

        {/* Top Profile Summary Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 min-w-0">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-theme-accent font-bold text-white text-2xl shadow-md ring-4 ring-white">
              {initials}
            </div>

            <div className="text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-bold text-slate-900 truncate">{customer.full_name}</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isSuspended
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : isBanned
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-500'
                        : isSuspended
                        ? 'bg-amber-500'
                        : isBanned
                        ? 'bg-red-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  {status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{customer.phone || '+1 555-0101'}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-slate-400">
                  <span>{customer.customerId || `CUST-${customer.id}`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(customer);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              {t('Edit')}
            </button>

            {!isActive && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onReactivate) onReactivate(customer);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-2xs"
              >
                <UserCheck className="h-3.5 w-3.5" />
                {t('Reactivate')}
              </button>
            )}

            {!isSuspended && !isBanned && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSuspend) onSuspend(customer);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition shadow-2xs"
              >
                <PauseCircle className="h-3.5 w-3.5" />
                {t('Suspend')}
              </button>
            )}

            {!isBanned && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onBan) onBan(customer);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition shadow-2xs"
              >
                <Lock className="h-3.5 w-3.5" />
                {t('Ban')}
              </button>
            )}
          </div>
        </div>

        {/* Workspace Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-theme-accent text-theme-accent'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('Overview & Personal Info')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'orders'
                ? 'border-theme-accent text-theme-accent'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('Order & Booking History')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'activity'
                ? 'border-theme-accent text-theme-accent'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('Activity & Audit History')}
          </button>
        </div>

        {/* Tab 1: Overview & Personal Information */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overview Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t('Total Orders')}
                </span>
                <span className="text-xl font-bold text-slate-900">{customer.ordersCount || 18}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t('Total Spending')}
                </span>
                <span className="text-xl font-bold text-emerald-600">${customer.totalSpent || '1,450.00'}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t('Completed')}
                </span>
                <span className="text-xl font-bold text-indigo-600">{customer.completedOrders || 16}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t('Account Age')}
                </span>
                <span className="text-xl font-bold text-slate-900">{customer.accountAge || '1.5 yrs'}</span>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                {t('Personal Information')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium">{t('Full Name')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.full_name}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Email Address')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.email}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Phone Number')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.phone || '+1 555-0101'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Account Type')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.customerType || 'Individual Customer'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Address')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.address || '742 Evergreen Terrace'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('City & Country')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.city || 'Springfield'}, {customer.country || 'United States'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Registration Date')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.joined || customer.joinedDate || 'Jan 12, 2025'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">{t('Last Activity / Login')}</span>
                  <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{customer.lastActive || 'Today, 10:30 AM'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Order & Booking History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Recent Booking / Order History')}</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="py-2.5 px-3">{t('Order ID')}</th>
                    <th className="py-2.5 px-3">{t('Date')}</th>
                    <th className="py-2.5 px-3">{t('Provider')}</th>
                    <th className="py-2.5 px-3">{t('Amount')}</th>
                    <th className="py-2.5 px-3">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(customer.orders || [
                    { id: 'ORD-1024', date: 'Aug 14, 2026', provider: 'Vance Master Plumbing', amount: '$180.00', status: 'Completed' },
                    { id: 'ORD-1019', date: 'Jul 28, 2026', provider: 'BrightSpark Electrical', amount: '$240.00', status: 'Completed' },
                    { id: 'ORD-1005', date: 'Jul 10, 2026', provider: 'GreenHouse Eco Clean', amount: '$110.00', status: 'Completed' },
                    { id: 'ORD-0992', date: 'Jun 22, 2026', provider: 'Sterling Climate Control', amount: '$95.00', status: 'Cancelled' },
                  ]).map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="py-2.5 px-3 text-slate-600">{order.date}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{order.provider}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{order.amount}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold ${
                            order.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Activity & Moderation History */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-theme-accent" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Recent Customer Activity Timeline')}</h4>
              </div>

              <div className="space-y-3 pl-2 border-l-2 border-slate-100 text-xs">
                {(customer.activityLogs || [
                  { time: 'Today, 10:30 AM', title: 'Customer logged in to platform', icon: Clock },
                  { time: 'Yesterday, 04:15 PM', title: 'Completed booking #ORD-1024 with Vance Master Plumbing', icon: CheckCircle2 },
                  { time: 'Aug 12, 2026', title: 'Updated customer profile phone number and address', icon: Edit2 },
                  { time: 'Aug 10, 2026', title: 'Registered customer account', icon: User },
                ]).map((act, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span className="absolute -left-[17px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-indigo-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-theme-accent" />
                    </span>
                    <span className="font-bold text-slate-900">{act.time}</span>
                    <p className="text-slate-600 mt-0.5">{act.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-slate-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Account History Log')}</h4>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <th className="py-2.5 px-3">{t('Date')}</th>
                      <th className="py-2.5 px-3">{t('Action')}</th>
                      <th className="py-2.5 px-3">{t('Description')}</th>
                      <th className="py-2.5 px-3">{t('Admin')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(customer.accountHistory || [
                      { date: 'Aug 12, 2026', action: 'Profile Updated', description: 'Address updated by customer', admin: '—' },
                      { date: 'Jan 12, 2025', action: 'Account Created', description: 'Initial account registration', admin: 'System' },
                    ]).map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-medium text-slate-900">{h.date}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{h.action}</td>
                        <td className="py-2 px-3 text-slate-600 italic">{h.description}</td>
                        <td className="py-2 px-3">{h.admin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('Close Profile')}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
