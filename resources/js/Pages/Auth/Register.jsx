import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import TextInput from '../../Components/Inputs/TextInput';
import SelectInput from '../../Components/Inputs/SelectInput';
import { useTranslation } from '../../Hooks/useTranslation';
import LandingNavbar from '../../Components/Landing/LandingNavbar';

export default function Register() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register');
  };

  const roleOptions = [
    { value: 'customer', label: t('Customer (Looking for Handyman)') },
    { value: 'provider', label: t('Service Provider / Individual Handyman') },
    { value: 'company', label: t('Handyman Service Company') },
  ];

  return (
    <div className="min-h-screen relative bg-slate-900 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-theme-accent selection:text-white">
      {/* Upper Hero Section with Image & Dark Overlay */}
      <div className="relative min-h-screen w-full flex flex-col justify-between">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/landing/loginbg.png"
            alt="Handygig Background"
            className="w-full h-full object-cover filter brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-slate-950/60" />
        </div>

        {/* Top Navbar */}
        <LandingNavbar activePage="register" />

        {/* Organic Curved White Bottom Section (curve.png Image) */}
        <div className="absolute bottom-0 left-0 right-0 z-[1] w-full pointer-events-none leading-none">
          <img
            src="/images/landing/curve.png"
            alt="Curve Overlay"
            className="w-full h-auto object-cover object-bottom block"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">

          {/* Left Side Tagline & Stats */}
          <div className="lg:col-span-7 text-white flex flex-col gap-6 text-left pb-8 lg:pb-0 -mt-6 lg:-mt-14">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-emerald-400"></span>
              <span className="text-emerald-400 text-sm font-semibold tracking-wider">
                {t('Get Hot & Trending Jobs')}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold tracking-wide leading-[1.12]">
              {t('Real Jobs, Real People,')}{' '}
              <span className="block text-white tracking-wide">{t('Real Success')}</span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg max-w-xl leading-relaxed tracking-wide">
              {t('Getting a new job is never easy. Check what new jobs we have in store for you on Handygig.')}
            </p>

            <div className="flex items-center gap-10 pt-4">
              <div>
                <p className="text-4xl sm:text-5xl font-bold tracking-wide text-white">
                  200<span className="text-emerald-400">M</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 tracking-wide">{t('Active Jobs')}</p>
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-bold tracking-wide text-white">
                  40<span className="text-emerald-400">K</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 tracking-wide">{t('Startups')}</p>
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-bold tracking-wide text-white">
                  340<span className="text-emerald-400">K</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 tracking-wide">{t('Talents')}</p>
              </div>
            </div>
          </div>

          {/* Right Side Floating Registration Card (Matches Login Card Width: lg:col-span-5 & Padding p-8 sm:p-10) */}
          <div className="lg:col-span-5 w-full z-20">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-900 border border-slate-100 flex flex-col gap-4">

              <div className="flex flex-col text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2021] tracking-tight">
                  {t('Create Account')}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextInput
                  label={t('Full Name')}
                  value={data.full_name}
                  onChange={(e) => setData('full_name', e.target.value)}
                  error={errors.full_name}
                  placeholder={t('Full name')}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    label={t('Email Address')}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder={t('Email')}
                    required
                  />

                  <TextInput
                    label={t('Phone Number')}
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    error={errors.phone}
                    placeholder={t('Phone')}
                    required
                  />
                </div>

                <SelectInput
                  label={t('I want to register as a')}
                  value={data.role}
                  onChange={(e) => setData('role', e.target.value)}
                  error={errors.role}
                  options={roleOptions}
                  placeholder={null}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    label={t('Password')}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder={t('Password')}
                    required
                  />

                  <TextInput
                    label={t('Confirm Password')}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    placeholder={t('Confirm')}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 px-5 mt-1 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white font-bold text-sm transition shadow-md shadow-emerald-900/20 disabled:opacity-50"
                >
                  {processing ? t('Creating Account...') : t('Create Account')}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {t('Already have an account?')}{' '}
                  <Link
                    href="/login"
                    className="font-bold text-theme-accent hover:text-theme-accent-hover transition"
                  >
                    {t('Sign In')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
