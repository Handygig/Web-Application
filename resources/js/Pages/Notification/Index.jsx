import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  Bell,
  CheckCheck,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Info,
  Trash2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function NotificationIndex({
  notifications: initialNotifications = [],
  routePrefix = 'admin',
}) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [prevInitial, setPrevInitial] = useState(initialNotifications);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sync state if server props change without useEffect anti-pattern
  if (initialNotifications !== prevInitial) {
    setPrevInitial(initialNotifications);
    setNotifications(initialNotifications);
  }

  const categories = [
    { id: 'all', label: t('All Notifications') },
    { id: 'unread', label: t('Unread') },
    { id: 'kyc', label: t('KYC Verification') },
    { id: 'booking', label: t('Bookings') },
    { id: 'dispute', label: t('Disputes') },
    { id: 'system', label: t('System Alerts') },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'unread') return !item.read;
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Persisted Mark All as Read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      router.post(
        route(`${routePrefix}.notifications.markAllRead`),
        {},
        { preserveScroll: true }
      );
    } catch (e) {
      console.error('Error marking all as read:', e);
    }
  };

  // Persisted Mark Single as Read
  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    try {
      router.patch(
        route(`${routePrefix}.notifications.read`, id),
        {},
        { preserveScroll: true }
      );
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  // Persisted Delete
  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      router.delete(
        route(`${routePrefix}.notifications.destroy`, id),
        { preserveScroll: true }
      );
    } catch (e) {
      console.error('Error deleting notification:', e);
    }
  };

  // Click on Card
  const handleNotificationClick = (n) => {
    if (!n.read) {
      handleMarkRead(n.id);
    }
    if (n.action_url) {
      router.visit(n.action_url);
    }
  };

  const getCategoryIcon = (category, type) => {
    if (category === 'kyc') {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
      );
    }
    if (category === 'booking') {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
          <Calendar className="h-5 w-5" />
        </div>
      );
    }
    if (category === 'dispute' || type === 'warning') {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
      );
    }
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 text-purple-700">
        <Info className="h-5 w-5" />
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title={t('Notifications')} />

      {/* Full width container matching Dashboard and other admin pages */}
      <div className="flex w-full flex-col gap-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Notifications & Activity Feed')}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {t(
                'Stay up to date with your system alerts, customer requests, and provider updates.'
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200/90 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 shrink-0"
            >
              <CheckCheck className="h-4 w-4 text-[#0f4a2d]" />
              <span>{t('Mark all as read')}</span>
            </button>
          )}
        </div>

        {/* Category Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0f4a2d] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.id === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-medium text-slate-400 px-3">
            {filteredNotifications.length} {t('Notifications')}
          </span>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t('No Notifications')}</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {t(
                  'You are all caught up! There are no unread or pending notifications in this category.'
                )}
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                role={n.action_url ? 'button' : undefined}
                tabIndex={n.action_url ? 0 : undefined}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && n.action_url) {
                    e.preventDefault();
                    handleNotificationClick(n);
                  }
                }}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
                  !n.read
                    ? 'border-emerald-200/90 bg-emerald-50/20 shadow-xs border-l-4 border-l-[#0f4a2d] hover:bg-emerald-50/40 hover:border-emerald-300'
                    : 'border-slate-100 bg-white shadow-2xs hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Left: Icon, Title, Badge, Description */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {getCategoryIcon(n.category, n.type)}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-emerald-950 transition-colors">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                          {t('New')}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        • {n.created_at}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                      {n.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!n.read && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n.id);
                      }}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition shadow-2xs"
                      title={t('Mark as read')}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n.id);
                    }}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-2xs"
                    title={t('Delete notification')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {n.action_url && (
                    <div className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all pl-1">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
