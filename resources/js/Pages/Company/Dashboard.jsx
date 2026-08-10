import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  ArrowUpRight,
  Video,
  Star,
  DollarSign,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Server,
  Terminal,
  Users
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Dashboard({ stats }) {
  const { t } = useTranslation();

  const [healthTab, setHealthTab] = useState('apis');

  const totalRevenue = stats?.totalRevenue ?? 32450.00;
  const totalCustomers = stats?.totalCustomers ?? 142;
  const pendingPayoutsAmount = stats?.pendingPayoutsAmount ?? 2150.00;
  const totalEmployees = stats?.totalEmployees ?? 16;
  const activeBookings = stats?.activeBookings ?? 8;

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const analyticsDays = [
    { day: 'S', height: '55%', type: 'striped' },
    { day: 'M', height: '75%', type: 'solid-primary' },
    { day: 'T', height: '65%', type: 'solid-accent', highlight: '74%' },
    { day: 'W', height: '90%', type: 'solid-dark' },
    { day: 'T', height: '70%', type: 'striped' },
    { day: 'F', height: '50%', type: 'striped' },
    { day: 'S', height: '60%', type: 'striped' },
  ];

  const systemApis = [
    { name: 'Payment Gateway (Stripe)', uptime: '99.98%', status: 'Operational', latency: '45ms' },
    { name: 'SMS Gateway (Twilio)', uptime: '100.0%', status: 'Operational', latency: '110ms' },
    { name: 'Google Maps API', uptime: '99.9%', status: 'Operational', latency: '32ms' },
    { name: 'Queue Worker & Redis', uptime: '100.0%', status: 'Healthy', latency: '2ms' },
  ];

  const systemLogs = [
    { time: '22:05:12', type: 'INFO', text: 'STRIPE_WEBHOOK: Payment #pi_3M92x succeeded' },
    { time: '21:48:04', type: 'INFO', text: 'TWILIO_SMS: Verification sent to +1 (555) 019-2831' },
    { time: '21:12:30', type: 'INFO', text: 'GEOCODE_API: Route matrix computed for Provider #12' },
    { time: '20:30:15', type: 'INFO', text: 'QUEUE_WORKER: Dispatch job completed in 120ms' },
  ];

  const recentReviews = [
    {
      id: 1,
      name: 'Alexandra Deff',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Excellent service delivery! Extremely satisfied with the result.',
      service: 'Field Service',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Quick response and thorough diagnostics.',
      service: 'On-Site Repair',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 4,
      comment: 'Well coordinated team and fast turnaround time.',
      service: 'Maintenance',
    },
    {
      id: 4,
      name: 'David Oshodi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Very professional interaction from start to finish.',
      service: 'Installation',
    },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        
        {/* HEADER AREA */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('Company Dashboard')}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {t('Plan, prioritize, and accomplish your tasks with ease.')}
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f4a2d] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-emerald-100">{t('Total Revenue')}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formattedCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <span className="w-3 h-3 rounded bg-emerald-400 text-emerald-950 flex items-center justify-center text-[10px] font-bold">↑</span>
                {t('+12.5% Gross Earnings')}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-slate-600">{t('Total Customers')}</span>
              <div className="w-8 h-8 rounded-full border border-slate-200 bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {totalCustomers}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-3 h-3 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">↑</span>
                {t('Served Client Network')}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-slate-600">{t('Total Employees')}</span>
              <Link
                href={route('company.employees.index')}
                className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{totalEmployees}</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">↑</span>
                {t('Active Service Team')}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-slate-600">{t('Running Projects')}</span>
              <Link
                href={route('company.bookings.index')}
                className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeBookings}</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                {t('In Active Execution')}
              </span>
            </div>
          </div>
        </div>

        {/* WIDGETS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <h3 className="text-base font-bold text-slate-900 mb-6">{t('Project Analytics')}</h3>
                <div className="h-44 flex items-end justify-between gap-2 px-2 pb-2">
                  {analyticsDays.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                      {item.highlight && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                          {item.highlight}
                        </div>
                      )}
                      <div
                        style={{ height: item.height }}
                        className={`w-full max-w-[28px] rounded-full transition-all duration-300 group-hover:opacity-90 ${
                          item.type === 'solid-dark'
                            ? 'bg-[#0f4a2d]'
                            : item.type === 'solid-primary'
                            ? 'bg-emerald-600'
                            : item.type === 'solid-accent'
                            ? 'bg-emerald-400'
                            : 'bg-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:6px_6px]'
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-4">{t('Reminders')}</h3>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900 leading-snug">
                      {t('Meeting with Arc Company')}
                    </h4>
                    <p className="text-xs font-medium text-slate-400">
                      {t('Time')} : 02.00 pm - 04.00 pm
                    </p>
                  </div>
                </div>
                <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0f4a2d] hover:bg-[#0c3e25] text-white font-bold text-sm rounded-full transition-all shadow-md shadow-emerald-950/10">
                  <Video className="w-4 h-4 fill-current" />
                  <span>{t('Start Meeting')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{t('Recent Reviews')}</h3>
                    <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4.9
                    </span>
                  </div>
                  <button className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors">
                    {t('View All')}
                  </button>
                </div>
                <div className="space-y-3 pt-1">
                  {recentReviews.map((rev) => (
                    <div key={rev.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left border border-slate-100">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{rev.name}</h5>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 line-clamp-1 mt-0.5">{rev.comment}</p>
                        <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded mt-1">
                          {rev.service}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900">{t('Pending Payouts')}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {t('Processing')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2 mb-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      {t('Owed to Employees')}
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {formattedCurrency(pendingPayoutsAmount)}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {t('Scheduled for next payout cycle')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{t('Payout Clearance')}</span>
                      <span className="text-emerald-700">88% {t('Cleared')}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-600" style={{ width: '88%' }} />
                      <div className="h-full bg-amber-400" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('Direct Deposit Active')}</span>
                  </div>
                  <Link
                    href={route('company.payments.index')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <span>{t('View Payments')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between">
            {/* TECHNICAL & SYSTEM HEALTH PANEL */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-sm flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t('Technical & System Health')}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-emerald-600">100% Operational</span>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-100/90 p-1 rounded-xl text-xs font-semibold text-slate-500">
                    <button
                      onClick={() => setHealthTab('apis')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        healthTab === 'apis'
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      APIs
                    </button>
                    <button
                      onClick={() => setHealthTab('logs')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        healthTab === 'logs'
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      Logs
                    </button>
                  </div>
                </div>

                <div className="border-b border-slate-100" />

                {healthTab === 'apis' ? (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-700 mb-3">
                        Aggregate API Latency - Last 24 Hours
                      </h4>

                      <div className="relative pt-1">
                        <div className="flex items-stretch gap-2">
                          <div className="flex flex-col justify-between text-[10px] font-semibold text-slate-400 text-right h-28 pr-1 select-none">
                            <span>200</span>
                            <span>150</span>
                            <span>100</span>
                            <span>50</span>
                            <span>0</span>
                          </div>

                          <div className="flex-1 relative h-28 border-l border-b border-slate-200">
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                              <div className="border-b border-slate-100 w-full" />
                              <div className="border-b border-slate-100 w-full" />
                              <div className="border-b border-slate-100 w-full" />
                              <div className="border-b border-slate-100 w-full" />
                              <div className="w-full" />
                            </div>

                            <div className="absolute inset-0 flex justify-between pointer-events-none">
                              <div className="border-r border-slate-100 h-full" />
                              <div className="border-r border-slate-100 h-full" />
                              <div className="border-r border-slate-100 h-full" />
                              <div className="border-r border-slate-100 h-full" />
                              <div className="border-r border-slate-100 h-full" />
                              <div className="border-r border-slate-100 h-full" />
                            </div>

                            <svg
                              className="absolute inset-0 w-full h-full overflow-visible"
                              viewBox="0 0 300 100"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient id="latencyGradientCompany" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                                </linearGradient>
                              </defs>

                              <path
                                d="M 0,65 Q 15,30 28,60 T 55,75 T 80,35 T 105,70 T 130,30 T 155,80 T 185,55 T 215,75 T 245,60 T 275,55 T 300,75 L 300,100 L 0,100 Z"
                                fill="url(#latencyGradientCompany)"
                              />

                              <path
                                d="M 0,65 Q 15,30 28,60 T 55,75 T 80,35 T 105,70 T 130,30 T 155,80 T 185,55 T 215,75 T 245,60 T 275,55 T 300,75"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="flex justify-between text-[10px] font-semibold text-slate-400 pl-8 pt-1.5">
                          <span>00:00</span>
                          <span>04:00</span>
                          <span>08:00</span>
                          <span>12:00</span>
                          <span>16:00</span>
                          <span>20:00</span>
                          <span>00:00</span>
                        </div>
                        <div className="text-center text-[10px] font-semibold text-slate-400 mt-0.5">Time</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {systemApis.map((api, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                              <h5 className="text-sm font-bold text-slate-900">{api.name}</h5>
                            </div>
                            <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800">
                              {api.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs font-medium text-slate-600 pt-0.5">
                            <span>
                              Uptime: <strong className="text-slate-900 font-bold">{api.uptime}</strong>
                            </span>
                            <span>
                              Latency: <strong className="text-slate-900 font-bold">{api.latency}</strong>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    {systemLogs.map((log, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">[{log.time}]</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {log.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug break-all">{log.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}
