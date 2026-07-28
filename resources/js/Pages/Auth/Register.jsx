import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import TextInput from '../../Components/Inputs/TextInput';
import SelectInput from '../../Components/Inputs/SelectInput';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import { useTranslation } from '../../Hooks/useTranslation';

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
        { value: 'customer', label: t('Customer') },
        { value: 'provider', label: t('Service Provider') },
        { value: 'company', label: t('Company') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        {t('Register')}
                    </h1>
                    <p className="text-sm text-slate-400">
                        {t('Join us! Create your account below.')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <TextInput
                        label={t('Full Name')}
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        error={errors.full_name}
                        placeholder={t('Enter your full name')}
                        required
                    />

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
                        label={t('Phone Number')}
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        error={errors.phone}
                        placeholder={t('Enter your phone number')}
                        required
                    />

                    <SelectInput
                        label={t('I want to register as a')}
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        error={errors.role}
                        options={roleOptions}
                        placeholder={null}
                    />

                    <TextInput
                        label={t('Password')}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder={t('Create a password')}
                        required
                    />

                    <TextInput
                        label={t('Confirm Password')}
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        placeholder={t('Confirm your password')}
                        required
                    />

                    <PrimaryButton loading={processing}>
                        {t('Register')}
                    </PrimaryButton>
                </form>

                <p className="text-center text-sm text-slate-400">
                    {t('Already have an account?')}{' '}
                    <Link
                        href="/"
                        className="font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150"
                    >
                        {t('Login')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
