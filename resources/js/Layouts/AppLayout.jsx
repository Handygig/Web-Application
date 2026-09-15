import React, { useState, useEffect, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { getNavByRole } from '../config/navConfig';
import Toast from '../Components/Other/Toast';
import { useTranslation } from '../Hooks/useTranslation';

export default function AppLayout({ children }) {
  const { auth, flash } = usePage().props;
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRoles = auth?.user?.roles?.map((r) => r.name) ?? [];
  const role = userRoles.includes('admin') ? 'admin' : 'company';

  const [theme, setTheme] = useState(
    () => localStorage.getItem('handygig-theme') || 'theme-earthy'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-earthy', 'theme-green', 'theme-darkblue');
    root.classList.add(theme);
    localStorage.setItem('handygig-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeToggle = () => {
      setTheme((current) => {
        if (current === 'theme-earthy') return 'theme-green';
        if (current === 'theme-green') return 'theme-darkblue';
        return 'theme-earthy';
      });
    };
    const handleThemeSet = (e) => {
      if (e.detail) setTheme(e.detail);
    };
    window.addEventListener('handygig-toggle-theme', handleThemeToggle);
    window.addEventListener('handygig-set-theme', handleThemeSet);
    return () => {
      window.removeEventListener('handygig-toggle-theme', handleThemeToggle);
      window.removeEventListener('handygig-set-theme', handleThemeSet);
    };
  }, []);

  const [dismissedFlashKey, setDismissedFlashKey] = useState(null);
  const flashMessage = flash?.success || flash?.error;
  const flashKey = flashMessage ?? null;

  const visibleFlash = useMemo(() => {
    if (!flashMessage || flashKey === dismissedFlashKey) return null;
    return { message: flashMessage, type: flash?.success ? 'success' : 'error' };
  }, [flashMessage, flashKey, dismissedFlashKey, flash?.success]);

  useEffect(() => {
    if (!visibleFlash) return;
    const timeout = window.setTimeout(() => setDismissedFlashKey(flashKey), 4500);
    return () => window.clearTimeout(timeout);
  }, [visibleFlash, flashKey]);

  const userPermissions = auth?.user?.permissions ?? {};
  const rawNavCategories = getNavByRole(t)[role] ?? [];

  const filterNavItems = (items) =>
    items
      .filter((item) => !item.permission || userPermissions[item.permission])
      .map((item) => (item.children ? { ...item, children: filterNavItems(item.children) } : item))
      .filter((item) => !item.children || item.children.length > 0);

  const navCategories = rawNavCategories
    .map((group) => ({
      category: group.category,
      items: filterNavItems(group.items || []),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="relative isolate h-screen overflow-hidden bg-shell-gradient font-sans transition-colors duration-350">
      <div className="relative z-10 flex h-full flex-col">
        <Navbar
          onMenuToggle={() => setMobileOpen(true)}
          theme={theme}
          onThemeToggle={() =>
            setTheme((current) =>
              current === 'theme-earthy'
                ? 'theme-green'
                : current === 'theme-green'
                  ? 'theme-darkblue'
                  : 'theme-earthy'
            )
          }
        />

        <div className="relative flex flex-1 overflow-hidden">
          <Sidebar
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            navCategories={navCategories}
          />
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
