import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Edit2,
  Building2,
  Home,
  Hotel,
  Briefcase,
  Building,
  Layers,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const ICON_OPTIONS = [
  { name: 'Apartment', icon: Building2 },
  { name: 'House', icon: Home },
  { name: 'Hotel', icon: Hotel },
  { name: 'Office', icon: Briefcase },
  { name: 'Commercial', icon: Building },
  { name: 'Land', icon: Layers },
];

export default function PropertyTypeFormModal({
  open = false,
  propertyType = null,
  existingTypes = [],
  onClose,
  onSubmit,
  processing = false,
}) {
  const { t } = useTranslation();

  const isEditing = Boolean(propertyType?.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Apartment',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (propertyType) {
      setFormData({
        name: propertyType.name || '',
        description: propertyType.description || '',
        icon: propertyType.icon || 'Apartment',
        status: propertyType.status
          ? propertyType.status.charAt(0).toUpperCase() + propertyType.status.slice(1)
          : 'Active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'Apartment',
        status: 'Active',
      });
    }
    setErrors({});
  }, [propertyType, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    const newErrors = {};

    if (!trimmedName) {
      newErrors.name = t('Property type name is required.');
    } else {
      // Check for duplicates
      const isDuplicate = existingTypes.some(
        (pt) =>
          pt.name.toLowerCase() === trimmedName.toLowerCase() &&
          (!isEditing || pt.id !== propertyType.id)
      );

      if (isDuplicate) {
        newErrors.name = t('A property type with this name already exists.');
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (onSubmit) {
      onSubmit({
        ...formData,
        name: trimmedName,
        description: formData.description.trim(),
      });
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
            className="relative z-[100] w-full max-w-lg overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-accent/10 text-theme-accent">
                  {isEditing ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {isEditing ? t('Edit Property Type') : t('Add Property Type')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEditing
                      ? t('Modify property type settings and details.')
                      : t('Create a new property type for platform listings.')}
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
              {/* Property Type Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Property Type Name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder={t('Enter property type name')}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Description')}
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('Enter a short description...')}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {t('Property Icon / Category')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = formData.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold border transition ${
                          isSelected
                            ? 'border-theme-accent bg-theme-accent/5 text-theme-accent font-bold ring-1 ring-theme-accent'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <IconC className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Status')}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-800 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat cursor-pointer focus:border-theme-accent focus:outline-none"
                >
                  <option value="Active">{t('Active')}</option>
                  <option value="Inactive">{t('Inactive')}</option>
                </select>
              </div>

              {/* Footer */}
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
                  {isEditing ? t('Save Changes') : t('Create Property Type')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
}
