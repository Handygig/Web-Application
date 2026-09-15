import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../Hooks/useTranslation';

export default function LandingNavbar({ auth, canLogin = true, canRegister = true, activePage = 'home' }) {
  const { t } = useTranslation();

  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/images/handygig-logo.png" alt="Handygig" className="h-7 sm:h-8 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-base font-semibold text-slate-700 hover:text-theme-accent transition">
            {t('Home')}
          </Link>
          <a href="/#categories" className="text-base font-semibold text-slate-700 hover:text-theme-accent transition">
            {t('Services')}
          </a>
          <a href="/#why-us" className="text-base font-semibold text-slate-700 hover:text-theme-accent transition">
            {t('About')}
          </a>
          <a href="/#why-us" className="text-base font-semibold text-slate-700 hover:text-theme-accent transition">
            {t('Contact Us')}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {auth?.user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-base font-semibold transition shadow-sm"
            >
              {t('Dashboard')}
            </Link>
          ) : (
            <>
              {activePage === 'login' && canRegister && (
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-base font-semibold transition shadow-sm"
                >
                  {t('Register')}
                </Link>
              )}

              {activePage === 'register' && canLogin && (
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-base font-semibold transition shadow-sm"
                >
                  {t('Sign In')}
                </Link>
              )}

              {activePage === 'home' && (
                <>
                  {canLogin && (
                    <Link
                      href="/login"
                      className="px-4 py-2 text-base font-semibold text-slate-700 hover:text-theme-accent transition"
                    >
                      {t('Sign In')}
                    </Link>
                  )}
                  {canRegister && (
                    <Link
                      href="/register"
                      className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-base font-semibold transition shadow-sm"
                    >
                      {t('Register')}
                    </Link>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
