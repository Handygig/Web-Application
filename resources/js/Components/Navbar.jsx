import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import Tooltip from '../ui/Tooltip';

const ROLES = ['user', 'ehs', 'admin'];

const ROLE_LABELS = {
  user: 'User',
  ehs: 'EHS',
  admin: 'Admin',
  'super-admin': 'Super Admin',
};

const ROLE_DASHBOARD_PATHS = {
  user: '/user/dashboard',
  ehs: '/ehs/dashboard',
  admin: '/admin/user-management',
};

// ─────────────────────────────────────────────
// Navbar
// Props:
//   activeRole  – 'user' | 'ehs' | 'admin'
//   onRoleChange(role) – called when user picks a different role
//   onMenuToggle – opens mobile sidebar
// ─────────────────────────────────────────────
export default function Navbar({
  activeRole = 'user',
  onRoleChange,
  onMenuToggle,
  theme,
  onThemeToggle,
}) {
  const { t } = useTranslation();
  const { props, url } = usePage();
  const { auth, locale, availableLocales } = props;

  // Derive available roles for the current user from Spatie
  const userRoles = auth?.user?.roles?.map((r) => r.name) ?? [activeRole];

  const availableRoles = ROLES.filter((role) => {
    if (userRoles.includes('admin')) {
      return true;
    }
    if (userRoles.includes('ehs')) {
      return role === 'user' || role === 'ehs';
    }
    return role === 'user';
  });

  const [roleOpen, setRoleOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleRef = useRef(null);
  const langRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handler(e) {
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false);
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

  function switchRole(role) {
    setRoleOpen(false);
    onRoleChange?.(role);

    const dashboardPath = ROLE_DASHBOARD_PATHS[role];
    if (!dashboardPath || window.location.pathname === dashboardPath) return;

    localStorage.setItem('safora-active-role', role);
    router.visit(dashboardPath, {
      preserveScroll: false,
      preserveState: false,
    });
  }

  function changeLocale(newLocale) {
    setLangOpen(false);
    router.post(route('locale.change'), { locale: newLocale }, { preserveScroll: true });
  }

  const notificationBackUrl = url?.startsWith('/user/notifications')
    ? ROLE_DASHBOARD_PATHS[activeRole] || '/user/dashboard'
    : url || ROLE_DASHBOARD_PATHS[activeRole] || '/user/dashboard';

  return (
    <header className="sticky top-0 z-30 shrink-0 select-none px-4 pt-4">
      <div className="flex h-16 items-center justify-between rounded-[12px] border border-white/70 px-4 backdrop-blur-md sm:px-5 bg-navbar-custom shadow-navbar-custom">
        {/* Left cluster */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/images/safora-logo.png" alt="Logo" className="h-12 w-auto" />
          </div>

          {activeRole !== 'super-admin' &&
            !userRoles.includes('super-admin') &&
            !userRoles.includes('external') && (
              <div className="relative" ref={roleRef}>
                <button
                  onClick={() => setRoleOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-[9px] border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>{ROLE_LABELS[activeRole] ?? activeRole}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {roleOpen && (
                  <div className="absolute left-0 top-full mt-2 w-32 rounded-[9px] border border-slate-200 bg-white/95 py-1 shadow-xl backdrop-blur-sm z-50">
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => switchRole(role)}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${activeRole === role ? 'bg-theme-accent-soft text-theme-accent font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {ROLE_LABELS[role]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggler */}
          {/* <button
            onClick={onThemeToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            title="Switch theme"
          >
            <span
              className="h-4.5 w-4.5 rounded-full border border-black/10 shadow-inner transition-colors duration-300"
              style={{
                backgroundColor:
                  theme === 'theme-blue'
                    ? '#0090FF'
                    : theme === 'theme-green'
                      ? '#4CAF70'
                      : '#18252F',
              }}
            />
          </button> */}

          <Tooltip
            content={t('Notifications')}
            tooltipClassName="bg-slate-900/90 text-white px-2 py-1.5 rounded-md text-[10px] font-medium"
            tooltipStyle={{
              left: '50%',
              transform: 'translateX(-50%)',
              top: 'calc(100% + 8px)',
              bottom: 'auto',
            }}
          >
            <Link
              href={route('user.notifications.index', { back_url: notificationBackUrl })}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5 stroke-[1.75]" />
              {auth?.user?.unread_notifications > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
              )}
            </Link>
          </Tooltip>

          <div className="relative" ref={langRef}>
            <Tooltip
              content={!langOpen ? t('Language') : null}
              tooltipClassName="bg-slate-900/90 text-white px-2 py-1.5 rounded-md text-[10px] font-medium"
              tooltipStyle={{
                left: '50%',
                transform: 'translateX(-50%)',
                top: 'calc(100% + 8px)',
                bottom: 'auto',
              }}
            >
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                aria-label="Change language"
              >
                <Globe className="h-4.5 w-4.5 stroke-[1.75]" />
              </button>
            </Tooltip>

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
            <Tooltip
              content={!profileOpen ? t('Profile') : null}
              tooltipClassName="bg-slate-900/90 text-white px-2 py-1.5 rounded-md text-[10px] font-medium"
              tooltipStyle={{
                left: '50%',
                transform: 'translateX(-50%)',
                top: 'calc(100% + 8px)',
                bottom: 'auto',
              }}
            >
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
            </Tooltip>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white/95 py-1 shadow-xl backdrop-blur-sm z-50">
                {auth?.user && (
                  <div className="border-b border-slate-100 px-4 py-2 text-xs font-medium text-slate-500">
                    <p className="font-semibold text-slate-800 truncate">{auth.user.name}</p>
                    <p className="truncate text-[10px] text-slate-400">{auth.user.email}</p>
                  </div>
                )}

                <Link
                  href={route('user.profile')}
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
