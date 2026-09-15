import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Briefcase } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import SelectInput from '@/Components/Inputs/SelectInput';

export default function JobTypeFormModal({
  open = false,
  jobType = null,
  existingTypes = [],
  onClose,
  onSubmit,
}) {
  const { t } = useTranslation();

  const isEditing = Boolean(jobType?.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (jobType) {
      setFormData({
        name: jobType.name || '',
        description: jobType.description || '',
        status: jobType.status
          ? jobType.status.charAt(0).toUpperCase() + jobType.status.slice(1)
          : 'Active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Active',
      });
    }
    setErrors({});
  }, [jobType, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    const newErrors = {};

    if (!trimmedName) {
      newErrors.name = t('Job type name is required.');
    } else {
      const isDuplicate = existingTypes.some(
        (jt) =>
          jt.name.toLowerCase() === trimmedName.toLowerCase() &&
          (!isEditing || jt.id !== jobType.id)
      );

      if (isDuplicate) {
        newErrors.name = t('This job type already exists.');
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
            className="relative z-[100] w-full max-w-lg overflow-visible rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {isEditing ? t('Edit Job Type') : t('Add Job Type')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  {isEditing
                    ? t('Modify employment type details.')
                    : t('Define a new employment type category.')}
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
              {/* Job Type Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Job Type Name')} *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder={t('Enter job type name')}
                    className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent'
                    }`}
                  />
                </div>
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
                  className="block w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                />
              </div>

              {/* Status */}
              <SelectInput
                label={t('Status')}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">{t('Active')}</option>
                <option value="Inactive">{t('Inactive')}</option>
              </SelectInput>

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
                  className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-theme-accent/20 transition-all hover:bg-theme-accent-hover active:scale-95"
                >
                  {isEditing ? t('Save Changes') : t('Create Job Type')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
}
