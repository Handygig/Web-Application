import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  ArrowUpRight,
  Video,
  Star,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Users,
  Plus,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Dashboard({ stats }) {
  const { t } = useTranslation();

  const [healthTab, setHealthTab] = useState('apis');
  const [timerRunning, setTimerRunning] = useState(true);

  // Financial & platform stats
  const grossRevenue = stats?.grossRevenue ?? 48250.00;
  const totalCustomers = stats?.totalCustomers ?? 184;
  const pendingPayoutsAmount = stats?.pendingPayoutsAmount ?? 3410.00;
  const pendingPayoutsCount = stats?.pendingPayoutsCount ?? 5;
  const totalProviders = stats?.totalProviders ?? 24;
  const activeBookings = stats?.activeBookings ?? 12;

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Analytics days chart data (matching Donezo visual pill bars style)
  const analyticsDays = [
    { day: 'S', height: '50%', pattern: 'striped' },
    { day: 'M', height: '80%', pattern: 'solid' },
    { day: 'T', height: '60%', pattern: 'soft', highlight: '74%' },
    { day: 'W', height: '95%', pattern: 'dark' },
    { day: 'T', height: '65%', pattern: 'striped' },
    { day: 'F', height: '45%', pattern: 'striped' },
    { day: 'S', height: '55%', pattern: 'striped' },
  ];

  // Technical & System Health Services
  const systemApis = [
    { name: 'Payment Gateway (Stripe)', uptime: '99.98%', status: 'Operational', latency: '45ms' },
    { name: 'SMS Gateway (Twilio)', uptime: '100.0%', status: 'Operational', latency: '110ms' },
    { name: 'Google Maps API', uptime: '99.9%', status: 'Operational', latency: '32ms' },
    { name: 'Queue Worker & Redis', uptime: '100.0%', status: 'Healthy', latency: '2ms' },
  ];

  // System & Error Logs Stream
  const systemLogs = [
    { time: '22:05:12', type: 'INFO', text: 'STRIPE_WEBHOOK: Payment #pi_3M92x succeeded' },
    { time: '21:48:04', type: 'INFO', text: 'TWILIO_SMS: Verification sent to +1 (555) 019-2831' },
    { time: '21:12:30', type: 'INFO', text: 'GEOCODE_API: Route matrix computed for Provider #12' },
    { time: '20:30:15', type: 'INFO', text: 'QUEUE_WORKER: Dispatch email job completed in 120ms' },
  ];

  // Team / Recent Reviews
  const recentReviews = [
    {
      id: 1,
      name: 'Alexandra Deff',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Working on GitHub Project Repository',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Working on Integrate User Authentication',
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 4,
      comment: 'Working on Develop Search and Filter',
      status: 'Pending',
    },
    {
      id: 4,
      name: 'David Oshodi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Working on Responsive Layout for Homepage',
      status: 'In Progress',
    },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] space-y-6 pb-12 font-sans">
        
        {/* TOP HEADER SECTION (Donezo style title with action buttons) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('Dashboard')}</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {t('Plan, prioritize, and accomplish your service requests with ease.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={route('admin.bookings.index')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0f4a2d] hover:bg-[#0c3e25] text-white font-semibold text-xs rounded-full transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('Add Booking')}</span>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-full border border-slate-200/80 shadow-xs transition-all active:scale-95">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('Import Data')}</span>
            </button>
          </div>
        </div>

        {/* STAT CARDS ROW (Matching Donezo 4-card layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Revenue (Forest Green Solid Card) */}
          <div className="bg-[#0f4a2d] text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-100/90">{t('Total Revenue')}</span>
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
              <p className="text-[11px] font-medium text-emerald-200/80 mt-1.5 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                {t('Increased from last month')}
              </p>
            </div>
          </div>

          {/* Card 2: Total Customers (Clean White Card) */}
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
                {t('Increased from last month')}
              </p>
            </div>
          </div>

          {/* Card 3: Running Projects (Clean White Card) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Running Projects')}</span>
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
                {t('Increased from last month')}
              </p>
            </div>
          </div>

          {/* Card 4: Pending Payouts (Clean White Card) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('Pending Payouts')}</span>
              <span className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-400">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {pendingPayoutsCount}
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                {t('On Discuss / Clearance')}
              </p>
            </div>
          </div>

        </div>

        {/* MIDDLE & BOTTOM DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (8 cols): Analytics + Reminders + Team Collaboration */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Project Analytics + Reminders Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Project Analytics (7 cols - Donezo Pill Bar Chart) */}
              <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <h3 className="text-base font-bold text-slate-900">{t('Project Analytics')}</h3>
                
                <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6 pb-2">
                  {analyticsDays.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                      {item.highlight && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0f4a2d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                          {item.highlight}
                        </div>
                      )}
                      <div
                        style={{ height: item.height }}
                        className={`w-full max-w-[36px] rounded-full transition-all duration-300 ${
                          item.pattern === 'dark'
                            ? 'bg-[#0f4a2d]'
                            : item.pattern === 'solid'
                            ? 'bg-emerald-600'
                            : item.pattern === 'soft'
                            ? 'bg-emerald-400'
                            : 'bg-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:6px_6px]'
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminders Card (5 cols - Donezo Meeting Card) */}
              <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4">{t('Reminders')}</h3>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                      {t('Meeting with Arc Company')}
                    </h4>
                    <p className="text-xs font-medium text-slate-400">
                      {t('Time')}: 02.00 pm - 04.00 pm
                    </p>
                  </div>
                </div>

                <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0f4a2d] hover:bg-[#0c3e25] text-white font-bold text-xs rounded-full transition-all shadow-sm active:scale-95">
                  <Video className="w-4 h-4 fill-current" />
                  <span>{t('Start Meeting')}</span>
                </button>
              </div>
            </div>

            {/* Team Collaboration Card (Matching Donezo Team list) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{t('Team Collaboration')}</h3>
                <button className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-full transition-colors">
                  <Plus className="w-3 h-3" />
                  <span>{t('Add Member')}</span>
                </button>
              </div>

              <div className="space-y-3.5 pt-1">
                {recentReviews.map((rev) => (
                  <div key={rev.id} className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{rev.name}</h5>
                        <p className="text-[11px] font-medium text-slate-400 truncate">{rev.comment}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full shrink-0 ${
                        rev.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rev.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Project Progress Gauge + Time Tracker */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            
            {/* Project Progress Arc Gauge */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{t('Project Progress')}</h3>
              
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-44 h-24 flex items-center justify-center overflow-hidden">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      strokeDasharray="251"
                      strokeDashoffset="125"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0f4a2d"
                      strokeWidth="10"
                      strokeDasharray="251"
                      strokeDashoffset="175"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-2 text-center">
                    <div className="text-3xl font-extrabold text-slate-900">41%</div>
                    <div className="text-[10px] font-semibold text-slate-400">{t('Project Ended')}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#0f4a2d]" />
                    {t('Completed')}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {t('In Progress')}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    {t('Pending')}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Tracker Card (Donezo Dark Forest Green Block) */}
            <div className="bg-[#0f4a2d] text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-100/90">{t('Time Tracker')}</span>
                <div className="text-4xl font-extrabold tracking-tight mt-3 font-mono">
                  01:24:08
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setTimerRunning((v) => !v)}
                  className="w-10 h-10 rounded-full bg-white text-[#0f4a2d] hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm"
                >
                  {timerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button className="w-10 h-10 rounded-full bg-rose-500 text-white hover:bg-rose-600 flex items-center justify-center transition-colors shadow-sm">
                  <div className="w-3.5 h-3.5 bg-white rounded-xs" />
                </button>
              </div>
            </div>

            {/* Technical & System Health Toggle */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">{t('System Health')}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% {t('Operational')}
              </span>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
