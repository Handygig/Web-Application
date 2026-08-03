import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Navbar() {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Search Capsule */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder={t('Search task')}
                        className="block w-full pl-10 pr-16 py-2 border-0 bg-gray-50 text-sm text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0e5a3c]/20 focus:border-[#0e5a3c]/30 placeholder-gray-400 transition-colors"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <kbd className="inline-flex items-center border border-gray-200 rounded px-1.5 text-xs font-sans font-medium text-gray-400 bg-white shadow-xs">
                            ⌘F
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Right section: Notifications & Profile */}
            <div className="flex items-center gap-6">
                {/* Utilities */}
                <div className="flex items-center gap-3">
                    {/* Mail Icon */}
                    <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors relative">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#0e5a3c] rounded-full ring-2 ring-white"></span>
                    </button>

                    {/* Bell Icon */}
                    <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors relative">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#0e5a3c] rounded-full ring-2 ring-white"></span>
                    </button>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 leading-tight">
                            {user.name || user.full_name || 'User'}
                        </div>
                        <div className="text-xs text-gray-400 leading-tight mt-0.5">
                            {user.email}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0e5a3c]/10 border border-[#0e5a3c]/20 flex items-center justify-center text-[#0e5a3c] font-bold text-sm overflow-hidden">
                        {/* Fallback to user initials if no avatar */}
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
