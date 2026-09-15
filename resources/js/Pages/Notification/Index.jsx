import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  Bell,
  CheckCheck,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Info,
  ExternalLink,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function NotificationIndex({ notifications: initialNotifications = [] }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('All Notifications') },
    { id: 'unread', label: t('Unread') },
    { id: 'kyc', label: t('KYC Verification') },
    { id: 'booking', label: t('Bookings') },
    { id: 'system', label: t('System Alerts') },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'unread') return !item.read;
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getCategoryIcon = (category, type) => {
    if (category === 'kyc') return <ShieldCheck className="h-5 w-5 text-indigo-500" />;
    if (category === 'booking') return <Calendar className="h-5 w-5 text-emerald-500" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <Info className="h-5 w-5 text-theme-accent" />;
  };

  return (
    <AppLayout>
      <Head title={t('Notifications')} />

      <div className="mx-auto max-w-6xl space-y-6 pb-12">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Notifications & Activity Feed')}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t(
                'Stay up to date with your system alerts, customer requests, and provider updates.'
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <CheckCheck className="h-4 w-4 text-theme-accent" />
              {t('Mark all as read')}
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-2 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-theme-accent text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                  {cat.id === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
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
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
                  !n.read
                    ? 'border-theme-accent/30 bg-theme-accent-5/40 shadow-xs'
                    : 'border-slate-200/80 bg-white shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      !n.read
                        ? 'border-theme-accent/20 bg-theme-accent/10'
                        : 'border-slate-200/80 bg-slate-50'
                    }`}
                  >
                    {getCategoryIcon(n.category, n.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                      {!n.read && (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {t('New')}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-400">
                        • {n.created_at}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {n.action_url && n.action_text && (
                    <Link
                      href={n.action_url}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-theme-accent px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-theme-accent-hover transition"
                    >
                      <span>{t(n.action_text)}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
                      title={t('Mark as read')}
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(n.id)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title={t('Delete notification')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
