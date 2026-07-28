import React from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '../../Components/Inputs/TextInput';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import { useTranslation } from '../../Hooks/useTranslation';

export default function ResetPassword({ token, email }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        {t('Set New Password')}
                    </h1>
                    <p className="text-sm text-slate-400">
                        {t('Please enter your details below to reset your password.')}
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
                        label={t('New Password')}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder={t('Enter new password')}
                        required
                    />

                    <TextInput
                        label={t('Confirm Password')}
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        placeholder={t('Confirm new password')}
                        required
                    />

                    <PrimaryButton loading={processing}>
                        {t('Reset Password')}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
