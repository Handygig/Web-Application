import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Globe, User, LogOut, Menu, Check, Shield } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Navbar({ onMenuToggle }) {
  const { t } = useTranslation();
  const { props } = usePage();
  const { auth, locale, availableLocales } = props;

  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(auth?.user?.unread_notifications ?? 3);

  const userRoles = auth?.user?.roles?.map((r) => r.name) ?? [];
  const isAdmin = userRoles.includes('admin');
  const roleName = isAdmin ? 'Administrator' : 'Company Manager';

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New KYC Submission',
      desc: 'Electrical Services Provider submitted license verification',
      time: '5 min ago',
      unread: true,
      href: isAdmin ? route('admin.providers.kyc') : route('company.dashboard'),
    },
    {
      id: 2,
      title: 'Booking Completed',
      desc: 'Booking #BK-001246 was marked completed by provider',
      time: '1 hour ago',
      unread: true,
      href: route((isAdmin ? 'admin' : 'company') + '.bookings.index'),
    },
    {
      id: 3,
      title: 'New Dispute Filed',
      desc: 'Customer Sarah opened dispute on plumbing request #401',
      time: '3 hours ago',
      unread: true,
      href: route((isAdmin ? 'admin' : 'company') + '.bookings.index'),
    },
  ]);

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    setProfileOpen(false);
    router.post(route('logout'));
  }

  function changeLocale(newLocale) {
    setLangOpen(false);
    router.post(route('locale.update'), { locale: newLocale }, { preserveScroll: true });
  }

  const markAllRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Locales list (fallback if props availableLocales is empty)
  const locales =
    availableLocales && Object.keys(availableLocales).length > 0
      ? availableLocales
      : {
          en: 'English',
          si: 'Sinhala (සිංහල)',
          ta: 'Tamil (தமிழ்)',
        };

  return (
    <header className="sticky top-0 z-30 shrink-0 select-none px-4 pt-3 pb-1">
      <div className="flex h-16 items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 shadow-lg backdrop-blur-xl transition-all sm:px-6">
        {/* Left cluster */}
        <div className="flex items-center gap-3.5">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 active:scale-95 md:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href={route('dashboard')} className="group flex items-center gap-2.5">
            <img src="/images/handygig-logo.png" alt="Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setLangOpen(false);
                setProfileOpen(false);
              }}
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                notifOpen
                  ? 'border-theme-accent bg-theme-accent-10 text-theme-accent'
                  : 'border-slate-200/80 bg-white/80 text-slate-600 hover:border-theme-accent/30 hover:bg-theme-accent-5 hover:text-theme-accent'
              }`}
              aria-label="Notifications"
              title={t('Notifications')}
            >
              <Bell className="h-4.5 w-4.5 stroke-[1.8]" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{t('Notifications')}</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-theme-accent/10 px-2 py-0.5 text-[10px] font-bold text-theme-accent">
                        {unreadCount} {t('New')}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-theme-accent hover:underline"
                    >
                      {t('Mark all as read')}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={
                        n.href ||
                        route((isAdmin ? 'admin' : 'company') + '.notifications.index')
                      }
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                        );
                        setNotifOpen(false);
                      }}
                      className={`block p-3 transition-colors ${
                        n.unread ? 'bg-indigo-50/30 hover:bg-indigo-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 hover:text-theme-accent transition">
                          {n.title}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 leading-snug">{n.desc}</p>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1 text-center">
                  <Link
                    href={route((isAdmin ? 'admin' : 'company') + '.notifications.index')}
                    onClick={() => setNotifOpen(false)}
                    className="block rounded-xl py-1.5 text-xs font-bold text-theme-accent hover:bg-theme-accent-5 transition"
                  >
                    {t('View All Activities')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                setLangOpen((v) => !v);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                langOpen
                  ? 'border-theme-accent bg-theme-accent-10 text-theme-accent'
                  : 'border-slate-200/80 bg-white/80 text-slate-600 hover:border-theme-accent/30 hover:bg-theme-accent-5 hover:text-theme-accent'
              }`}
              aria-label="Change language"
              title={t('Language')}
            >
              <Globe className="h-4.5 w-4.5 stroke-[1.8]" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  {t('Select Language')}
                </div>
                {Object.entries(locales).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => changeLocale(code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                      locale === code
                        ? 'bg-theme-accent-10 font-semibold text-theme-accent'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{name}</span>
                    {locale === code && <Check className="h-3.5 w-3.5 text-theme-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mx-1 h-6 w-px bg-slate-200/80 hidden sm:block" />

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 p-1 pr-3 text-slate-700 transition-all hover:border-theme-accent/30 hover:bg-white active:scale-95"
              aria-label="User profile"
            >
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-theme-accent-10 text-theme-accent ring-2 ring-white">
                {auth?.user?.profile_image ? (
                  <img
                    src={auth.user.image_url}
                    alt={auth.user.full_name || auth.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 stroke-[2]" />
                )}
              </div>
              <div className="hidden flex-col text-left sm:flex">
                <span className="max-w-[110px] truncate text-xs font-semibold text-slate-800 leading-tight">
                  {auth?.user?.full_name || auth?.user?.name || 'Admin'}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {roleName}
                </span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {auth?.user && (
                  <div className="border-b border-slate-100/80 p-3 bg-slate-50/50 rounded-xl mb-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-3.5 w-3.5 text-theme-accent" />
                      <span className="text-[11px] font-bold text-theme-accent uppercase tracking-wider">
                        {roleName}
                      </span>
                    </div>
                    <p className="font-semibold text-xs text-slate-800 truncate">
                      {auth.user.full_name || auth.user.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-400 mt-0.5">
                      {auth.user.email}
                    </p>
                  </div>
                )}

                <Link
                  href={route((isAdmin ? 'admin' : 'company') + '.profile.index')}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-theme-accent-5 hover:text-theme-accent"
                >
                  <User className="h-4 w-4" />
                  <span>{t('Account Profile')}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('Log Out')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
