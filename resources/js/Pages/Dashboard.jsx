import React from 'react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Dashboard() {
    const { t } = useTranslation();

    // Mock data matching the design image
    const stats = [
        {
            title: t('Total Projects'),
            value: 24,
            badge: t('Increased from last month'),
            badgeValue: '5',
            primary: true,
        },
        {
            title: t('Ended Projects'),
            value: 10,
            badge: t('Increased from last month'),
            badgeValue: '6',
            primary: false,
        },
        {
            title: t('Running Projects'),
            value: 12,
            badge: t('Increased from last month'),
            badgeValue: '2',
            primary: false,
        },
        {
            title: t('Pending Project'),
            value: 2,
            badge: t('On Discuss'),
            badgeValue: null,
            primary: false,
        }
    ];

    const teamMembers = [
        {
            name: 'Alexandra Deff',
            task: 'Working on Github Project Repository',
            status: 'Completed',
            statusColor: 'bg-emerald-50 text-emerald-700',
            initials: 'AD',
        },
        {
            name: 'Edwin Adenike',
            task: 'Working on Integrate User Authentication System',
            status: 'In Progress',
            statusColor: 'bg-amber-50 text-amber-700',
            initials: 'EA',
        },
        {
            name: 'Isaac Oluwatemilorun',
            task: 'Working on Develop Search and Filter Functionality',
            status: 'Pending',
            statusColor: 'bg-rose-50 text-rose-700',
            initials: 'IO',
        },
        {
            name: 'David Oshodi',
            task: 'Working on Responsive Layout for Homepage',
            status: 'In Progress',
            statusColor: 'bg-amber-50 text-amber-700',
            initials: 'DO',
        }
    ];

    const projectsList = [
        { name: 'Develop API Endpoints', date: 'Nov 26, 2024', color: 'bg-indigo-500' },
        { name: 'Onboarding Flow', date: 'Nov 28, 2024', color: 'bg-teal-500' },
        { name: 'Build Dashboard', date: 'Nov 30, 2024', color: 'bg-amber-500' },
        { name: 'Optimize Page Load', date: 'Dec 5, 2024', color: 'bg-orange-500' },
        { name: 'Cross-Browser Testing', date: 'Dec 6, 2024', color: 'bg-purple-500' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t('Dashboard')} />

            {/* Welcome / Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('Dashboard')}</h1>
                    <p className="text-sm text-gray-500 mt-1">{t('Plan, prioritize, and accomplish your tasks with ease.')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#0e5a3c] hover:bg-[#0b4830] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('Add Project')}
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-2xs">
                        {t('Import Data')}
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`rounded-2xl p-6 shadow-2xs relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-xs ${
                            stat.primary
                                ? 'bg-[#0e5a3c] text-white'
                                : 'bg-white text-gray-900 border border-gray-100'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-sm font-medium ${stat.primary ? 'text-emerald-100/90' : 'text-gray-400'}`}>
                                {stat.title}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                stat.primary ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-500 border border-gray-100'
                            }`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-4xl font-extrabold tracking-tight mb-4">
                            {stat.value}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                            {stat.badgeValue && (
                                <span className={`font-bold px-1.5 py-0.5 rounded-md ${
                                    stat.primary ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                    {stat.badgeValue}
                                </span>
                            )}
                            <span className={stat.primary ? 'text-emerald-100/80' : 'text-gray-400'}>
                                {stat.badge}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Columns - Analytics, Team, Progress */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Project Analytics Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{t('Project Analytics')}</h3>
                            <select className="text-xs bg-gray-50 border-0 rounded-lg px-3 py-1.5 text-gray-500 focus:ring-[#0e5a3c]/20">
                                <option>{t('Weekly')}</option>
                                <option>{t('Monthly')}</option>
                            </select>
                        </div>
                        {/* Dummy bar chart using CSS grid layout */}
                        <div className="h-64 flex items-end justify-between px-4 pb-2 pt-6 border-b border-gray-100 relative">
                            {/* Guideline */}
                            <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-gray-100"></div>
                            <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-gray-100"></div>
                            <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-gray-100"></div>

                            {[
                                { day: 'S', val: 'h-[30%]', active: false },
                                { day: 'M', val: 'h-[65%]', active: true },
                                { day: 'T', val: 'h-[50%]', active: false, badge: '74%' },
                                { day: 'W', val: 'h-[85%]', active: true },
                                { day: 'T', val: 'h-[40%]', active: false },
                                { day: 'F', val: 'h-[55%]', active: false },
                                { day: 'S', val: 'h-[60%]', active: false }
                            ].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-10 relative z-10">
                                    {bar.badge && (
                                        <span className="absolute bottom-[55%] bg-[#0e5a3c] text-white text-[10px] font-semibold px-1 rounded-sm shadow-xs mb-1">
                                            {bar.badge}
                                        </span>
                                    )}
                                    <div className={`w-8 rounded-t-xl transition-all duration-300 ${bar.val} ${
                                        bar.active ? 'bg-[#0e5a3c]' : 'bg-gray-100 hover:bg-gray-200'
                                    }`} />
                                    <span className="text-xs font-semibold text-gray-400">{bar.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lower Row: Team & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Team Collaboration */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">{t('Team Collaboration')}</h3>
                                <button className="text-xs text-[#0e5a3c] hover:underline font-semibold flex items-center gap-1">
                                    <span>+ {t('Add Member')}</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {teamMembers.map((member, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0e5a3c]/10 text-[#0e5a3c] font-bold text-xs flex items-center justify-center">
                                                {member.initials}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900">{member.name}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-1">{member.task}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.statusColor}`}>
                                            {member.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Progress */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs flex flex-col justify-between">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('Project Progress')}</h3>
                            {/* Semi-circular gauge */}
                            <div className="relative flex flex-col items-center justify-center py-6">
                                <div className="w-40 h-20 overflow-hidden relative flex items-end justify-center">
                                    <div className="absolute inset-0 rounded-t-full border-12 border-gray-100" />
                                    <div className="absolute inset-0 rounded-t-full border-12 border-[#0e5a3c] border-b-0 origin-bottom rotate-[45deg]" />
                                    <span className="text-3xl font-extrabold text-gray-900 relative z-10">41%</span>
                                </div>
                                <span className="text-xs text-gray-400 mt-2 font-medium">{t('Project Ended')}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 pt-4 border-t border-gray-50">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t('Completed')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#0e5a3c]" /> {t('In Progress')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" /> {t('Pending')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Reminders, Tasks List, Time Tracker */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Reminders Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('Reminders')}</h3>
                        <div className="mb-6">
                            <h4 className="text-base font-bold text-gray-800 leading-snug">{t('Meeting with Arc Company')}</h4>
                            <p className="text-xs text-gray-400 mt-1">{t('Time : 02.00 pm - 04.00 pm')}</p>
                        </div>
                        <button className="w-full bg-[#0e5a3c] hover:bg-[#0b4830] text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {t('Start Meeting')}
                        </button>
                    </div>

                    {/* Active Projects List */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{t('Project')}</h3>
                            <button className="text-xs text-[#0e5a3c] hover:underline font-semibold">+ {t('New')}</button>
                        </div>
                        <div className="space-y-4">
                            {projectsList.map((project, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${project.color}`} />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-800 leading-tight">{project.name}</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{t('Due date')}: {project.date}</p>
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Tracker Card */}
                    <div className="bg-gradient-to-br from-[#0e5a3c] to-[#0b4830] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                        {/* Visual abstract overlay waves */}
                        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                            <svg className="w-48 h-48" viewBox="0 0 200 200" fill="currentColor">
                                <path d="M 0,100 C 50,50 50,150 100,100 C 150,50 150,150 200,100 L 200,200 L 0,200 Z" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-xs uppercase tracking-widest text-emerald-200/90 font-bold mb-3">
                                {t('Time Tracker')}
                            </span>
                            <div className="text-4xl font-mono font-extrabold tracking-widest mb-6">
                                01:24:08
                            </div>
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-full bg-white text-[#0e5a3c] hover:bg-emerald-50 transition-colors flex items-center justify-center shadow-xs">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center shadow-xs">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
