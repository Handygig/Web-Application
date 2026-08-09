import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '../Components/common/Navbar';
import Sidebar from '../Components/common/Sidebar';
import { getNavByRole } from '../config/navConfig';
import GridScan from '../Components/common/GridScan';
import Toast from '../Components/ui/Toast';
import { useTranslation } from '../Hooks/useTranslation';

function roleFromPath(pathname) {
  if (pathname?.startsWith('/super-admin')) return 'super-admin';
  if (pathname?.startsWith('/admin')) return 'admin';
  if (pathname?.startsWith('/ehs')) return 'ehs';
  if (pathname?.startsWith('/user')) return 'user';
  return null;
}

export default function AppLayout({ children }) {
  const { auth, flash } = usePage().props;
  const { t } = useTranslation();

  // Resolve the user's primary role
  const userRoles = auth?.user?.roles?.map((r) => r.name) ?? [];
  const primaryRole = userRoles.includes('super-admin')
    ? 'super-admin'
    : userRoles.includes('admin')
      ? 'admin'
      : userRoles.includes('ehs')
        ? 'ehs'
        : userRoles.includes('external')
          ? 'external'
          : 'user';

  const availableRoles = userRoles.includes('super-admin')
    ? ['user', 'ehs', 'admin', 'super-admin']
    : userRoles.includes('admin')
      ? ['user', 'ehs', 'admin']
      : userRoles.includes('ehs')
        ? ['user', 'ehs']
        : userRoles.includes('external')
          ? ['external']
          : ['user'];

  const [activeRole, setActiveRole] = useState(() => {
    const pathRole = roleFromPath(window.location.pathname);
    const storedRole = localStorage.getItem('safora-active-role');

    if (availableRoles.includes(pathRole)) return pathRole;
    return availableRoles.includes(storedRole) ? storedRole : primaryRole;
  });
  const [visibleFlash, setVisibleFlash] = useState(null);

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
      setTheme((t) => {
        if (t === 'theme-blue') return 'theme-green';
        if (t === 'theme-green') return 'theme-darkblue';
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

  useEffect(() => {
    const pathRole = roleFromPath(window.location.pathname);
    if (availableRoles.includes(pathRole) && activeRole !== pathRole) {
      setActiveRole(pathRole);
      localStorage.setItem('safora-active-role', pathRole);
      return;
    }

    if (!availableRoles.includes(activeRole)) {
      setActiveRole(primaryRole);
      return;
    }

    localStorage.setItem('safora-active-role', activeRole);
  }, [activeRole, availableRoles, primaryRole]);

  useEffect(() => {
    const message = flash?.success || flash?.error;

    if (!message) {
      setVisibleFlash(null);
      return;
    }

    setVisibleFlash({
      message,
      type: flash?.success ? 'success' : 'error',
    });

    const timeout = window.setTimeout(() => setVisibleFlash(null), 4500);

    return () => window.clearTimeout(timeout);
  }, [flash]);

  // Resolve nav items for the active role
  const NAV_BY_ROLE = getNavByRole(t);
  const rawNavItems = userRoles.includes('external')
    ? NAV_BY_ROLE.external
    : (NAV_BY_ROLE[activeRole] ?? NAV_BY_ROLE.user);
  const isHod = Number(auth?.user?.is_hod) === 1;
  const userPermissions = auth?.user?.permissions ?? {};

  const filterNavItems = (items) => {
    return items
      .filter((item) => {
        if (item.hodOnly && !isHod) return false;
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
      <GridScan
        sensitivity={0.55}
        lineThickness={1.8}
        linesColor="#ffffff"
        gridScale={0.1}
        scanColor="#0090FF"
        scanOpacity={0.4}
        noiseIntensity={0.005}
        lineJitter={0.06}
        scanGlow={0.3}
        scanSoftness={1.7}
        scanDuration={2.0}
        scanDelay={2.0}
        enableScan={false}
      />

      <div className="relative z-10 flex h-full flex-col">
        <Navbar
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          theme={theme}
          onThemeToggle={() =>
            setTheme((t) =>
              t === 'theme-blue'
                ? 'theme-green'
                : t === 'theme-green'
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
          onClose={() => setVisibleFlash(null)}
        />
      )}
    </div>
  );
}
