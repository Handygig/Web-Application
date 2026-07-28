import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import TextInput from '../../Components/Inputs/TextInput';
import Checkbox from '../../Components/Inputs/Checkbox';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import { useTranslation } from '../../Hooks/useTranslation';

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
        <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        {t('Login')}
                    </h1>
                    <p className="text-sm text-slate-400">
                        {t('Welcome back! Please enter your details.')}
                    </p>
                </div>

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

                    <TextInput
                        label={t('Password')}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder={t('Enter your password')}
                        required
                    />

                    <div className="flex items-center justify-between">
                        <Checkbox
                            label={t('Remember me')}
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />

                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150"
                        >
                            {t('Forgot password?')}
                        </Link>
                    </div>

                    <PrimaryButton loading={processing}>
                        {t('Login')}
                    </PrimaryButton>
                </form>

                <p className="text-center text-sm text-slate-400">
                    {t("Don't have an account?")}{' '}
                    <Link
                        href="/register"
                        className="font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150"
                    >
                        {t('Register')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
