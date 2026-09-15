import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '../Hooks/useTranslation';
import LandingNavbar from '../Components/Landing/LandingNavbar';

export default function Welcome({ canLogin, canRegister }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  const trustedBrands = ['HandyCorp', 'HomeFix', 'BuildCraft', 'FixItAll', 'EliteService'];

  const categories = [
    {
      name: t('Accounting & Finance'),
      jobs: t('122 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H17V9H7V7ZM17 17H7V15H17V17ZM17 13H7V11H17V13Z" />
        </svg>
      ),
    },
    {
      name: t('Plumbing & Piping'),
      jobs: t('98 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96zM12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        </svg>
      ),
    },
    {
      name: t('Electrical & Power'),
      jobs: t('75 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M7 2v11h3v9l7-12h-4l4-8z" />
        </svg>
      ),
    },
    {
      name: t('Carpentry & Woodwork'),
      jobs: t('64 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
      ),
    },
    {
      name: t('HVAC & Cooling'),
      jobs: t('110 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    },
    {
      name: t('Painting & Decorating'),
      jobs: t('85 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M18 4V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H4c-.55 0-1 .45-1 1v4c0 2.21 1.79 4 4 4h2v7c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-7h2c2.21 0 4-1.79 4-4V5c0-.55-.45-1-1-1h-2z" />
        </svg>
      ),
    },
    {
      name: t('Roofing & Exterior'),
      jobs: t('42 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      name: t('Locksmith & Security'),
      jobs: t('56 Active Jobs'),
      desc: t('You can view all popular jobs according your future careers.'),
      icon: (
        <svg className="w-9 h-9 text-theme-accent fill-current" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
      ),
    },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: t('Senior Plumbing Specialist'),
      type: 'Full Time',
      badge: 'Featured',
      typeBadgeClass: 'bg-emerald-100 text-emerald-800',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      category: 'Plumbing',
      location: 'New York, NY',
      budget: '$45 - $65 / hr',
      skills: ['Pipe Fitting', 'Water Heater', 'Emergency Repair'],
    },
    {
      id: 2,
      title: t('Residential Electrician'),
      type: 'Freelancer',
      badge: 'Urgent',
      typeBadgeClass: 'bg-sky-100 text-sky-800',
      badgeClass: 'bg-amber-100 text-amber-800',
      category: 'Electrical',
      location: 'Los Angeles, CA',
      budget: '$50 - $80 / hr',
      skills: ['Circuit Breakers', 'Rewiring', 'Lighting Setup'],
    },
    {
      id: 3,
      title: t('Master Carpenter'),
      type: 'Contract',
      badge: 'Featured',
      typeBadgeClass: 'bg-purple-100 text-purple-800',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      category: 'Carpentry',
      location: 'Chicago, IL',
      budget: '$40 - $60 / hr',
      skills: ['Custom Cabinets', 'Framing', 'Door Installation'],
    },
    {
      id: 4,
      title: t('HVAC Maintenance Tech'),
      type: 'Part Time',
      badge: 'Urgent',
      typeBadgeClass: 'bg-indigo-100 text-indigo-800',
      badgeClass: 'bg-amber-100 text-amber-800',
      category: 'HVAC',
      location: 'Houston, TX',
      budget: '$35 - $55 / hr',
      skills: ['AC Repair', 'Duct Inspection', 'Thermostat Setup'],
    },
  ];

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <LandingNavbar auth={auth} canLogin={canLogin} canRegister={canRegister} activePage="home" />

      {/* Hero Section */}
      <section className="bg-white py-6 md:py-10 border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 flex flex-col gap-6 text-left pt-4 lg:pt-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              {t('Find Trusted')} <span className="text-theme-accent">{t('Handyman Experts')}</span>{' '}
              {t('For Your Home')}
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              {t(
                'Connect with verified local professionals for plumbing, electrical, carpentry, HVAC, and home repairs. Post a job request or apply as a service provider today.'
              )}
            </p>

            {/* Quick Search Bar */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
              <div className="flex-1 flex items-center gap-2.5 px-3.5 bg-white rounded-xl border border-slate-200">
                <svg
                  className="w-5 h-5 text-slate-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={t('Search service, job title or skill...')}
                  className="w-full py-3.5 bg-transparent text-base focus:outline-none text-slate-800 placeholder-slate-400 border-0 focus:ring-0"
                />
              </div>
              <Link
                href={auth.user ? '/dashboard' : '/register'}
                className="px-7 py-3.5 bg-theme-accent hover:bg-theme-accent-hover text-white text-base font-bold rounded-xl text-center transition flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 shrink-0"
              >
                {t('Search Jobs')}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8 sm:gap-10 pt-3">
              <div>
                <p className="text-3xl font-extrabold text-slate-900">12k+</p>
                <p className="text-sm text-slate-500 font-semibold mt-0.5">
                  {t('Verified Handymen')}
                </p>
              </div>
              <div className="h-9 w-px bg-slate-200 hidden sm:block" />
              <div>
                <p className="text-3xl font-extrabold text-slate-900">45k+</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                  {t('Jobs Completed')}
                </p>
              </div>
              <div className="h-9 w-px bg-slate-200 hidden sm:block" />
              <div>
                <p className="text-3xl font-extrabold text-slate-900">99%</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                  {t('Satisfaction Rate')}
                </p>
              </div>
            </div>
          </div>

          {/* Asymmetric 4-Image Grid with Hover Micro-Animations */}
          <div className="lg:col-span-6 relative flex items-start justify-center lg:justify-end lg:pl-4 p-2">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-2xl items-start">
              {/* Row 1 Col 1: Circular Profile Image */}
              <div className="flex justify-end items-start">
                <div className="group w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl shrink-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer">
                  <img
                    src="/images/landing/hero-01.jpeg"
                    alt="Handyman Professional"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Row 1 Col 2: Tall Rounded Rectangle */}
              <div className="flex justify-start items-start">
                <div className="group w-40 h-64 sm:w-56 sm:h-80 md:w-64 md:h-96 rounded-[28px] sm:rounded-[40px] overflow-hidden shadow-xl shrink-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer">
                  <img
                    src="/images/landing/hero-02.jpeg"
                    alt="Service Team Discussion"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Row 2 Col 1: Extra Tall Rounded Rectangle */}
              <div className="flex justify-end items-start -mt-12 sm:-mt-20 md:-mt-28">
                <div className="group w-40 h-64 sm:w-56 sm:h-80 md:w-64 md:h-96 rounded-[28px] sm:rounded-[40px] overflow-hidden shadow-xl shrink-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer">
                  <img
                    src="/images/landing/hero-03.jpeg"
                    alt="Skilled Worker at Job"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Row 2 Col 2: Circular Profile Image with decorative dots */}
              <div className="flex justify-start items-start relative">
                <div className="group w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl z-10 shrink-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer">
                  <img
                    src="/images/landing/hero-04.jpeg"
                    alt="Customer Service Specialist"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                {/* Decorative background dot grid */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 sm:w-28 sm:h-28 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:10px_10px] -z-0 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies Banner */}
      <section className="bg-emerald-900 text-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-emerald-200 mb-6 uppercase tracking-wider">
            {t('The fastest-growing home service companies trust Handygig')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-80">
            {trustedBrands.map((brand, idx) => (
              <span
                key={idx}
                className="text-2xl font-bold tracking-wider text-emerald-100 font-mono"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="featured-jobs" className="py-20 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
              {t('Featured Gigs & Job Opportunities')}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t(
                'Explore active job listings posted by homeowners, commercial properties, and service companies near you.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${job.badgeClass}`}
                    >
                      {job.badge}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${job.typeBadgeClass}`}
                    >
                      {job.type}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-theme-accent mb-4 font-bold text-lg">
                    {job.category[0]}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1">{job.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">
                    {job.location} •{' '}
                    <span className="font-semibold text-emerald-700">{job.budget}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={auth.user ? '/dashboard' : '/register'}
                  className="w-full py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold text-center transition"
                >
                  {t('Apply Now')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Top Categories Section */}
      <section id="categories" className="py-20 bg-emerald-950/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t('Explore Top Categories')}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t(
                'Browse handyman job categories and connect directly with skilled workers across various trades.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 ease-out flex flex-col justify-between items-start text-left group cursor-pointer"
              >
                <div>
                  <div className="mb-3.5 flex items-center justify-start transition-transform duration-300 group-hover:scale-110 origin-left">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-2xl tracking-tight leading-snug mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-4 font-normal">
                    {cat.desc}
                  </p>
                </div>
                <span className="text-base font-bold text-theme-accent tracking-tight">
                  {cat.jobs}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted & Popular Job Portal Section */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <div className="w-full max-w-md h-[480px] rounded-t-full rounded-b-3xl bg-emerald-100 p-3 shadow-lg relative overflow-hidden">
              <div className="w-full h-full rounded-t-full rounded-b-2xl bg-white border border-slate-200 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-theme-accent flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-theme-accent text-xs font-bold rounded-full mb-3 uppercase">
                  {t('Advanced Features')}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {t('Verified Quality Work')}
                </h3>
                <p className="text-slate-600 text-sm">
                  {t(
                    'All handyman professionals are identity-verified with background checks and client ratings.'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold tracking-wide uppercase max-w-max">
              {t('Why Choose Handygig')}
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {t('Trusted & Popular Handyman Service Portal')}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              {t(
                'We make it seamless to request home service jobs, receive instant provider quotations, track assignments, and make secure payments.'
              )}
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-theme-accent flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {t('#1 Quality Jobs & Providers')}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t(
                      'Access vetted individual technicians and certified handyman service companies.'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-theme-accent flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {t('Top Service Companies')}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t('Manage employee assignments, work orders, and client quotations easily.')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-theme-accent flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {t('Fair & Transparent Pricing')}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t(
                      'No hidden charges. Clear platform fees, quotations, and instant secure payment releases.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Platform Experience Showcase Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-theme-accent text-xs font-semibold tracking-wide uppercase max-w-max">
              {t('Our Showcase')}
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {t('Best Service & Job Search Platform Experience')}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              {t(
                'Whether you need an urgent plumbing repair or want to grow your handyman business as a contractor, Handygig delivers an intuitive experience.'
              )}
            </p>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <span className="text-theme-accent">✓</span> {t('Residential & Commercial Jobs')}
              </div>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <span className="text-theme-accent">✓</span> {t('Company Showcase')}
              </div>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <span className="text-theme-accent">✓</span> {t('Instant Job Quotations')}
              </div>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <span className="text-theme-accent">✓</span> {t('Easy Credentials Check')}
              </div>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <span className="text-theme-accent">✓</span> {t('Secure Payment Escrow')}
              </div>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
                <span className="text-theme-accent">✓</span> {t('Hire Expert Candidates')}
              </div>
            </div>

            <div>
              <Link
                href={auth.user ? '/dashboard' : '/register'}
                className="px-8 py-3.5 bg-theme-accent hover:bg-theme-accent-hover text-white text-sm font-semibold rounded-xl inline-block transition shadow-md shadow-emerald-950/10"
              >
                {t('Explore More Jobs')}
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-200/50 p-6 flex items-center justify-center relative">
              <div className="w-full h-full rounded-full bg-white shadow-xl flex flex-col items-center justify-center p-8 text-center border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-theme-accent flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  {t('Mobile & Web Access')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t(
                    'Manage service requests, chat with providers, and inspect job status on any device.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-theme-accent flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-xl text-white">Handygig</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {t(
                'The premier marketplace connecting homeowners & businesses with trusted handyman professionals.'
              )}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">{t('For Customers')}</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <a href="#categories" className="hover:text-white transition">
                  {t('Browse Categories')}
                </a>
              </li>
              <li>
                <a href="#featured-jobs" className="hover:text-white transition">
                  {t('Post a Job')}
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  {t('Customer Portal')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">{t('For Handymen')}</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <a href="#featured-jobs" className="hover:text-white transition">
                  {t('Browse Gigs')}
                </a>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  {t('Register as Provider')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  {t('Provider Dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">{t('Support')}</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <a href="#why-us" className="hover:text-white transition">
                  {t('Help & FAQs')}
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition">
                  {t('Terms & Conditions')}
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition">
                  {t('Privacy Policy')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Handygig. {t('All rights reserved.')}
        </div>
      </footer>
    </div>
  );
}
