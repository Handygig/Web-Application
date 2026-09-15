import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../Hooks/useTranslation';

export default function LandingNavbar({ auth, canLogin = true, canRegister = true, activePage = 'home' }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between sticky top-0 z-50">
      {/* Original Handygig Logo */}
      <Link href="/" className="flex items-center">
        <img src="/images/handygig-logo.png" alt="Handygig" className="h-8 sm:h-10 w-auto object-contain" />
      </Link>


      {/* Central Nav Container with White Rounded Card Surround */}
      <nav className="hidden md:flex h-12 items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
        <Link
          href="/"
          className="px-4 h-10 flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 transition"
        >
          {t('Home')}
        </Link>
        <a
          href="/#categories"
          className="px-4 h-10 flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          {t('Services')}
        </a>
        <a
          href="/#why-us"
          className="px-4 h-10 flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          {t('About')}
        </a>
        <a
          href="/#why-us"
          className="px-4 h-10 flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          {t('Contact Us')}
        </a>
      </nav>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-5">
        {auth?.user ? (
          <Link
            href="/dashboard"
            className="px-6 h-12 flex items-center justify-center rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            {t('Dashboard')}
          </Link>
        ) : (
          <>
            {activePage === 'login' && canRegister && (
              <Link
                href="/register"
                className="px-6 h-12 flex items-center justify-center rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                {t('Sign Up')}
              </Link>
            )}

            {activePage === 'register' && canLogin && (
              <Link
                href="/login"
                className="px-6 h-12 flex items-center justify-center rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                {t('Login')}
              </Link>
            )}

            {activePage === 'home' && (
              <>
                {canLogin && (
                  <Link
                    href="/login"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-theme-accent transition"
                  >
                    {t('Login')}
                  </Link>
                )}
                {canRegister && (
                  <Link
                    href="/register"
                    className="px-6 h-12 flex items-center justify-center rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
                  >
                    {t('Sign Up')}
                  </Link>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
