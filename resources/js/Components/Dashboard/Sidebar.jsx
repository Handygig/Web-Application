import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Sidebar() {
    const { t } = useTranslation();
    const currentRoute = route().current();

    const menuItems = [
        {
            name: t('Dashboard'),
            route: 'dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
            )
        },
        {
            name: t('Tasks'),
            route: 'tasks.index', // Fallback or route placeholder
            badge: 12,
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            )
        },
        {
            name: t('Calendar'),
            route: 'calendar',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: t('Analytics'),
            route: 'analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            name: t('Team'),
            route: 'team',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    const generalItems = [
        {
            name: t('Settings'),
            route: 'profile.edit',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            name: t('Help'),
            route: 'help',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    const isLinkActive = (itemRoute) => {
        if (itemRoute === 'dashboard') {
            return currentRoute === 'dashboard';
        }
        return currentRoute && currentRoute.startsWith(itemRoute);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-gray-100">
                <Link href={route('dashboard')} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0e5a3c]/10 flex items-center justify-center text-[#0e5a3c]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Donezo</span>
                </Link>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
                {/* Menu items */}
                <div>
                    <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                        {t('Menu')}
                    </span>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const active = isLinkActive(item.route);
                            const hasRoute = route().has(item.route);
                            const href = hasRoute ? route(item.route) : '#';

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-[#0e5a3c]/10 text-[#0e5a3c]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={active ? 'text-[#0e5a3c]' : 'text-gray-400'}>
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            active
                                                ? 'bg-[#0e5a3c] text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* General items */}
                <div>
                    <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                        {t('General')}
                    </span>
                    <nav className="space-y-1">
                        {generalItems.map((item) => {
                            const active = isLinkActive(item.route);
                            const hasRoute = route().has(item.route);
                            const href = hasRoute ? route(item.route) : '#';

                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-[#0e5a3c]/10 text-[#0e5a3c]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className={active ? 'text-[#0e5a3c]' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}

                        {/* Logout Link */}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <span className="text-red-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </span>
                            <span>{t('Logout')}</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Mobile App Card */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gradient-to-br from-[#0e5a3c] to-[#0b4830] text-white rounded-2xl p-4 relative overflow-hidden shadow-md">
                    {/* Abstract overlay */}
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 translate-y-4"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-semibold mb-1">{t('Download our Mobile App')}</h4>
                        <p className="text-xs text-emerald-100/80 mb-3">{t('Get easy access on the go')}</p>
                        <button className="bg-white text-[#0e5a3c] hover:bg-emerald-50 transition-colors text-xs font-semibold px-4 py-2 rounded-xl w-full">
                            {t('Download')}
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
