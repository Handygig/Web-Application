import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  ArrowUpRight,
  Star,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Users,
  Plus,
  Download,
  ChevronDown,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Activity,
  Layers,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Dashboard({
  stats,
  pendingKycQueue: serverKyc,
  recentReviews: serverReviews,
}) {
  const { t } = useTranslation();

  // Financial & platform stats from backend
  const grossRevenue = stats?.grossRevenue ?? 48250.0;
  const totalCustomers = stats?.totalCustomers ?? 184;
  const pendingPayoutsAmount = stats?.pendingPayoutsAmount ?? 3410.0;
  const pendingPayoutsCount = stats?.pendingPayoutsCount ?? 5;
  const totalProviders = stats?.totalProviders ?? 24;
  const activeBookings = stats?.activeBookings ?? 12;
  const openDisputes = stats?.openDisputes ?? 0;

  const totalBookings = stats?.totalBookings ?? 238;
  const completedPercent = stats?.completedPercent ?? 65;
  const inProgressPercent = stats?.inProgressPercent ?? 25;
  const pendingPercent = stats?.pendingPercent ?? 10;
  const avgRating = stats?.avgRating ?? 4.9;

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  // Fallback sample data if database table is currently empty
  const fallbackKycQueue = [
    {
      id: 1,
      provider: 'Electrical Services Ltd.',
      type: 'Business License & Trade Certificate',
      date: 'Submitted 15 min ago',
    },
    {
      id: 2,
      provider: 'Apex Plumbing Co.',
      type: 'Liability Insurance Policy',
      date: 'Submitted 2 hours ago',
    },
    {
      id: 3,
      provider: 'QuickFix HVAC Systems',
      type: 'Master Technician Identity Document',
      date: 'Submitted 5 hours ago',
    },
  ];

  const fallbackReviews = [
    {
      id: 1,
      name: 'Alexandra Deff',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      service: 'Electrical Service',
      comment: 'Excellent service! Arrived on time and resolved the wiring issue very quickly.',
      date: '2 hours ago',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      service: 'Plumbing Repair',
      comment: 'Very professional technician. Replaced pipe fittings and tested thoroughly.',
      date: '5 hours ago',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 4,
      service: 'HVAC Maintenance',
      comment: 'Great work on the AC unit maintenance. Very knowledgeable service provider.',
      date: '1 day ago',
    },
    {
      id: 4,
      name: 'David Oshodi',
      avatar:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      service: 'Home Cleaning',
      comment: 'Thorough cleaning job for the entire apartment. Highly satisfied!',
      date: '2 days ago',
    },
  ];

  const pendingKycQueue = serverKyc && serverKyc.length > 0 ? serverKyc : fallbackKycQueue;
  const recentReviews = serverReviews && serverReviews.length > 0 ? serverReviews : fallbackReviews;

  return (
    <AppLayout>
      <Head title={t('Dashboard')} />

      <div className="mx-auto max-w-[1400px] space-y-6 pb-12 font-sans">
        {/* TOP HEADER SECTION */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('Admin Dashboard')}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            {t(
              'Manage platform bookings, provider KYC verifications, service payouts, and system activity.'
            )}
          </p>
        </div>

        {/* STAT CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Platform Revenue */}
          <div className="bg-[#0f4a2d] text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-100/90">
                {t('Total Platform Revenue')}
              </span>
              <Link
                href={route('admin.bookings.index')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight">
                {formattedCurrency(grossRevenue)}
              </div>
              <p className="text-[11px] font-medium text-emerald-300 mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]" />
                {t('Increased from last month')}
              </p>
            </div>
          </div>

          {/* Card 2: Active Job Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {t('Active Job Bookings')}
              </span>
              <Link
                href={route('admin.bookings.index')}
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {activeBookings}
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {t('Dispatched & In Progress')}
              </p>
            </div>
          </div>

          {/* Card 3: Registered Customers */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Total Customers')}</span>
              <Link
                href={route('admin.customers.index')}
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {totalCustomers}
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                {t('Verified Client Accounts')}
              </p>
            </div>
          </div>

          {/* Card 4: Verified Providers */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {t('Verified Providers')}
              </span>
              <Link
                href={route('admin.providers.index')}
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {totalProviders}
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {t('Companies & Technicians')}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (8 cols): Revenue Overview + Pending KYC Queue + Recent Reviews */}
          <div className="lg:col-span-8 space-y-6">
            {/* Revenue Overview Chart Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
              {/* Header Title & Month Filter Dropdown */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('Revenue Overview')}</h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {t('Monthly platform earnings & booking growth performance')}
                  </p>
                </div>

                <div className="relative inline-block">
                  <select
                    className="appearance-none text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-full pl-4 pr-8 py-1.5 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 cursor-pointer shadow-2xs transition-all hover:bg-slate-50/80"
                    defaultValue="This Month"
                  >
                    <option value="This Month">{t('This Month')}</option>
                    <option value="Last Month">{t('Last Month')}</option>
                    <option value="This Year">{t('This Year')}</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Legend Header */}
              <div className="flex items-center gap-6 text-xs font-semibold text-slate-600 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0f4a2d]" />
                  <span>{t('This Month')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-300" />
                  <span className="text-slate-400">{t('Last Month')}</span>
                </div>
              </div>

              {/* Graph Body Container */}
              <div className="relative pt-2 pb-2">
                <div className="flex gap-3">
                  {/* Y-Axis Metrics */}
                  <div className="flex flex-col justify-between text-[11px] font-semibold text-slate-400 h-44 py-1 shrink-0 select-none">
                    <span>$30K</span>
                    <span>$20K</span>
                    <span>$10K</span>
                    <span>$0</span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="relative w-full h-44 overflow-visible">
                    <svg
                      className="w-full h-full overflow-visible"
                      viewBox="0 0 500 160"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="10"
                        x2="500"
                        y2="10"
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="55"
                        x2="500"
                        y2="55"
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="100"
                        x2="500"
                        y2="100"
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <line x1="0" y1="145" x2="500" y2="145" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* Faint Dashed Line (Last Month) */}
                      <path
                        d="M 10 135 C 50 120, 80 125, 110 130 C 140 135, 170 100, 200 115 C 230 130, 260 105, 290 125 C 320 145, 350 95, 380 110 C 410 125, 440 60, 470 100 C 485 120, 495 90, 500 95"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                      />

                      {/* Solid Dark Line (This Month - Deep Forest Green) */}
                      <path
                        d="M 10 130 C 35 110, 50 85, 70 85 C 90 85, 105 60, 130 75 C 155 90, 175 75, 195 55 C 215 75, 235 45, 260 30 C 285 55, 305 75, 330 70 C 355 60, 370 30, 390 20 C 415 50, 435 75, 455 70 C 475 40, 490 25, 500 15"
                        fill="none"
                        stroke="#0f4a2d"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Vertical Indicator Line on Peak Date */}
                      <line
                        x1="390"
                        y1="20"
                        x2="390"
                        y2="145"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />

                      {/* Active Dot Node */}
                      <circle
                        cx="390"
                        cy="20"
                        r="5"
                        fill="#0f4a2d"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="shadow-lg"
                      />
                    </svg>

                    {/* Floating Tooltip Box */}
                    <div className="absolute top-[-24px] left-[70%] -translate-x-1/2 bg-[#0f4a2d] text-white rounded-xl py-1.5 px-3 shadow-2xl z-20 text-center select-none animate-in fade-in zoom-in duration-200">
                      <span className="block text-xs font-black tracking-tight">$24,560</span>
                      <span className="block text-[9px] font-medium text-emerald-200">21 Apr</span>
                    </div>
                  </div>
                </div>

                {/* X-Axis Date Labels */}
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-3 pl-10 select-none border-t border-slate-100">
                  <span>1 Apr</span>
                  <span>6 Apr</span>
                  <span>11 Apr</span>
                  <span>16 Apr</span>
                  <span className="text-[#0f4a2d] font-extrabold">21 Apr</span>
                  <span>26 Apr</span>
                  <span>30 Apr</span>
                </div>
              </div>
            </div>

            {/* Pending KYC Submissions Review Queue Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('Pending KYC Verification Queue')}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {t('Provider identity documents awaiting admin approval')}
                  </p>
                </div>
                <Link
                  href={route('admin.providers.kyc')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200/80 transition"
                >
                  <span>{t('View All Queue')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 pt-1">
                {pendingKycQueue.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <ShieldCheck className="w-5 h-5 text-[#0f4a2d]" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {item.provider}
                        </h5>
                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                          {item.type}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{item.date}</span>
                      </div>
                    </div>

                    <Link
                      href={route('admin.providers.kyc')}
                      className="px-3 py-1.5 bg-[#0f4a2d] hover:bg-[#0c3e25] text-white font-semibold text-xs rounded-xl transition shadow-2xs shrink-0"
                    >
                      {t('Review File')}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Customer Reviews Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('Recent Customer Reviews')}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {t('Latest feedback & ratings from completed service bookings')}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4 pt-1 divide-y divide-slate-100">
                {recentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-bold text-slate-900">{rev.name}</h5>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                            {rev.service}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">{rev.comment}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (4 cols): Booking Status Gauge + Dispatch Summary + Admin Links */}
          <div className="lg:col-span-4 space-y-6">
            {/* Booking Status Distribution Donut Gauge Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{t('Booking Distribution')}</h3>

              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#0f4a2d"
                      strokeWidth="12"
                      strokeDasharray="238"
                      strokeDashoffset="70"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray="238"
                      strokeDashoffset="180"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-3xl font-extrabold text-slate-900">{totalBookings}</div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {t('Bookings')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold text-slate-600 mt-4 w-full text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-slate-400">{t('Completed')}</span>
                    <span className="text-xs font-bold text-slate-900">{completedPercent}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="block text-emerald-700">{t('In Progress')}</span>
                    <span className="text-xs font-bold text-emerald-800">{inProgressPercent}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-slate-400">{t('Pending')}</span>
                    <span className="text-xs font-bold text-slate-900">{pendingPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Technician Dispatch Metrics Card */}
            <div className="bg-[#0f4a2d] text-white p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-100/90">
                  {t('Live Field Dispatch')}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-medium text-emerald-100/80">
                    {t('Technicians On Shift')}
                  </span>
                  <span className="text-sm font-extrabold font-mono">{totalProviders} Active</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-medium text-emerald-100/80">
                    {t('Pending Payout Clearance')}
                  </span>
                  <span className="text-sm font-extrabold font-mono">
                    ${pendingPayoutsAmount.toLocaleString()} ({pendingPayoutsCount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-100/80">
                    {t('Disputed Requests')}
                  </span>
                  <span className="text-sm font-extrabold font-mono text-amber-300">
                    {openDisputes} Open
                  </span>
                </div>
              </div>

              <Link
                href={route('admin.bookings.index')}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition"
              >
                <span>{t('Manage All Bookings')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Admin Actions Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 mb-2">{t('Admin Shortcuts')}</h3>

              <Link
                href={route('admin.service-categories.index')}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#0f4a2d] group-hover:text-white transition">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{t('Service Categories')}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
