import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
  ArrowUpRight,
  Wrench,
  Star,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Activity,
  Zap,
  UserCheck,
  Plus,
  Radio,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function Dashboard({ stats }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  const companyName = auth?.user?.name || t('Apex Home & Repair Services');

  const [bookingFilter, setBookingFilter] = useState('all');
  const [isAcceptingJobs, setIsAcceptingJobs] = useState(true);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const totalRevenue = stats?.totalRevenue ?? 32450.0;
  const totalCustomers = stats?.totalCustomers ?? 142;
  const pendingPayoutsAmount = stats?.pendingPayoutsAmount ?? 2150.0;
  const totalEmployees = stats?.totalEmployees ?? 16;
  const activeBookingsCount = stats?.activeBookings ?? 8;
  const customerRating = stats?.customerRating ?? '4.9';

  const formattedCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Active bookings list tailored for service-booking domain
  const activeBookingsList = [
    {
      id: 'JOB-4089',
      customer: 'Sarah Jenkins',
      service: t('Emergency Pipe Leak Repair'),
      category: t('Plumbing'),
      technician: 'David Miller (Master Plumber)',
      location: '742 Evergreen Terrace, Sector 4',
      phone: '+1 (555) 234-5678',
      status: 'urgent',
      time: '10 mins ago',
      price: '$180.00',
    },
    {
      id: 'JOB-4084',
      customer: 'Robert Chen',
      service: t('HVAC Unit Diagnostics & Tune-up'),
      category: t('HVAC & Cooling'),
      technician: 'Alex Rivera (HVAC Tech)',
      location: '1042 Elm Street, Suite 2B',
      phone: '+1 (555) 876-5432',
      status: 'in_progress',
      time: '35 mins ago',
      price: '$240.00',
    },
    {
      id: 'JOB-4081',
      customer: 'Marcus Brody',
      service: t('Commercial Electrical Panel Upgrade'),
      category: t('Electrical'),
      technician: 'James Wilson (Lead Electrician)',
      location: '450 Commerce Blvd, Bldg A',
      phone: '+1 (555) 345-6789',
      status: 'scheduled',
      time: 'Today, 2:30 PM',
      price: '$650.00',
    },
    {
      id: 'JOB-4078',
      customer: 'Elena Rostova',
      service: t('High-Pressure Sewer Line Cleansing'),
      category: t('Plumbing'),
      technician: 'Sam Patel (Plumbing Specialist)',
      location: '88 Westside Ave',
      phone: '+1 (555) 901-2345',
      status: 'in_progress',
      time: '1 hour ago',
      price: '$310.00',
    },
  ];

  const filteredBookings = activeBookingsList.filter((b) => {
    if (bookingFilter === 'urgent') return b.status === 'urgent';
    if (bookingFilter === 'in_progress') return b.status === 'in_progress';
    if (bookingFilter === 'scheduled') return b.status === 'scheduled';
    return true;
  });

  const analyticsDays = [
    { day: t('Mon'), height: '55%', amount: '$3,400', jobs: '12 jobs' },
    { day: t('Tue'), height: '75%', amount: '$4,800', jobs: '18 jobs' },
    { day: t('Wed'), height: '65%', amount: '$4,200', jobs: '15 jobs', highlight: '$5,100' },
    { day: t('Thu'), height: '90%', amount: '$6,300', jobs: '24 jobs' },
    { day: t('Fri'), height: '70%', amount: '$4,900', jobs: '19 jobs' },
    { day: t('Sat'), height: '80%', amount: '$5,400', jobs: '21 jobs' },
    { day: t('Sun'), height: '60%', amount: '$3,850', jobs: '14 jobs' },
  ];

  const recentReviews = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: t('David arrived within 20 mins and fixed the pipe leak immediately. Top notch emergency response!'),
      service: t('Plumbing Repair'),
    },
    {
      id: 2,
      name: 'Robert Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: t('Thorough AC inspection and transparent pricing. Highly recommended for home maintenance.'),
      service: t('HVAC Servicing'),
    },
    {
      id: 3,
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      comment: t('Clean electrical installation and very professional team. Will book again!'),
      service: t('Electrical Upgrade'),
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            {t('Urgent Dispatch')}
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Clock className="w-3 h-3 text-emerald-600 animate-pulse" />
            {t('In Progress')}
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            {t('Scheduled')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="provider-dashboard-root mx-auto max-w-[1400px] space-y-6 pb-8">
        
        {/* PROVIDER COMPANY HEADER & QUICK DISPATCH CONTROLS */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#E2E4D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('Provider Dashboard')}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF5EC] text-[#2F4F2F] border border-[#C6E2CB]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" />
                {t('Verified Company')}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t('Managing operations & field service dispatch for')} <strong className="text-slate-800">{companyName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Acceptance Toggle */}
            <button
              onClick={() => setIsAcceptingJobs(!isAcceptingJobs)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
                isAcceptingJobs
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              <Radio className={`w-4 h-4 ${isAcceptingJobs ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <span>{isAcceptingJobs ? t('Accepting New Job Requests') : t('Requests Paused')}</span>
            </button>

            {/* Quick Dispatch Modal Button */}
            <button
              onClick={() => setShowDispatchModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold text-xs transition-all shadow-md hover:opacity-90 active:scale-98"
              style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
            >
              <Plus className="w-4 h-4" />
              <span>{t('Dispatch Job')}</span>
            </button>
          </div>
        </div>

        {/* 1. TOP METRIC CARDS (ROW 1 - FULL WIDTH 4-CARD GRID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 (Olive Green Accent): Total Revenue */}
          <div
            className="p-6 rounded-2xl border border-[#E2E4D9] shadow-sm text-white flex flex-col justify-between space-y-4"
            style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">{t('Total Revenue')}</span>
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formattedCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                {t('+12.5% Gross Earnings')}
              </span>
            </div>
          </div>

          {/* Card 2: Active Bookings */}
          <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Active Bookings')}</span>
              <Link
                href={route('company.bookings.index')}
                className="w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{activeBookingsCount}</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                {t('In Active Repair & Dispatch')}
              </span>
            </div>
          </div>

          {/* Card 3: Field Technicians */}
          <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Field Technicians')}</span>
              <Link
                href={route('company.employees.index')}
                className="w-9 h-9 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{totalEmployees}</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Wrench className="w-3.5 h-3.5 text-slate-500" />
                {t('12 Active On Shift')}
              </span>
            </div>
          </div>

          {/* Card 4: Customer Satisfaction */}
          <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Customer Satisfaction')}</span>
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              {customerRating}
              <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                {totalCustomers} {t('Total Reviews')}
              </span>
            </div>
          </div>

        </div>

        {/* 2. MAIN CONTENT GRID (2 COLUMNS: 8 COLS LEFT / 4 COLS RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- LEFT COLUMN (65–70% WIDTH / 8 COLUMNS) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* A. WEEKLY PERFORMANCE CHART CARD */}
            <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{t('Weekly Revenue & Job Volume')}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {t('Mon–Sun performance trends for completed repairs & billing')}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {t('This Week')}
                </span>
              </div>

              <div className="h-52 flex items-end justify-between gap-3 px-2 pt-4 pb-2">
                {analyticsDays.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {item.highlight && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 whitespace-nowrap">
                        {item.highlight}
                      </div>
                    )}
                    <div className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.amount}
                    </div>
                    <div
                      style={{
                        height: item.height,
                        backgroundColor: idx === 3 ? 'var(--color-accent, #5E6933)' : undefined,
                      }}
                      className={`w-full max-w-[32px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                        idx === 3
                          ? 'shadow-xs'
                          : idx % 2 === 0
                          ? 'bg-[#8A9A4A]'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-600">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* B. LIVE SERVICE BOOKINGS & ACTIVE DISPATCH TABLE CARD */}
            <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                    {t('Live Service Bookings & Active Dispatch')}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {t('Real-time queue of customer bookings, technician assignments, and job status')}
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setBookingFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bookingFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    {t('All Jobs')}
                  </button>
                  <button
                    onClick={() => setBookingFilter('urgent')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bookingFilter === 'urgent' ? 'bg-white text-rose-700 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    {t('Urgent')}
                  </button>
                  <button
                    onClick={() => setBookingFilter('in_progress')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bookingFilter === 'in_progress' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    {t('In Progress')}
                  </button>
                  <button
                    onClick={() => setBookingFilter('scheduled')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bookingFilter === 'scheduled' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    {t('Scheduled')}
                  </button>
                </div>
              </div>

              {/* Bookings List / Table */}
              <div className="space-y-3">
                {filteredBookings.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 font-mono">
                          {job.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{job.service}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                        <span className="text-xs font-extrabold text-slate-900">{job.price}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t('Customer')}: <strong className="text-slate-800">{job.customer}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.technician}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[11px] font-semibold text-slate-400">{t('Requested')} {job.time}</span>
                      <Link
                        href={route('company.bookings.index')}
                        className="font-bold flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--color-accent, #5E6933)' }}
                      >
                        <span>{t('Manage Service')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (30–35% WIDTH / 4 COLUMNS) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* A. EMERGENCY ACTION CARD */}
            <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-rose-700 bg-rose-100 px-3 py-1 rounded-xl text-xs font-extrabold border border-rose-200 w-fit mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t('Emergency Priority')}</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {t('Burst Water Pipe Emergency')}
                </h4>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  {t('742 Evergreen Terrace • Customer waiting for immediate dispatch.')}
                </p>
              </div>

              <div className="pt-2 border-t border-rose-200/60">
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold text-xs transition-all shadow-md hover:opacity-90 active:scale-98"
                  style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
                >
                  <Wrench className="w-4 h-4" />
                  <span>{t('Assign Emergency Tech')}</span>
                </button>
              </div>
            </div>

            {/* B. UPCOMING TECHNICIAN PAYOUT CARD */}
            <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900">{t('Technician Payouts')}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {t('Scheduled')}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2 mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {t('Owed to Field Staff')}
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {formattedCurrency(pendingPayoutsAmount)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('Scheduled Payout')}: <strong>Aug 25, 2026</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{t('Clearance Rate')}</span>
                    <span className="text-emerald-700">88% {t('Cleared')}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#5E6933]" style={{ width: '88%' }} />
                    <div className="h-full bg-amber-400" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('Stripe Connect Active')}</span>
                </div>
                <Link
                  href={route('company.payments.index')}
                  className="flex items-center gap-1 text-xs font-bold hover:underline"
                  style={{ color: 'var(--color-accent, #5E6933)' }}
                >
                  <span>{t('View Payments')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* C. RECENT CUSTOMER REVIEWS WIDGET */}
            <div className="p-6 rounded-2xl border border-[#E2E4D9] bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">{t('Recent Customer Reviews')}</h3>
                <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9 / 5.0
                </span>
              </div>

              <div className="space-y-3">
                {recentReviews.map((rev) => (
                  <div key={rev.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left border border-slate-100">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{rev.name}</h5>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
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
                              className="absolute inset-0 w-full h-full overflow-hidden"
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
                                d="M 0,75 C 20,70 35,45 50,50 C 65,55 80,78 100,70 C 120,62 135,25 150,30 C 165,35 180,68 200,65 C 220,62 235,18 250,22 C 265,26 280,58 300,50 L 300,100 L 0,100 Z"
                                fill="url(#latencyGradientCompany)"
                              />

                              <path
                                d="M 0,75 C 20,70 35,45 50,50 C 65,55 80,78 100,70 C 120,62 135,25 150,30 C 165,35 180,68 200,65 C 220,62 235,18 250,22 C 265,26 280,58 300,50"
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
                              <h5 className="text-xs font-bold text-slate-900">{api.name}</h5>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {api.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-0.5">
                            <span>
                              {t('Uptime')}: <strong className="text-slate-800 font-bold">{api.uptime}</strong>
                            </span>
                            <span>
                              {t('Latency')}: <strong className="text-slate-800 font-bold">{api.latency}</strong>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {systemLogs.map((log, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">[{log.time}]</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {log.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-600 line-clamp-2 mt-0.5">{rev.comment}</p>
                      <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 border border-emerald-200">
                        {rev.service}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* QUICK DISPATCH MODAL */}
        {showDispatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">{t('Dispatch Technician')}</h3>
                <button
                  onClick={() => setShowDispatchModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('Service Request')}</label>
                  <input
                    type="text"
                    defaultValue="JOB-4089 - Emergency Pipe Leak Repair"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('Assign Field Staff / Plumber')}</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none">
                    <option>David Miller (Master Plumber - Available)</option>
                    <option>Alex Rivera (HVAC Technician - Available)</option>
                    <option>James Wilson (Electrician - Available)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
                >
                  {t('Confirm & Dispatch')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
