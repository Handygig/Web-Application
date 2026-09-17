import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import TextInput from '../../Components/Inputs/TextInput';
import Checkbox from '../../Components/Inputs/Checkbox';
import { useTranslation } from '../../Hooks/useTranslation';
import LandingNavbar from '../../Components/Landing/LandingNavbar';

export default function Login() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen relative bg-slate-900 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-theme-accent selection:text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/landing/loginbg.png"
          alt="Handygig Login Background"
          className="w-full h-full object-cover filter brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-slate-950/60" />
      </div>

      {/* Top Navbar */}
      <LandingNavbar activePage="login" />

      {/* Organic Curved White Bottom Section (curve.png Image) */}
      <div className="absolute bottom-0 left-0 right-0 z-[1] w-full pointer-events-none leading-none">
        <img
          src="/images/landing/curve.png"
          alt="Curve Overlay"
          className="w-full h-auto object-cover object-bottom block"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Side Hero Content & Key Metrics */}
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
            {t(
              'Getting a new job is never easy. Check what new jobs we have in store for you on Handygig.'
            )}
          </p>

          <div className="flex items-center gap-10 pt-4">
            <div>
              <p className="text-4xl sm:text-5xl font-bold tracking-wide text-white">
                200<span className="text-emerald-400">M</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 tracking-wide">
                {t('Active Jobs')}
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-bold tracking-wide text-white">
                40<span className="text-emerald-400">K</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 tracking-wide">
                {t('Startups')}
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-bold tracking-wide text-white">
                340<span className="text-emerald-400">K</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 tracking-wide">
                {t('Talents')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Floating Login Box */}
        <div className="lg:col-span-5 w-full z-20">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-900 border border-slate-100 flex flex-col gap-6">
            <div className="flex flex-col text-left">
              <h1 className="text-3xl sm:text-[40px] font-bold text-[#1B2021] leading-[1.2] mb-2 tracking-tight">
                {t('Grow Your Career With')} <span className="text-theme-accent">Handygig</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <TextInput
                label={t('Email Address')}
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                placeholder={t('Search or enter email...')}
                required
              />

              <TextInput
                label={t('Password')}
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                placeholder={t('Enter your password')}
                required
              />

              <div className="flex items-center justify-between text-xs">
                <Checkbox
                  label={t('Remember me')}
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                />

                <Link
                  href="/forgot-password"
                  className="font-semibold text-theme-accent hover:text-theme-accent-hover transition"
                >
                  {t('Forgot password?')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 px-6 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white font-bold text-base transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                {processing ? t('Signing in...') : t('Sign In')}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {t("Don't have an account?")}{' '}
                <Link
                  href="/register"
                  className="font-bold text-theme-accent hover:text-theme-accent-hover transition"
                >
                  {t('Register Today')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
