import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Edit2, User, Mail, Phone, MapPin, Briefcase, FileText } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import SelectInput from '@/Components/Inputs/SelectInput';

export default function ProviderFormModal({
  open = false,
  provider = null,
  categories = [],
  onClose,
  onSubmit,
  processing = false,
}) {
  const { t } = useTranslation();

  const isEditing = Boolean(provider?.id);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_category: '',
    location: '',
    bio: '',
    status: 'active',
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        full_name: provider.full_name || provider.user?.full_name || '',
        email: provider.email || provider.user?.email || '',
        phone: provider.phone || provider.user?.phone || '',
        service_category: provider.service_category || provider.service || '',
        location: provider.location || '',
        bio: provider.bio || provider.description || '',
        status:
          provider.status === 'Inactive' ||
          provider.status === 'inactive' ||
          provider.status === false
            ? 'inactive'
            : 'active',
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        service_category: categories[0] || 'Plumbing Services',
        location: 'New York, NY',
        bio: '',
        status: 'active',
      });
    }
  }, [provider, categories, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-xl overflow-visible rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {isEditing ? t('Edit Provider') : t('Add New Provider')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-normal">
              {isEditing
                ? t('Update provider details and availability.')
                : t('Register a new service provider in the system.')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition -mr-1 -mt-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('Provider Name')} *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Robert Vance"
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="provider@example.com"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                {t('Phone Number')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0199"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                {t('Service Category')}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.service_category}
                  onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                  placeholder="e.g. Electrical Services"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                {t('Location')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Chicago, IL"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>
            </div>
          </div>

          <SelectInput
            label={t('Status')}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">{t('Active')}</option>
            <option value="inactive">{t('Inactive')}</option>
          </SelectInput>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('Bio / Description')}
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief summary of experience, certifications, and skills..."
                className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover active:scale-95 disabled:opacity-50"
            >
              {isEditing ? t('Save Changes') : t('Create Provider')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
