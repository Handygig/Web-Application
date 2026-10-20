import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  ArrowUpRight,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import RevenueOverviewChart from '@/Components/Dashboard/RevenueOverviewChart';
import PendingKycQueue from '@/Components/Dashboard/PendingKycQueue';
import RecentReviews from '@/Components/Dashboard/RecentReviews';
import MonthlyBookingsChart from '@/Components/Dashboard/MonthlyBookingsChart';

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

  const [selectedProgressStatus, setSelectedProgressStatus] = useState(null);

  // Booking Progress semicircular arc gauge geometry
  const progressCx = 120;
  const progressCy = 115;
  const progressRadius = 75;
  const progressStroke = 36;
  const progressArcLength = Math.PI * progressRadius;
  const progressTotalPct = (completedPercent + inProgressPercent + pendingPercent) || 100;
  const progressCompFrac = completedPercent / progressTotalPct;
  const progressProgFrac = inProgressPercent / progressTotalPct;

  const progressCompLen = progressCompFrac * progressArcLength;
  const progressProgTotalLen = (progressCompFrac + progressProgFrac) * progressArcLength;

  const displayProgressPercent =
    selectedProgressStatus === 'in_progress'
      ? inProgressPercent
      : selectedProgressStatus === 'pending'
        ? pendingPercent
        : completedPercent;

  const displayProgressLabel =
    selectedProgressStatus === 'in_progress'
      ? t('In Progress')
      : selectedProgressStatus === 'pending'
        ? t('Pending')
        : t('Booking Ended');

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const totalProjects = stats?.totalProjects ?? totalBookings;

  const statCards = [
    {
      id: 'revenue',
      title: t('Total Revenue'),
      value: formattedCurrency(grossRevenue),
      badge: '12%',
      subtext: t('Increased from last month'),
      href: route('admin.bookings.index'),
    },
    {
      id: 'projects',
      title: t('Total Projects'),
      value: totalProjects,
      badge: '5',
      subtext: t('Increased from last month'),
      href: route('admin.bookings.index'),
    },
    {
      id: 'active_bookings',
      title: t('Active Bookings'),
      value: activeBookings,
      badge: '3',
      subtext: t('Increased from last month'),
      href: route('admin.bookings.index'),
    },
    {
      id: 'customers',
      title: t('Total Customers'),
      value: totalCustomers,
      badge: '8%',
      subtext: t('Increased from last month'),
      href: route('admin.customers.index'),
    },
    {
      id: 'providers',
      title: t('Verified Providers'),
      value: totalProviders,
      badge: '4',
      subtext: t('Increased from last month'),
      href: route('admin.providers.index'),
    },
  ];

  // Fallback sample data if database table is currently empty
  const fallbackKycQueue = [
    {
      id: 1,
      provider: 'Electrical Services Ltd.',
      type: 'Business License & Trade Certificate',
      date: '15 min ago',
    },
    {
      id: 2,
      provider: 'Apex Plumbing Co.',
      type: 'Liability Insurance Policy',
      date: '2 hours ago',
    },
    {
      id: 3,
      provider: 'QuickFix HVAC Systems',
      type: 'Master Technician Identity Document',
      date: '5 hours ago',
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
  ];

  const pendingKycQueue = serverKyc && serverKyc.length > 0 ? serverKyc : fallbackKycQueue;
  const recentReviews = serverReviews && serverReviews.length > 0 ? serverReviews : fallbackReviews;

  return (
    <AppLayout>
      <Head title={t('Dashboard')} />

      <div className="flex w-full flex-col gap-6">
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

        {/* STAT CARDS ROW (Card 1: Green, Cards 2-5: White Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {statCards.map((card, index) => {
            const isGreen = index === 0;

            return (
              <div
                key={card.id}
                className={`p-5 rounded-[22px] flex flex-col justify-between min-h-[148px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden group ${
                  isGreen
                    ? 'bg-gradient-to-b from-[#12442b] via-[#1a613f] to-[#22724b] text-white shadow-xs'
                    : 'bg-white border border-slate-100/90 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-base font-semibold tracking-tight truncate ${
                      isGreen ? 'text-white/95' : 'text-slate-900'
                    }`}
                  >
                    {card.title}
                  </span>
                  <Link
                    href={card.href}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xs shrink-0 ${
                      isGreen
                        ? 'bg-white text-slate-900'
                        : 'bg-white border border-slate-700 text-slate-900 hover:border-slate-900'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                  </Link>
                </div>

                <div className="my-2.5">
                  <div
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-none ${
                      isGreen ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {card.value}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold leading-none shrink-0 ${
                      isGreen
                        ? 'border border-white/20 bg-white/10 text-white'
                        : 'border border-slate-200 bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <span>{card.badge}</span>
                    <svg
                      className={`w-2 h-2 shrink-0 ${
                        isGreen ? 'fill-current' : 'fill-slate-600'
                      }`}
                      viewBox="0 0 10 10"
                    >
                      <polygon points="5,2 9,8 1,8" />
                    </svg>
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-normal leading-tight ${
                      isGreen ? 'text-emerald-100/90' : 'text-slate-400'
                    }`}
                  >
                    {card.subtext}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN TWO-COLUMN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (8 cols): Revenue Overview + Pending KYC Queue + Recent Reviews */}
          <div className="lg:col-span-8 space-y-6">
            {/* Revenue Overview Chart Card */}
            <RevenueOverviewChart />

            {/* Row: Pending KYC Queue + Recent Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PendingKycQueue items={pendingKycQueue} />
              <RecentReviews reviews={recentReviews} avgRating={avgRating} />
            </div>
          </div>

          {/* RIGHT COLUMN (4 cols): Project Analytics & Bookings + Booking Status Gauge + Dispatch Summary + Admin Links */}
          <div className="lg:col-span-4 space-y-6">
            {/* Monthly Bookings / Project Analytics Pill Chart Card */}
            <MonthlyBookingsChart />

            {/* Booking Progress Semicircular Arc Gauge Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {t('Booking Progress')}
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center py-1">
                <div className="relative w-full max-w-[260px] flex items-center justify-center">
                  <svg className="w-full h-auto overflow-visible" viewBox="0 0 240 150">
                    <defs>
                      <pattern
                        id="pendingStripes"
                        width="3.2"
                        height="3.2"
                        patternTransform="rotate(45 0 0)"
                        patternUnits="userSpaceOnUse"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="3.2"
                          stroke="#8a9990"
                          strokeWidth="1.3"
                          strokeLinecap="square"
                        />
                      </pattern>
                    </defs>

                    {/* Layer 1: Full Semicircle Striped Track (Pending) with round caps */}
                    <path
                      d={`M ${progressCx - progressRadius} ${progressCy} A ${progressRadius} ${progressRadius} 0 0 1 ${progressCx + progressRadius} ${progressCy}`}
                      fill="none"
                      stroke="url(#pendingStripes)"
                      strokeWidth={progressStroke}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedProgressStatus(
                          selectedProgressStatus === 'pending' ? null : 'pending'
                        )
                      }
                    />

                    {/* Layer 2: In Progress (Dark Green Arc) with round caps */}
                    <path
                      d={`M ${progressCx - progressRadius} ${progressCy} A ${progressRadius} ${progressRadius} 0 0 1 ${progressCx + progressRadius} ${progressCy}`}
                      fill="none"
                      stroke="#11462c"
                      strokeWidth={progressStroke}
                      strokeDasharray={`${progressProgTotalLen} ${progressArcLength}`}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedProgressStatus(
                          selectedProgressStatus === 'in_progress' ? null : 'in_progress'
                        )
                      }
                    />

                    {/* Layer 3: Completed (Light Green Arc) with round caps */}
                    <path
                      d={`M ${progressCx - progressRadius} ${progressCy} A ${progressRadius} ${progressRadius} 0 0 1 ${progressCx + progressRadius} ${progressCy}`}
                      fill="none"
                      stroke="#217e52"
                      strokeWidth={progressStroke}
                      strokeDasharray={`${progressCompLen} ${progressArcLength}`}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedProgressStatus(
                          selectedProgressStatus === 'completed' ? null : 'completed'
                        )
                      }
                    />

                    {/* Center Numbers & Label */}
                    <text
                      x={progressCx}
                      y={progressCy - 10}
                      textAnchor="middle"
                      className="font-extrabold fill-slate-900 select-none text-[34px]"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      {displayProgressPercent}%
                    </text>
                    <text
                      x={progressCx}
                      y={progressCy + 12}
                      textAnchor="middle"
                      className="font-medium fill-[#738075] select-none text-[12px]"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      {displayProgressLabel}
                    </text>
                  </svg>
                </div>

                {/* Bottom Legend */}
                <div className="flex items-center justify-center gap-6 pt-3 w-full select-none">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProgressStatus(
                        selectedProgressStatus === 'completed' ? null : 'completed'
                      )
                    }
                    className={`flex items-center gap-2 transition-all cursor-pointer ${
                      selectedProgressStatus === 'completed'
                        ? 'font-bold opacity-100 scale-105'
                        : selectedProgressStatus
                          ? 'opacity-40 hover:opacity-80'
                          : 'opacity-100 hover:opacity-80'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#217e52] shrink-0" />
                    <span className="text-xs font-medium text-slate-600">{t('Completed')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProgressStatus(
                        selectedProgressStatus === 'in_progress' ? null : 'in_progress'
                      )
                    }
                    className={`flex items-center gap-2 transition-all cursor-pointer ${
                      selectedProgressStatus === 'in_progress'
                        ? 'font-bold opacity-100 scale-105'
                        : selectedProgressStatus
                          ? 'opacity-40 hover:opacity-80'
                          : 'opacity-100 hover:opacity-80'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#11462c] shrink-0" />
                    <span className="text-xs font-medium text-slate-600">{t('In Progress')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProgressStatus(
                        selectedProgressStatus === 'pending' ? null : 'pending'
                      )
                    }
                    className={`flex items-center gap-2 transition-all cursor-pointer ${
                      selectedProgressStatus === 'pending'
                        ? 'font-bold opacity-100 scale-105'
                        : selectedProgressStatus
                          ? 'opacity-40 hover:opacity-80'
                          : 'opacity-100 hover:opacity-80'
                    }`}
                  >
                    <svg className="w-2.5 h-2.5 rounded-full shrink-0 overflow-hidden" viewBox="0 0 10 10">
                      <circle cx="5" cy="5" r="4.5" fill="url(#pendingStripes)" stroke="#94a3b8" strokeWidth="0.8" />
                    </svg>
                    <span className="text-xs font-medium text-slate-600">{t('Pending')}</span>
                  </button>
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
