import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Globe, User, LogOut } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Navbar({ onMenuToggle }) {
  const { t } = useTranslation();
  const { props, url } = usePage();
  const { auth, locale, availableLocales } = props;

  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
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

  return (
    <header className="sticky top-0 z-30 shrink-0 select-none px-4 pt-4">
      <div className="flex h-16 items-center justify-between rounded-[12px] border border-white/70 px-4 backdrop-blur-md sm:px-5 bg-navbar-custom shadow-navbar-custom">
        {/* Left cluster */}
        <div className="flex items-center gap-3">
          <img src="/images/handygig-logo.png" alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2.5">
          <Link
            href={route('dashboard')}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5 stroke-[1.75]" />
            {auth?.user?.unread_notifications > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            )}
          </Link>

          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              aria-label="Change language"
            >
              <Globe className="h-4.5 w-4.5 stroke-[1.75]" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-2xl border border-slate-200 bg-white/95 py-1 shadow-xl backdrop-blur-sm z-50">
                {Object.entries(availableLocales ?? {}).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => changeLocale(code)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${locale === code ? 'bg-theme-accent-soft text-theme-accent font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 overflow-hidden"
              aria-label="User profile"
            >
              {auth?.user?.profile_image ? (
                <img
                  src={auth.user.image_url}
                  alt={auth.user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-4.5 w-4.5 stroke-[1.75]" />
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white/95 py-1 shadow-xl backdrop-blur-sm z-50">
                {auth?.user && (
                  <div className="border-b border-slate-100 px-4 py-2 text-xs font-medium text-slate-500">
                    <p className="font-semibold text-slate-800 truncate">{auth.user.name}</p>
                    <p className="truncate text-[10px] text-slate-400">{auth.user.email}</p>
                  </div>
                )}

                <Link
                  href={route('profile.edit')}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  <span>{t('Profile')}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
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
