import React, { useState, useRef, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import UnsavedChangesModal from '@/Components/Modals/UnsavedChangesModal';

export default function ProfileIndex({ user: userProp, recentActivities = [] }) {
  const { t } = useTranslation();
  const { auth, errors: pageErrors } = usePage().props;
  const fileInputRef = useRef(null);

  // Extract user model from prop or auth
  const currentUser = useMemo(() => {
    return userProp?.data || userProp || auth?.user || {};
  }, [userProp, auth?.user]);

  // Tab Navigation State: 'personal' | 'security' | 'account'
  const [activeTab, setActiveTab] = useState('personal');
  const [pendingTab, setPendingTab] = useState(null);

  // Form State
  const buildInitialFormData = (u) => ({
    fullName: u?.full_name || '',
    email: u?.email || '',
    phone: u?.phone || '',
  });

  const [savedData, setSavedData] = useState(() => buildInitialFormData(currentUser));
  const [formData, setFormData] = useState(() => buildInitialFormData(currentUser));

  // Sync state if currentUser changes from server reload
  useEffect(() => {
    const updated = buildInitialFormData(currentUser);
    setSavedData(updated);
    setFormData(updated);
    setIsDirty(false);
  }, [currentUser]);

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

  // Unsaved changes state
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Sync page errors from Inertia if any
  useEffect(() => {
    if (pageErrors && Object.keys(pageErrors).length > 0) {
      const pErrors = {};
      const pwErrors = {};
      if (pageErrors.full_name) pErrors.fullName = pageErrors.full_name;
      if (pageErrors.email) pErrors.email = pageErrors.email;
      if (pageErrors.phone) pErrors.phone = pageErrors.phone;
      if (pageErrors.avatar) setFileError(pageErrors.avatar);

      if (pageErrors.current_password) pwErrors.currentPassword = pageErrors.current_password;
      if (pageErrors.new_password) pwErrors.newPassword = pageErrors.new_password;
      if (pageErrors.new_password_confirmation) pwErrors.confirmPassword = pageErrors.new_password_confirmation;

      if (Object.keys(pErrors).length > 0) setProfileErrors(pErrors);
      if (Object.keys(pwErrors).length > 0) setPasswordErrors(pwErrors);
    }
  }, [pageErrors]);

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

  // Tab switching with unsaved changes check
  const handleTabChange = (targetTab) => {
    if (targetTab === activeTab) return;
    if (isDirty) {
      setPendingTab(targetTab);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(targetTab);
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
        month: 'long',
        day: 'numeric',
      })
    : '—';
  const lastActivityTime = recentActivities?.[0]?.formatted_time || recentActivities?.[0]?.time || t('Active now');

  return (
    <AppLayout>
      <Head title={t('My Profile')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-slate-700 animate-slideDown">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <PageHeader
          title={t('My Profile')}
          description={t('Manage your personal information and account settings.')}
        />

        {/* 1. TOP HERO PROFILE BANNER CARD */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              {/* Avatar Box */}
              <div className="relative shrink-0 group">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-theme-accent to-indigo-700 font-bold text-white text-3xl shadow-lg ring-4 ring-slate-50 overflow-hidden">
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isAvatarProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:bg-theme-accent transition disabled:opacity-50"
                  title={t('Change Photo')}
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* User Identity Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {displayStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium">{displayEmail}</p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-theme-accent border border-indigo-100">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {displayRole}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    ID: {displayUserId}
                  </span>
                </div>
              </div>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-center md:self-auto">
              <button
                type="button"
                disabled={isAvatarProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
              >
                {isAvatarProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                ) : (
                  <Camera className="h-4 w-4 text-slate-500" />
                )}
                {t('Change Photo')}
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  disabled={isAvatarProcessing}
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition shadow-2xs disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('Remove Photo')}
                </button>
              )}
            </div>
          </div>

          {fileError && (
            <p className="mt-3 text-xs font-medium text-red-500 text-center sm:text-left">
              {fileError}
            </p>
          )}
        </div>

        {/* 2. NAVIGATION SECTION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'personal', label: t('Personal Details'), icon: User },
              { id: 'security', label: t('Security & Password'), icon: KeyRound },
              { id: 'account', label: t('Account Overview & Activity'), icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? 'text-theme-accent' : 'text-slate-400'}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {isDirty && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
              {t('Unsaved changes')}
            </span>
          )}
        </div>

        {/* 3. TABBED CONTENT SECTIONS */}

        {/* TAB 1: PERSONAL DETAILS */}
        {activeTab === 'personal' && (
          <TableCard>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{t('Personal Information')}</h3>
                <p className="text-xs text-slate-500">
                  {t('Manage your basic personal profile information.')}
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Full Name')} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder={t('Enter full name')}
                        className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                          profileErrors.fullName
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 focus:border-theme-accent'
                        }`}
                      />
                    </div>
                    {profileErrors.fullName && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {profileErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Email Address')} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="admin@example.com"
                        className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                          profileErrors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 focus:border-theme-accent'
                        }`}
                      />
                    </div>
                    {profileErrors.email && (
                      <p className="mt-1 text-xs font-medium text-red-500">{profileErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Phone Number')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                    {profileErrors.phone && (
                      <p className="mt-1 text-xs font-medium text-red-500">{profileErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Save / Cancel Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4 text-slate-500" />
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {t('Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          </TableCard>
        )}

        {/* TAB 2: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <TableCard>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{t('Change Password')}</h3>
                <p className="text-xs text-slate-500">
                  {t('Ensure your account is using a long and secure password.')}
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="max-w-xl space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('Current Password')} *
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
                      className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                        passwordErrors.currentPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-200 focus:border-theme-accent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('New Password')} *
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
                      className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                        passwordErrors.newPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-200 focus:border-theme-accent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('Confirm New Password')} *
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
                      className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                        passwordErrors.confirmPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-slate-200 focus:border-theme-accent'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
                  <button
                    type="submit"
                    disabled={isPasswordSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
                  >
                    {isPasswordSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    {t('Change Password')}
                  </button>
                </div>
              </form>
            </div>
          </TableCard>
        )}

        {/* TAB 3: ACCOUNT OVERVIEW & ACTIVITY */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Metadata Card */}
            <TableCard>
              <div className="p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">{t('Account Metadata')}</h3>
                  <p className="text-xs text-slate-500">
                    {t('Overview of system roles and account permissions.')}
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('User ID')}</span>
                    <span className="font-mono font-bold text-slate-900">{displayUserId}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Role')}</span>
                    <span className="font-bold text-slate-800">{displayRole}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Account Status')}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {displayStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Created Date')}</span>
                    <span className="font-semibold text-slate-700">{createdDate}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Last Activity')}</span>
                    <span className="font-semibold text-slate-700">{lastActivityTime}</span>
                  </div>
                </div>
              </div>
            </TableCard>

            {/* Recent Activity Timeline */}
            <TableCard>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <History className="h-4 w-4 text-theme-accent" />
                  <h3 className="text-base font-bold text-slate-900">
                    {t('Recent Activity Timeline')}
                  </h3>
                </div>

                {recentActivities && recentActivities.length > 0 ? (
                  <div className="space-y-4 pl-2 border-l-2 border-slate-100 text-xs">
                    {recentActivities.map((act) => (
                      <div key={act.id || act.time} className="relative pl-4">
                        <span className="absolute -left-[17px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-indigo-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-theme-accent" />
                        </span>
                        <span className="font-bold text-slate-900">{act.time || act.formatted_time}</span>
                        <p className="text-slate-600 mt-0.5">{act.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <History className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-500">{t('No recent activity recorded yet.')}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{t('Account events and administrative changes will appear here.')}</p>
                  </div>
                )}
              </div>
            </TableCard>
          </div>
        )}
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        open={showUnsavedModal}
        onStay={() => {
          setShowUnsavedModal(false);
          setPendingTab(null);
        }}
        onLeave={() => {
          setShowUnsavedModal(false);
          setIsDirty(false);
          setFormData(savedData);
          setProfileErrors({});
          if (pendingTab) {
            setActiveTab(pendingTab);
            setPendingTab(null);
          }
        }}
      />
    </AppLayout>
  );
}
