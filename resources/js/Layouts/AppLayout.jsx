import React, { useState, useEffect, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { getNavByRole } from '../config/navConfig';
import Toast from '../Components/Other/Toast';
import { useTranslation } from '../Hooks/useTranslation';

function roleFromPath(pathname) {
  if (pathname?.startsWith('/admin')) return 'admin';
  if (pathname?.startsWith('/company')) return 'company';
  return null;
}

export default function AppLayout({ children }) {
  const { auth, flash } = usePage().props;
  const { t } = useTranslation();

  // Resolve the user's primary role
  const userRoles = auth?.user?.roles?.map((r) => r.name) ?? [];
  const isAdmin = userRoles.includes('admin');

  const primaryRole = isAdmin ? 'admin' : 'company';
  const availableRoles = useMemo(() => (isAdmin ? ['admin', 'company'] : ['company']), [isAdmin]);

  const [activeRole, setActiveRole] = useState(() => {
    const pathRole = roleFromPath(window.location.pathname);
    const storedRole = localStorage.getItem('safora-active-role');

    if (availableRoles.includes(pathRole)) return pathRole;
    return availableRoles.includes(storedRole) ? storedRole : primaryRole;
  });

  // Derive a safe active role — if current value is no longer available, fall back to primary
  const resolvedActiveRole = availableRoles.includes(activeRole) ? activeRole : primaryRole;

  const [dismissedFlashKey, setDismissedFlashKey] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('safora-theme') || 'theme-blue';
  });

  // Update body class lists when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-blue', 'theme-green', 'theme-darkblue');
    root.classList.add(theme);
    localStorage.setItem('safora-theme', theme);
  }, [theme]);

  // Support theme toggling from child components via custom events
  useEffect(() => {
    const handleThemeToggle = () => {
      setTheme((currentTheme) => {
        if (currentTheme === 'theme-blue') return 'theme-green';
        if (currentTheme === 'theme-green') return 'theme-darkblue';
        return 'theme-blue';
      });
    };
    const handleThemeSet = (e) => {
      if (e.detail) {
        setTheme(e.detail);
      }
    };
    window.addEventListener('safora-toggle-theme', handleThemeToggle);
    window.addEventListener('safora-set-theme', handleThemeSet);
    return () => {
      window.removeEventListener('safora-toggle-theme', handleThemeToggle);
      window.removeEventListener('safora-set-theme', handleThemeSet);
    };
  }, []);

  // Persist the active role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('safora-active-role', resolvedActiveRole);
  }, [resolvedActiveRole]);

  // Derive the flash to display from Inertia's flash prop
  const flashMessage = flash?.success || flash?.error;
  const flashKey = flashMessage ?? null;
  const visibleFlash = useMemo(() => {
    if (!flashMessage || flashKey === dismissedFlashKey) return null;
    return { message: flashMessage, type: flash?.success ? 'success' : 'error' };
  }, [flashMessage, flashKey, dismissedFlashKey, flash?.success]);

  // Auto-dismiss after 4.5 s
  useEffect(() => {
    if (!visibleFlash) return;
    const timeout = window.setTimeout(() => setDismissedFlashKey(flashKey), 4500);
    return () => window.clearTimeout(timeout);
  }, [visibleFlash, flashKey]);

  // Resolve nav items for the active role
  const NAV_BY_ROLE = getNavByRole(t);
  const rawNavItems = NAV_BY_ROLE[resolvedActiveRole] ?? NAV_BY_ROLE.company;
  const userPermissions = auth?.user?.permissions ?? {};

  const filterNavItems = (items) => {
    return items
      .filter((item) => {
        if (item.permission && !userPermissions[item.permission]) return false;
        return true;
      })
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterNavItems(item.children);
          return { ...item, children: filteredChildren };
        }
        return item;
      })
      .filter((item) => !item.children || item.children.length > 0);
  };

  const navItems = filterNavItems(rawNavItems);

  return (
    <div className="relative isolate h-screen overflow-hidden bg-shell-gradient font-sans transition-colors duration-350">
      <div className="relative z-10 flex h-full flex-col">
        <Navbar
          activeRole={resolvedActiveRole}
          onRoleChange={setActiveRole}
          theme={theme}
          onThemeToggle={() =>
            setTheme((currentTheme) =>
              currentTheme === 'theme-blue'
                ? 'theme-green'
                : currentTheme === 'theme-green'
                  ? 'theme-darkblue'
                  : 'theme-blue'
            )
          }
        />

        <div className="relative flex flex-1 overflow-hidden">
          <Sidebar open={false} onClose={() => {}} navItems={navItems} />

          <main className="scrollbar-none flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>

      {visibleFlash && (
        <Toast
          message={visibleFlash.message}
          type={visibleFlash.type}
          onClose={() => setDismissedFlashKey(flashKey)}
        />
      )}
    </div>
  );
}
