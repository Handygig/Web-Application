import React, { useState, useEffect } from 'react';
import { X, Camera, User } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import {
  formatSriLankanPhoneDigits,
  formatPhoneDisplay,
  validatePhone,
} from '@/Utils/phoneValidation';

export default function EmployeeFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingTech = null,
}) {
  const { t } = useTranslation();

  const isEditMode = Boolean(editingTech);

  const [countryCode, setCountryCode] = useState('+94');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: 'Plumbing',
    roleTitle: '',
    hourlyRate: '45.00',
    shiftAssignment: 'Morning Shift (08:00 - 16:00)',
    status: 'available',
    location: 'Main Service Hub',
    emergencyContact: '',
    certifications: '',
    avatar: '',
  });

  useEffect(() => {
    if (editingTech) {
      let rawPhone = editingTech.phone || '';
      let code = '+94';
      let digits = rawPhone;

      if (rawPhone.startsWith('+')) {
        const parts = rawPhone.split(' ');
        if (parts.length > 1) {
          code = parts[0];
          digits = parts.slice(1).join('').replace(/\D/g, '');
        } else {
          digits = rawPhone.replace(/\D/g, '');
        }
      } else {
        digits = rawPhone.replace(/\D/g, '');
      }

      if (code === '+94') {
        digits = formatSriLankanPhoneDigits(digits);
      }

      setCountryCode(code);
      setPhoneDigits(digits);
      setPhoneError('');
      setAvatarPreview(editingTech.avatar || '');

      setFormData({
        firstName: editingTech.firstName || '',
        lastName: editingTech.lastName || '',
        email: editingTech.email || '',
        specialization: editingTech.specialization || 'Plumbing',
        roleTitle: editingTech.roleTitle || '',
        hourlyRate: editingTech.hourlyRate || '45.00',
        shiftAssignment: editingTech.shiftAssignment || 'Morning Shift (08:00 - 16:00)',
        status: editingTech.status || 'available',
        location: editingTech.location || 'Main Service Hub',
        emergencyContact: editingTech.emergencyContact || '',
        certifications: editingTech.certifications || '',
        avatar: editingTech.avatar || '',
      });
    } else {
      setCountryCode('+94');
      setPhoneDigits('');
      setPhoneError('');
      setAvatarPreview('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        specialization: 'Plumbing',
        roleTitle: 'Plumbing Specialist',
        hourlyRate: '45.00',
        shiftAssignment: 'Morning Shift (08:00 - 16:00)',
        status: 'available',
        location: 'Main Service Hub',
        emergencyContact: '',
        certifications: '',
        avatar: '',
      });
    }
  }, [editingTech, isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    let inputVal = e.target.value;
    let cleanDigits = inputVal.replace(/\D/g, '');
    if (countryCode === '+94') {
      cleanDigits = formatSriLankanPhoneDigits(inputVal);
    }
    setPhoneDigits(cleanDigits);

    const err = validatePhone(cleanDigits, countryCode, t);
    if (!err) {
      setPhoneError('');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert(t('Please select a valid image file (JPEG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setAvatarPreview(dataUrl);
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      return;
    }

    const err = validatePhone(phoneDigits, countryCode, t);
    if (err) {
      setPhoneError(err);
      return;
    }

    const formattedDisplay = formatPhoneDisplay(phoneDigits, countryCode);
    const fullPhone = `${countryCode} ${formattedDisplay}`;

    onSave({
      ...formData,
      avatar: avatarPreview || formData.avatar || '',
      phone: fullPhone,
      roleTitle: formData.roleTitle || `${formData.specialization} Specialist`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEditMode ? t('Edit Technician Details') : t('Add New Field Technician')}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {isEditMode
                ? t('Update staff profile, pay rates, and shift parameters')
                : t('Register a new team member to your provider workforce')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="employee-drawer-form" onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Profile Photo Upload Drop-zone / Circular Avatar Preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl gap-3">
            <div className="relative group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Technician Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-theme-accent/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center border-2 border-white shadow-md">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
              )}
              <label
                htmlFor="avatar-upload-input"
                className="absolute bottom-0 right-0 bg-theme-accent hover:bg-theme-accent-hover text-white p-2 rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                title={t('Upload Photo')}
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center">
              <label
                htmlFor="avatar-upload-input"
                className="text-xs font-bold text-theme-accent hover:underline cursor-pointer"
              >
                {avatarPreview ? t('Change Profile Photo') : t('Upload Profile Photo')}
              </label>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {t('Supports JPEG, PNG, or WebP format')}
              </p>
            </div>
          </div>
          
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">
                {t('First Name')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. David"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">
                {t('Last Name')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Miller"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              />
            </div>
          </div>

          {/* Contact Row: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">
                {t('Phone Number')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none shrink-0 cursor-pointer"
                >
                  <option value="+94">+94 (LK)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+91">+91 (IN)</option>
                </select>
                <input
                  type="text"
                  required
                  value={formatPhoneDisplay(phoneDigits, countryCode)}
                  onChange={handlePhoneChange}
                  placeholder={t('77 123 4567')}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none ${
                    phoneError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-xs font-semibold text-rose-500 mt-1">{phoneError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">
                {t('Email Address')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="david.m@apexservices.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              />
            </div>
          </div>

          {/* Specialization & Role Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">
                {t('Primary Specialization')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                    roleTitle: `${e.target.value} Specialist`,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              >
                <option value="Plumbing">{t('Plumbing')}</option>
                <option value="HVAC">{t('HVAC')}</option>
                <option value="Electrical">{t('Electrical')}</option>
                <option value="General Repair">{t('General Repair')}</option>
                <option value="Roofing">{t('Roofing')}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">{t('Role Title')}</label>
              <input
                type="text"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                placeholder="e.g. Master Plumber"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              />
            </div>
          </div>

          {/* Hourly Rate & Shift Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">{t('Hourly Rate ($ USD)')}</label>
              <input
                type="number"
                step="0.50"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="45.00"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-900 block">{t('Shift Assignment')}</label>
              <select
                value={formData.shiftAssignment}
                onChange={(e) => setFormData({ ...formData, shiftAssignment: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
              >
                <option value="Morning Shift (08:00 - 16:00)">Morning Shift (08:00 - 16:00)</option>
                <option value="Day Shift (09:00 - 17:00)">Day Shift (09:00 - 17:00)</option>
                <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
                <option value="On-Call Duty">On-Call Duty</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>
          </div>

          {/* Service Zone Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 block">{t('Primary Service Zone / Hub Location')}</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={t('e.g. Downtown District 4')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 block">{t('Emergency Contact Details')}</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder={t('e.g. Jane Miller - +1 (555) 987-6543 (Spouse)')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
            />
          </div>

          {/* Current Status Selection */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 block">{t('Current Dispatch Status')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'available', label: t('Available'), color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                { id: 'on_shift_job', label: t('In Job'), color: 'bg-sky-50 text-sky-800 border-sky-300' },
                { id: 'on_break', label: t('On Break'), color: 'bg-amber-50 text-amber-800 border-amber-300' },
                { id: 'off_duty', label: t('Off Duty'), color: 'bg-slate-100 text-slate-700 border-slate-300' },
              ].map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setFormData({ ...formData, status: st.id })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    formData.status === st.id ? `${st.color} shadow-xs ring-2 ring-offset-1 ring-slate-400` : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Certifications & Experience */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 block">{t('Certifications & Background Notes')}</label>
            <textarea
              rows="3"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder={t('Enter license numbers, certifications, or field experience details...')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none resize-none"
            />
          </div>

        </form>

        {/* Fixed Footer Action Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 sticky bottom-0 z-20 backdrop-blur-md flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            {t('Cancel')}
          </button>
          
          <button
            type="submit"
            form="employee-drawer-form"
            className="bg-theme-accent hover:bg-theme-accent-hover px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            {isEditMode ? t('Save Changes') : t('+ Add Technician')}
          </button>
        </div>

      </div>
    </div>
  );
}
