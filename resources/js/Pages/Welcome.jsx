import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '../Hooks/useTranslation';

export default function Welcome({ canLogin, canRegister }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="w-full border-b border-white/5 bg-slate-950/20 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-xl text-white">S</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
                            Servica
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-sm transition duration-150 ease-in-out"
                            >
                                {t('Dashboard')}
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link
                                        href="/login"
                                        className="text-sm font-semibold text-slate-300 hover:text-white transition duration-150 ease-in-out"
                                    >
                                        {t('Login')}
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white transition duration-150 ease-in-out shadow-md shadow-indigo-600/10"
                                    >
                                        {t('Register')}
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center gap-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                    ✨ {t('Your Daily Services Hub')}
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
                    {t('Connect with Top')}{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                        {t('Local Professionals')}
                    </span>{' '}
                    {t('Instantly')}
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                    {t('From home maintenance and repairs to cleaning and expert service assistance. Book reliable local providers and manage assignments effortlessly.')}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
                    {auth.user ? (
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-base transition duration-150 ease-in-out shadow-lg shadow-indigo-600/20"
                        >
                            {t('Go to Dashboard')}
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-base transition duration-150 ease-in-out shadow-lg shadow-indigo-600/20"
                            >
                                {t('Get Started')}
                            </Link>
                            <Link
                                href="/login"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-slate-300 hover:text-white text-base transition duration-150 ease-in-out"
                            >
                                {t('Sign In')}
                            </Link>
                        </>
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24 max-w-5xl">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition duration-300 flex flex-col gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            🛡️
                        </div>
                        <h3 className="text-xl font-bold">{t('Verified Providers')}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t('Every professional goes through background and identity checks to ensure absolute safety and work quality.')}
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition duration-300 flex flex-col gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            ⚡
                        </div>
                        <h3 className="text-xl font-bold">{t('Instant Quotations')}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t('Post a service job request and receive competitive quotes from multiple nearby service companies or individual experts.')}
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition duration-300 flex flex-col gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                            🔒
                        </div>
                        <h3 className="text-xl font-bold">{t('Secure Payments')}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t('Transactions are processed securely with platform fees and payouts handled directly, providing peace of mind.')}
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-white/5 py-8 text-center text-sm text-slate-500 bg-slate-950/40">
                &copy; {new Date().getFullYear()} Servica. {t('All rights reserved.')}
            </footer>
        </div>
    );
}
