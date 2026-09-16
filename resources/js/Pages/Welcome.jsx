import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '../Hooks/useTranslation';
import LandingNavbar from '../Components/Landing/LandingNavbar';

export default function Welcome({ canLogin, canRegister }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  const companyLogos = [
    { name: 'Ace Hardware', src: '/images/landing/companies/ace.svg' },
    { name: 'Angi', src: '/images/landing/companies/Angi-logo-Orange.svg' },
    { name: 'Handygig Green', src: '/images/landing/companies/logo_green.svg' },
    { name: 'Mr. Handyman', src: '/images/landing/companies/mr%20handyman.svg' },
  ];

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
      image: '/images/landing/jobs/job1.jpeg',
      title: t('Senior Plumbing Specialist'),
      desc: t('Professional plumbing repair, pipe installation, and emergency water heater services for residential properties.'),
      tags: [t('Pipe Fitting'), t('Water Heater'), t('Emergency Repair')],
      salary: '$45 - $65 / hr',
      openings: '6 Open',
    },
    {
      id: 2,
      image: '/images/landing/jobs/job2.jpeg',
      title: t('Residential Electrician'),
      desc: t('Licensed electrician for home wiring, circuit breaker maintenance, and custom interior lighting setups.'),
      tags: [t('Circuit Breakers'), t('Rewiring'), t('Lighting Setup')],
      salary: '$50 - $80 / hr',
      openings: '4 Open',
    },
    {
      id: 3,
      image: '/images/landing/jobs/job3.jpeg',
      title: t('Master Carpenter'),
      desc: t('Expert custom cabinet building, structural framing, door installation, and fine woodwork finish.'),
      tags: [t('Custom Cabinets'), t('Framing'), t('Door Installation')],
      salary: '$40 - $60 / hr',
      openings: '3 Open',
    },
    {
      id: 4,
      image: '/images/landing/jobs/job4.jpeg',
      title: t('HVAC Maintenance Tech'),
      desc: t('Comprehensive AC unit diagnostics, duct inspection, filter replacement, and smart thermostat setup.'),
      tags: [t('AC Repair'), t('Duct Inspection'), t('Thermostat Setup')],
      salary: '$35 - $55 / hr',
      openings: '2 Open',
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
      <section className="bg-emerald-900 text-white py-12 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm font-semibold text-emerald-200/90 mb-8 uppercase tracking-widest">
            {t('The fastest-growing home service companies trust Handygig')}
          </p>
          <div className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee items-center gap-16 sm:gap-24 md:gap-32 pr-16 sm:pr-24 md:pr-32">
              {[...companyLogos, ...companyLogos, ...companyLogos, ...companyLogos].map((logo, idx) => (
                <div
                  key={idx}
                  className="h-12 sm:h-14 shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-10 sm:h-12 w-auto max-w-[200px] object-contain grayscale opacity-80 brightness-0 invert group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="featured-jobs" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t('Featured Jobs')}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t(
                'Explore top-rated service requests and connect with verified homeowners looking for skilled handyman professionals.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between relative group cursor-pointer h-full"
              >
                <div className="flex flex-col flex-1 items-start text-left">
                  {/* Organic Image Pushed Upwards to Top of Card */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[58%_42%_38%_62%/62%_38%_62%_38%] group-hover:rounded-[42%_58%_62%_38%/38%_62%_38%_62%] mb-4 overflow-hidden border-2 border-emerald-100/90 shadow-md flex items-center justify-center bg-slate-50 shrink-0 transition-all duration-700 ease-in-out">
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Left-Aligned Job Title */}
                  <h3 className="font-bold text-slate-900 text-lg mb-2 text-left group-hover:text-[#059669] transition-colors leading-snug">
                    {job.title}
                  </h3>

                  {/* Left-Aligned Description */}
                  <p className="text-slate-500 text-xs text-left leading-relaxed mb-4">
                    {job.desc}
                  </p>

                  {/* Max 2 Skill Tags Under Description */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.tags.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Salary */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto w-full">
                  <span className="font-extrabold text-slate-900 text-base">
                    {job.salary}
                  </span>
                </div>
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Arch Image & Decorative Dot Grids */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start pl-6 sm:pl-10 lg:pl-12">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] z-0">
              {/* Top-Left Amber Dot Grid */}
              <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-36 h-56 sm:w-44 sm:h-64 z-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 140 190" fill="none">
                  <pattern id="amber-dot-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2.5" cy="2.5" r="1.6" fill="#f59e0b" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#amber-dot-grid)" />
                </svg>
              </div>

              {/* Arch Dome Image Container */}
              <div className="w-full h-[430px] sm:h-[530px] md:h-[590px] rounded-t-[190px] sm:rounded-t-[230px] rounded-b-none overflow-hidden shadow-2xl relative z-10">
                <img
                  src="/images/landing/aboutus.jpeg"
                  alt={t('About Us - Handygig')}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>

              {/* Bottom-Right Green Dot Grid */}
              <div className="absolute -bottom-10 -right-6 sm:-bottom-14 sm:-right-8 w-36 h-44 sm:w-44 sm:h-52 z-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 140 170" fill="none">
                  <pattern id="green-dot-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2.5" cy="2.5" r="1.6" fill="#059669" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#green-dot-grid)" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Features List */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pl-0 lg:pl-4">
            <span className="inline-block px-4 py-1.5 rounded-lg bg-amber-100/70 text-amber-600 text-sm font-semibold mb-4">
              {t('Advanced Features')}
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {t('Trusted & Popular')} <br />
              {t('Job Portal')}
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-xl">
              {t('At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores')}
            </p>

            <div className="flex flex-col gap-6 w-full">
              {[
                { title: t('#1 Quality Job') },
                { title: t('Top Companies') },
                { title: t('International Jobs') },
                { title: t('No Extra Charges') },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 shrink-0 flex items-center justify-center mt-0.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg sm:text-xl">
                      {feat.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed mt-1">
                      {t('At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Platform Experience Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Features Grid */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="inline-block px-4 py-1.5 rounded-md bg-[#e6f4f1] text-[#059669] text-sm font-semibold mb-4">
              {t('Our Showcase')}
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-5">
              {t('Best Job Search platform')} <br />
              {t('Experience for you')}
            </h2>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              {t(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              )}
            </p>

            {/* 2-Column Checkmark Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10 w-full max-w-xl">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {t('Corporate Business jobs')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {t('Company Showcase')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {t('Creative Services')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {t('Easy To Upload Resume')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {t('Online E-commerce')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#059669] shrink-0 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {t('Hire Expert Candidates')}
                </span>
              </div>
            </div>

            <div>
              <Link
                href={auth.user ? '/dashboard' : '/register'}
                className="px-8 py-3.5 bg-[#059669] hover:bg-[#047857] text-white text-base font-semibold rounded-lg inline-block transition shadow-sm"
              >
                {t('Explore More Jobs')}
              </Link>
            </div>
          </div>

          {/* Right Column: Showcase Image & Floating Circular Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[540px] flex justify-center items-center">
              {/* Main Showcase Image */}
              <img
                src="/images/landing/showcase.png"
                alt={t('Platform Experience Showcase')}
                className="w-full h-auto object-contain"
              />

              {/* Floating Circular Component 1 (Top-Left) */}
              <div className="absolute top-[8%] left-[7%] sm:left-[8%] w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-xl bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 z-20 animate-bounce [animation-duration:2.5s]">
                <img
                  src="/images/landing/circular-1.jpeg"
                  alt={t('Showcase Badge 1')}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Circular Component 2 (Top-Right) */}
              <div className="absolute top-[8%] right-[10%] sm:right-[12%] w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-xl bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 z-20 animate-bounce [animation-duration:2.5s]">
                <img
                  src="/images/landing/circular-2.jpeg"
                  alt={t('Showcase Badge 2')}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Circular Component 3 (Bottom-Right/Center) */}
              <div className="absolute bottom-[8%] right-[22%] sm:right-[24%] w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-xl bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 z-20 animate-bounce [animation-duration:2.5s]">
                <img
                  src="/images/landing/circular-3.jpeg"
                  alt={t('Showcase Badge 3')}
                  className="w-full h-full object-cover"
                />
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
