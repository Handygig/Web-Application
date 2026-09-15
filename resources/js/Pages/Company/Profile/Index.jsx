import React, { useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Building,
  MapPin,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Save,
  RotateCcw,
  Camera,
  Trash2,
  CheckCircle2,
  History,
  KeyRound,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Briefcase,
  Users,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import UnsavedChangesModal from '@/Components/Modals/UnsavedChangesModal';

const INITIAL_COMPANY_PROFILE = {
  companyId: 'CMP-8901',
  companyName: 'Apex Home & Repair Services',
  registrationNumber: 'REG-2024-8901',
  email: 'contact@apexrepairs.com',
  phone: '+94 11 234 5678',
  website: 'https://apexrepairs.example.com',
  category: 'General Maintenance & Repair',
  address: '142 Galle Road',
  city: 'Colombo',
  province: 'Western Province',
  postalCode: '00300',
  country: 'Sri Lanka',
  description:
    'Premier home maintenance, electrical, plumbing, and HVAC service provider serving Western Province.',
  status: 'Active',
  verificationStatus: 'Verified Service Provider',
  avatarUrl: null,
  createdDate: 'January 10, 2026',
  lastLogin: 'Today, 02:15 PM',
  activeEmployees: 18,
  activeServices: 12,
};

export default function ProfileIndex() {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const fileInputRef = useRef(null);

  // Active Tab Navigation State: 'company' | 'address' | 'security' | 'account'
  const [activeTab, setActiveTab] = useState('company');

  // Initialized data with Auth fallback
  const initialData = {
    ...INITIAL_COMPANY_PROFILE,
    companyName: auth?.user?.name || INITIAL_COMPANY_PROFILE.companyName,
    email: auth?.user?.email || INITIAL_COMPANY_PROFILE.email,
  };

  // Pure Frontend Local State Management
  const [profile, setProfile] = useState(initialData);
  const [formData, setFormData] = useState(initialData);

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

  // Errors & Toast state
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Unsaved changes state
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Handle Form Change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Image Upload Handling (Frontend-Only File Reader / Preview)
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');

    // Format check
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      setFileError(t('Please select a valid image file (JPG, PNG, or WEBP).'));
      return;
    }

    // Size check (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError(t('Image file size must be less than 5MB.'));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatarUrl: previewUrl }));
    setProfile((prev) => ({ ...prev, avatarUrl: previewUrl }));
    setIsDirty(true);

    setToastMessage(t('Company logo updated successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: null }));
    setProfile((prev) => ({ ...prev, avatarUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsDirty(true);

    setToastMessage(t('Company logo removed.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Profile Save Action
  const handleSaveProfile = (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.companyName.trim()) {
      errors.companyName = t('Company name is required.');
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
    setProfile(formData);
    setIsDirty(false);

    setToastMessage(t('Company profile updated successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Profile Cancel Action
  const handleCancelProfile = () => {
    setFormData(profile);
    setProfileErrors({});
    setIsDirty(false);
  };

  // Change Password Action
  const handleChangePassword = (e) => {
    e.preventDefault();

    const errors = {};

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
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

    setToastMessage(t('Password changed successfully.'));
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Calculate initials
  const initials = profile.companyName
    ? profile.companyName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AP';

  return (
    <AppLayout>
      <Head title={t('Company Profile')} />

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
          title={t('Company Profile')}
          description={t('Manage your business profile, operating location, and account settings.')}
        />

        {/* 1. TOP HERO PROFILE BANNER CARD */}
        <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              {/* Avatar Box */}
              <div className="relative shrink-0 group">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-theme-accent to-indigo-700 font-bold text-white text-3xl shadow-lg ring-4 ring-slate-50 overflow-hidden">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt={profile.companyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:bg-theme-accent transition"
                  title={t('Change Logo')}
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

              {/* Company Identity Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900">{profile.companyName}</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {profile.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium">{profile.email}</p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-theme-accent border border-indigo-100">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {profile.verificationStatus}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    ID: {profile.companyId}
                  </span>
                </div>
              </div>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-center md:self-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              >
                <Camera className="h-4 w-4 text-slate-500" />
                {t('Change Logo')}
              </button>

              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition shadow-2xs"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('Remove Logo')}
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

        {/* 2. ORGANIZED NAVIGATION SECTION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'company', label: t('Company Details'), icon: Building },
              { id: 'address', label: t('Location & Address'), icon: MapPin },
              { id: 'security', label: t('Security & Password'), icon: KeyRound },
              { id: 'account', label: t('Account Overview & Activity'), icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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

        {/* TAB 1: COMPANY DETAILS */}
        {activeTab === 'company' && (
          <TableCard>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{t('Company Details')}</h3>
                <p className="text-xs text-slate-500">
                  {t('Manage your business profile, service categories, and contact information.')}
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Company Name')} *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                          profileErrors.companyName
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-200 focus:border-theme-accent'
                        }`}
                      />
                    </div>
                    {profileErrors.companyName && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {profileErrors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Business Registration Number */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Business Registration Number')}
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => handleChange('registrationNumber', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none font-mono"
                      />
                    </div>
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
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Contact Phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Official Website')}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Service Category */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Primary Service Category')}
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                      <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-slate-800 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                      >
                        <option value="General Maintenance & Repair">
                          {t('General Maintenance & Repair')}
                        </option>
                        <option value="Electrical Services">{t('Electrical Services')}</option>
                        <option value="Plumbing Services">{t('Plumbing Services')}</option>
                        <option value="Cleaning & Sanitation">{t('Cleaning & Sanitation')}</option>
                        <option value="HVAC & Appliance Repair">
                          {t('HVAC & Appliance Repair')}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Business Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Business Description')}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Save / Cancel Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RotateCcw className="h-4 w-4 text-slate-500" />
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover active:scale-95"
                  >
                    <Save className="h-4 w-4" />
                    {t('Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          </TableCard>
        )}

        {/* TAB 2: LOCATION & ADDRESS */}
        {activeTab === 'address' && (
          <TableCard>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {t('Headquarters & Operating Address')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Update primary location and operational address details.')}
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Street Address')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('City')}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('State / Province')}
                    </label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => handleChange('province', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Postal Code')}
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      {t('Country')}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RotateCcw className="h-4 w-4 text-slate-500" />
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover active:scale-95"
                  >
                    <Save className="h-4 w-4" />
                    {t('Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          </TableCard>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <TableCard>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{t('Change Password')}</h3>
                <p className="text-xs text-slate-500">
                  {t('Ensure your company account is using a long and secure password.')}
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="max-w-xl space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('Current Password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
                  >
                    <Lock className="h-4 w-4" />
                    {t('Change Password')}
                  </button>
                </div>
              </form>
            </div>
          </TableCard>
        )}

        {/* TAB 4: ACCOUNT OVERVIEW & ACTIVITY */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Metadata Card */}
            <TableCard>
              <div className="p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">{t('Account Metadata')}</h3>
                  <p className="text-xs text-slate-500">
                    {t('Overview of company credentials and system stats.')}
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Company ID')}</span>
                    <span className="font-mono font-bold text-slate-900">{profile.companyId}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Registration No')}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {profile.registrationNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Account Status')}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {profile.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Verification Status')}</span>
                    <span className="font-bold text-theme-accent bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {profile.verificationStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Active Employees')}</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {profile.activeEmployees}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">
                      {t('Active Service Listings')}
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {profile.activeServices}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Created Date')}</span>
                    <span className="font-semibold text-slate-700">{profile.createdDate}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-slate-500 font-medium">{t('Last Active')}</span>
                    <span className="font-semibold text-slate-700">{profile.lastLogin}</span>
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

                <div className="space-y-4 pl-2 border-l-2 border-slate-100 text-xs">
                  {[
                    {
                      time: t('Today, 10:15 AM'),
                      title: t('Logged into company management portal'),
                    },
                    {
                      time: t('Yesterday, 03:40 PM'),
                      title: t('Updated operating headquarters address'),
                    },
                    {
                      time: t('Aug 20, 2026'),
                      title: t('Added 2 new employee technician accounts'),
                    },
                    {
                      time: t('Aug 15, 2026'),
                      title: t('Company profile verified by system administrator'),
                    },
                  ].map((act, idx) => (
                    <div key={idx} className="relative pl-4">
                      <span className="absolute -left-[17px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-indigo-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-theme-accent" />
                      </span>
                      <span className="font-bold text-slate-900">{act.time}</span>
                      <p className="text-slate-600 mt-0.5">{act.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TableCard>
          </div>
        )}
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        open={showUnsavedModal}
        onStay={() => setShowUnsavedModal(false)}
        onLeave={() => {
          setShowUnsavedModal(false);
          setIsDirty(false);
        }}
      />
    </AppLayout>
  );
}
