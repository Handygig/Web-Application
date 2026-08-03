import React, { useState } from 'react';
import Sidebar from '@/Components/Dashboard/Sidebar';
import Navbar from '@/Components/Dashboard/Navbar';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar Desktop */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-xs md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Mobile Container */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden`}>
                <Sidebar />
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Navbar */}
                <div className="relative">
                    {/* Hamburger Button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden z-30 w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Navbar />
                </div>

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
