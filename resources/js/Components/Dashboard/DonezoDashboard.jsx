import React, { useState } from 'react';
import {
  Search,
  Mail,
  Bell,
  Plus,
  ArrowUpRight,
  Video,
  Clock,
  Calendar as CalendarIcon,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  LayoutGrid,
  CheckSquare,
  Pause,
  Square,
  Play,
  Download,
  Star,
  DollarSign,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Server,
  Terminal
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function DonezoDashboard({ authUser }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [healthTab, setHealthTab] = useState('apis');

  const userAvatar =
    authUser?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const userName = authUser?.name || 'Totok Michael';
  const userEmail = authUser?.email || 'tmichael20@mail.com';

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
      comment: 'Excellent electrical repair work! Very punctual and clean.',
      service: 'Electrical Repair',
    },
    {
      id: 2,
      name: 'Edwin Adenike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Great HVAC central cooling setup service.',
      service: 'HVAC Maintenance',
    },
    {
      id: 3,
      name: 'Isaac Oluwatemilorun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 4,
      comment: 'Resolved main pipe leakage promptly. Highly recommended.',
      service: 'Plumbing Service',
    },
    {
      id: 4,
      name: 'David Oshodi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Outstanding commercial deep cleaning, very professional.',
      service: 'Deep Cleaning',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 sm:p-4 lg:p-6 font-sans text-slate-800">
      <div className="mx-auto max-w-[1440px] rounded-[32px] bg-[#f8faf9] p-4 sm:p-6 shadow-sm border border-slate-200/60 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-64 flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200/70 pb-6 lg:pb-0 lg:pr-6">
          <div>
            <div className="flex items-center gap-3 px-3 py-2 mb-8">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">Donezo</span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">MENU</p>
                <nav className="space-y-1">
                  {[
                    { name: 'Dashboard', icon: LayoutGrid, count: null },
                    { name: 'Tasks', icon: CheckSquare, count: '12+' },
                    { name: 'Calendar', icon: CalendarIcon, count: null },
                    { name: 'Analytics', icon: BarChart2, count: null },
                    { name: 'Team', icon: Users, count: null },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 shadow-sm border-l-4 border-emerald-600'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.count && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div>
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">GENERAL</p>
                <nav className="space-y-1">
                  {[
                    { name: 'Settings', icon: Settings },
                    { name: 'Help', icon: HelpCircle },
                    { name: 'Logout', icon: LogOut },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all"
                      >
                        <Icon className="w-5 h-5 text-slate-400" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c3924] to-[#092618] p-4 text-white shadow-lg">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Download our Mobile App</h4>
                <p className="text-xs text-slate-300 mt-0.5">Get easy in another way</p>
              </div>
              <button className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md">
                Download
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 space-y-6">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search task"
                className="w-full pl-10 pr-12 py-2.5 bg-white rounded-full border border-slate-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200">
                ⌘F
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative">
                <Mail className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div className="hidden sm:block text-left">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{userName}</h4>
                  <p className="text-xs text-slate-400">{userEmail}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="pt-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Plan, prioritize, and accomplish your tasks with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0f4a2d] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-emerald-100">Total Revenue</span>
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <DollarSign className="w-4 h-4" />
                </button>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">$48,250.00</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <span className="w-3 h-3 rounded bg-emerald-400 text-emerald-950 flex items-center justify-center text-[10px] font-bold">↑</span>
                  +14.2% Gross Volume
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-slate-600">Total Customers</span>
                <button className="w-8 h-8 rounded-full border border-slate-200 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-700 transition-colors">
                  <Users className="w-4 h-4" />
                </button>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">184</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-3 h-3 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">↑</span>
                  Active Marketplace Clients
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-slate-600">Running Projects</span>
                <button className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">12</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  Increased from last month
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-slate-600">Pending Project</span>
                <button className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">2</div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                  On Discuss
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <h3 className="text-base font-bold text-slate-900 mb-6">Project Analytics</h3>
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
                    <h3 className="text-base font-bold text-slate-900 mb-4">Reminders</h3>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-slate-900 leading-snug">
                        Meeting with Arc Company
                      </h4>
                      <p className="text-xs font-medium text-slate-400">
                        Time : 02.00 pm - 04.00 pm
                      </p>
                    </div>
                  </div>
                  <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0f4a2d] hover:bg-[#0c3e25] text-white font-bold text-sm rounded-full transition-all shadow-md shadow-emerald-950/10">
                    <Video className="w-4 h-4 fill-current" />
                    <span>Start Meeting</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Recent Reviews</h3>
                      <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.9
                      </span>
                    </div>
                    <button className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors">
                      View All
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
                      <h3 className="text-base font-bold text-slate-900">Pending Payouts</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        5 Pending
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2 mb-4">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Owed to Providers
                      </span>
                      <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        $3,410.00
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Awaiting clearance for completed jobs
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Payout Clearance</span>
                        <span className="text-emerald-700">92% Cleared</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-600" style={{ width: '80%' }} />
                        <div className="h-full bg-amber-400" style={{ width: '12%' }} />
                        <div className="h-full bg-rose-400" style={{ width: '8%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Escrow Protected</span>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors">
                      <span>Process Queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Technical & System Health Panel */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="bg-white p-6 rounded-[28px] border border-slate-200/80 shadow-sm flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Technical & System Health</h3>
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
                                  <linearGradient id="latencyGradientDonezo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                                  </linearGradient>
                                </defs>

                                <path
                                  d="M 0,65 Q 15,30 28,60 T 55,75 T 80,35 T 105,70 T 130,30 T 155,80 T 185,55 T 215,75 T 245,60 T 275,55 T 300,75 L 300,100 L 0,100 Z"
                                  fill="url(#latencyGradientDonezo)"
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

        </main>
      </div>
    </div>
  );
}
