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
            {/* Booking Progress Semicircular Arc Gauge Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{t('Booking progress')}</h3>

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
