import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Edit2, User, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function CustomerFormModal({
  open = false,
  customer = null,
  onClose,
  onSubmit,
  processing = false,
}) {
  const { t } = useTranslation();

  const isEditing = Boolean(customer?.id);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    status: 'Active',
    customerType: 'Individual',
    address: '',
    city: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || customer.user?.full_name || '',
        email: customer.email || customer.user?.email || '',
        phone: customer.phone || customer.user?.phone || '',
        status: customer.status || 'Active',
        customerType: customer.customerType || 'Individual',
        address: customer.address || '',
        city: customer.city || '',
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        status: 'Active',
        customerType: 'Individual',
        address: '',
        city: '',
      });
    }
  }, [customer, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
          onMouseDown={() => onClose && onClose()}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-[100] w-full max-w-xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-accent/10 text-theme-accent">
                  {isEditing ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {isEditing ? t('Edit Customer Profile') : t('Add New Customer')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEditing ? t('Update customer account information.') : t('Register a new customer account in the system.')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Full Name')} *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
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
                      placeholder="customer@example.com"
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
                      placeholder="+1 555-0101"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('Account Status')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-800 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                  >
                    <option value="Active">{t('Active')}</option>
                    <option value="Inactive">{t('Inactive')}</option>
                    <option value="Suspended">{t('Suspended')}</option>
                    <option value="Banned">{t('Banned')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('Customer Type')}
                  </label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-800 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                  >
                    <option value="Individual">{t('Individual')}</option>
                    <option value="Business">{t('Business')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('Address')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
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
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Springfield"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
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
                  {isEditing ? t('Save Changes') : t('Create Customer')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
}
