import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import TextInput from '../../Components/Inputs/TextInput';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import { useTranslation } from '../../Hooks/useTranslation';

export default function ForgotPassword({ status }) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {t('Reset Password')}
          </h1>
          <p className="text-sm text-slate-400">
            {t(
              'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.'
            )}
          </p>
        </div>

        {status && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-lg text-center">
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextInput
            label={t('Email Address')}
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            placeholder={t('Enter your email')}
            required
          />

          <PrimaryButton loading={processing}>{t('Email Password Reset Link')}</PrimaryButton>
        </form>

        <p className="text-center text-sm text-slate-400">
          <Link
            href="/"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150"
          >
            {t('Back to Login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
