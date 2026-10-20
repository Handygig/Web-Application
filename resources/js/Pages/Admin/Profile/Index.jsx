import React, { useState, useRef, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  CheckCircle2,
  History,
  Save,
  RotateCcw,
  KeyRound,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';

export default function ProfileIndex({ user: userProp, recentActivities = [] }) {
  const { t } = useTranslation();
  const { auth, errors: pageErrors } = usePage().props;
  const fileInputRef = useRef(null);

  // Extract user model from prop or auth
  const currentUser = useMemo(() => {
    return userProp?.data || userProp || auth?.user || {};
  }, [userProp, auth?.user]);

  // Form State
  const buildInitialFormData = (u) => ({
    fullName: u?.full_name || '',
    email: u?.email || '',
    phone: u?.phone || '',
  });

  const [savedData, setSavedData] = useState(() => buildInitialFormData(currentUser));
  const [formData, setFormData] = useState(() => buildInitialFormData(currentUser));
  const [isDirty, setIsDirty] = useState(false);
  const [prevUser, setPrevUser] = useState(currentUser);

  // Sync state if currentUser changes from server reload
  if (currentUser !== prevUser) {
    setPrevUser(currentUser);
    const updated = buildInitialFormData(currentUser);
    setSavedData(updated);
    setFormData(updated);
    setIsDirty(false);
  }

  // Password Form State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Errors, loading & toast state
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Derived errors combining local validation and server pageErrors
  const activeProfileErrors = useMemo(() => ({
    ...profileErrors,
    ...(pageErrors?.full_name ? { fullName: pageErrors.full_name } : {}),
    ...(pageErrors?.email ? { email: pageErrors.email } : {}),
    ...(pageErrors?.phone ? { phone: pageErrors.phone } : {}),
  }), [profileErrors, pageErrors]);

  const activePasswordErrors = useMemo(() => ({
    ...passwordErrors,
    ...(pageErrors?.current_password ? { currentPassword: pageErrors.current_password } : {}),
    ...(pageErrors?.new_password ? { newPassword: pageErrors.new_password } : {}),
    ...(pageErrors?.new_password_confirmation ? { confirmPassword: pageErrors.new_password_confirmation } : {}),
  }), [passwordErrors, pageErrors]);

  const activeFileError = fileError || pageErrors?.avatar || '';

  // Handle Form Change
  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const hasChanged = Object.keys(next).some((k) => next[k] !== savedData[k]);
      setIsDirty(hasChanged);
      return next;
    });

    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Image Upload Handling
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');

    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      setFileError(t('Please select a valid image file (JPG, PNG, or WEBP).'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError(t('Image file size must be less than 5MB.'));
      return;
    }

    setIsAvatarProcessing(true);
    const data = new FormData();
    data.append('avatar', file);

    router.post(route('admin.profile.avatar'), data, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsAvatarProcessing(false);
        setToastMessage(t('Profile photo updated successfully.'));
        setTimeout(() => setToastMessage(''), 4000);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (errs) => {
        setIsAvatarProcessing(false);
        setFileError(errs?.avatar || t('Failed to upload image.'));
      },
    });
  };

  // Remove Photo Action
  const handleRemovePhoto = () => {
    if (!window.confirm(t('Are you sure you want to remove your profile photo?'))) return;

    setIsAvatarProcessing(true);
    router.delete(route('admin.profile.avatar.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsAvatarProcessing(false);
        setToastMessage(t('Profile photo removed.'));
        setTimeout(() => setToastMessage(''), 4000);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: () => {
        setIsAvatarProcessing(false);
      },
    });
  };

  // Profile Save Action
  const handleSaveProfile = (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = t('Full name is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = t('Please enter a valid email address.');
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = t('Please enter a valid email address.');
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    setIsSubmitting(true);

    router.put(
      route('admin.profile.update'),
      {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          setSavedData(formData);
          setIsDirty(false);
          setToastMessage(t('Profile updated successfully.'));
          setTimeout(() => setToastMessage(''), 4000);
        },
        onError: (errs) => {
          setIsSubmitting(false);
          const mapped = {};
          if (errs.full_name) mapped.fullName = errs.full_name;
          if (errs.email) mapped.email = errs.email;
          if (errs.phone) mapped.phone = errs.phone;
          setProfileErrors(mapped);
        },
      }
    );
  };

  // Profile Cancel Action
  const handleCancelProfile = () => {
    setFormData(savedData);
    setProfileErrors({});
    setIsDirty(false);
  };

  // Change Password Action
  const handleChangePassword = (e) => {
    e.preventDefault();

    const errors = {};

    if (!passwords.currentPassword) {
      errors.currentPassword = t('Current password is required.');
    }

    if (!passwords.newPassword) {
      errors.newPassword = t('New password is required.');
    } else if (passwords.newPassword.length < 8) {
      errors.newPassword = t('Password must be at least 8 characters long.');
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = t('Passwords do not match.');
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsPasswordSubmitting(true);

    router.put(
      route('admin.profile.password'),
      {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
        new_password_confirmation: passwords.confirmPassword,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsPasswordSubmitting(false);
          setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setToastMessage(t('Password changed successfully.'));
          setTimeout(() => setToastMessage(''), 4000);
        },
        onError: (errs) => {
          setIsPasswordSubmitting(false);
          const mapped = {};
          if (errs.current_password) mapped.currentPassword = errs.current_password;
          if (errs.new_password) mapped.newPassword = errs.new_password;
          if (errs.new_password_confirmation) mapped.confirmPassword = errs.new_password_confirmation;
          setPasswordErrors(mapped);
        },
      }
    );
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Derived user details for hero & account metadata
  const displayName = formData.fullName || currentUser.full_name || t('Administrator');
  const displayEmail = formData.email || currentUser.email || '';
  const displayStatus = currentUser.status
    ? currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)
    : t('Active');
  const displayRole = currentUser.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : t('Administrator');
  const displayUserId = currentUser.id ? `ADM-${String(currentUser.id).padStart(3, '0')}` : 'ADM-001';
  const avatarUrl = currentUser.profile_image || null;

  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';

  const createdDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Oct 2024';

  return (
    <AppLayout>
      <Head title={t('My Profile')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-3 text-xs font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Account Settings')}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {t('Manage your personal profile, authentication, and security preferences.')}
            </p>
          </div>

          {isDirty && (
            <span className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {t('Unsaved changes')}
            </span>
          )}
        </div>

        {/* MAIN BALANCED 2-COLUMN GRID (Matching page width and spacing) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (4 of 12 cols): Single Unified Identity & Account Overview Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header Decorative Banner */}
              <div className="h-28 bg-gradient-to-r from-[#0f4a2d] to-[#1e7246] relative p-4 flex justify-end items-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/20 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  {displayRole}
                </span>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-6 pt-0 relative">
                {/* Floating Avatar */}
                <div className="relative -mt-12 mb-4 inline-block">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0f4a2d] to-[#195e3a] flex items-center justify-center text-white font-black text-2xl overflow-hidden relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}

                      {isAvatarProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Camera overlay button */}
                  <button
                    type="button"
                    disabled={isAvatarProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0f4a2d] hover:bg-[#145e39] text-white flex items-center justify-center shadow-md transition disabled:opacity-50 ring-2 ring-white"
                    title={t('Change Photo')}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {/* Name & Email */}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 truncate">
                      {displayName}
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title={displayStatus} />
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {displayEmail}
                  </p>
                </div>

                {activeFileError && (
                  <p className="mt-2 text-xs font-semibold text-rose-500">
                    {activeFileError}
                  </p>
                )}

                {/* Avatar Action Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isAvatarProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition shadow-2xs text-center"
                  >
                    {t('Change Avatar')}
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      disabled={isAvatarProcessing}
                      onClick={handleRemovePhoto}
                      className="py-2 px-3 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition shadow-2xs"
                      title={t('Remove Photo')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Subtle Divider */}
                <div className="border-t border-slate-100 my-5" />

                {/* Integrated Account Overview */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('Account Overview')}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {t('Verified')}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* User ID */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90">
                      <span className="text-slate-500 font-medium">{t('Admin ID')}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(displayUserId, 'id')}
                        className="flex items-center gap-1.5 font-mono font-bold text-slate-800 hover:text-emerald-700 transition"
                        title={t('Click to copy ID')}
                      >
                        <span>{displayUserId}</span>
                        {copiedText === 'id' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90">
                      <span className="text-slate-500 font-medium">{t('Status')}</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {displayStatus}
                      </span>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {t('Member Since')}
                      </span>
                      <span className="font-semibold text-slate-700">{createdDate}</span>
                    </div>

                    {/* Access Level */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                        {t('Permissions')}
                      </span>
                      <span className="font-semibold text-slate-800">{t('Super Administrator')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (8 of 12 cols): Personal Info, Security, & Recent Audit Logs */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. PERSONAL INFORMATION CARD */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {t('Personal Information')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {t('Update your name, primary email address, and phone contact.')}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0f4a2d]">
                  <User className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Full Name')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder={t('Enter full name')}
                        className={`w-full rounded-xl border pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none transition-all ${
                          activeProfileErrors.fullName
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-200'
                            : 'border-slate-200 focus:border-[#0f4a2d] focus:ring-1 focus:ring-[#0f4a2d]/20'
                        }`}
                      />
                    </div>
                    {activeProfileErrors.fullName && (
                      <p className="mt-1 text-xs font-medium text-rose-500">
                        {activeProfileErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Email Address')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="admin@example.com"
                        className={`w-full rounded-xl border pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none transition-all ${
                          activeProfileErrors.email
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-200'
                            : 'border-slate-200 focus:border-[#0f4a2d] focus:ring-1 focus:ring-[#0f4a2d]/20'
                        }`}
                      />
                    </div>
                    {activeProfileErrors.email && (
                      <p className="mt-1 text-xs font-medium text-rose-500">
                        {activeProfileErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Phone Number')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#0f4a2d] focus:ring-1 focus:ring-[#0f4a2d]/20 focus:outline-none"
                      />
                    </div>
                    {activeProfileErrors.phone && (
                      <p className="mt-1 text-xs font-medium text-rose-500">
                        {activeProfileErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={isSubmitting || !isDirty}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t('Reset')}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0f4a2d] hover:bg-[#0c3e25] px-5 py-2 text-xs font-semibold text-white shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    {t('Save Changes')}
                  </button>
                </div>
              </form>
            </div>

            {/* 2. SECURITY & PASSWORD CARD */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {t('Security & Authentication')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {t('Update your administrator password and safeguard your login credentials.')}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0f4a2d]">
                  <KeyRound className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Current Password')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        required
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, currentPassword: e.target.value })
                        }
                        placeholder="••••••••"
                        className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none transition-all ${
                          activePasswordErrors.currentPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#0f4a2d] focus:ring-1 focus:ring-[#0f4a2d]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {activePasswordErrors.currentPassword && (
                      <p className="mt-1 text-xs font-medium text-rose-500">
                        {activePasswordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('New Password')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        required
                        value={passwords.newPassword}
                        onChange={(e) => {
                          setPasswords({ ...passwords, newPassword: e.target.value });
                          if (passwordErrors.newPassword)
                            setPasswordErrors({ ...passwordErrors, newPassword: '' });
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none transition-all ${
                          activePasswordErrors.newPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#0f4a2d] focus:ring-1 focus:ring-[#0f4a2d]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {activePasswordErrors.newPassword && (
                      <p className="mt-1 text-xs font-medium text-rose-500">
                        {activePasswordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('Confirm Password')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={passwords.confirmPassword}
                        onChange={(e) => {
                          setPasswords({ ...passwords, confirmPassword: e.target.value });
                          if (passwordErrors.confirmPassword)
                            setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none transition-all ${
                          activePasswordErrors.confirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 focus:border-[#0f4a2d] focus:ring-1 focus:ring-[#0f4a2d]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {activePasswordErrors.confirmPassword && (
                      <p className="mt-1 text-xs font-medium text-rose-500">
                        {activePasswordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>{t('Must be at least 8 characters long')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isPasswordSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    {t('Update Password')}
                  </button>
                </div>
              </form>
            </div>

            {/* 3. RECENT ACTIVITY AUDIT LOG CARD */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {t('Recent Activity Log')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {t('System logs and administrative actions executed on this account.')}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>{recentActivities?.length || 0} {t('events')}</span>
                </div>
              </div>

              {recentActivities && recentActivities.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {recentActivities.slice(0, 5).map((act, index) => (
                    <div
                      key={act.id || index}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <History className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {act.action || t('Admin Event')}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {act.time || act.formatted_time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <span>{t('No recent activity recorded')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
