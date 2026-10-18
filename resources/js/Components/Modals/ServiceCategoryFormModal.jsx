import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Layers,
  Upload,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import SelectInput from '@/Components/Inputs/SelectInput';

export default function ServiceCategoryFormModal({
  open = false,
  category = null,
  existingCategories = [],
  onClose,
  onSubmit,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const isEditing = Boolean(category?.id);

  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    status: 'Active',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      const activeState = typeof category.is_active !== 'undefined'
        ? (category.is_active ? 'Active' : 'Inactive')
        : (category.status || 'Active');

      setFormData({
        service_name: category.service_name || category.name || '',
        description: category.description || '',
        status: activeState,
      });
      setImagePreview(category.image_url || null);
    } else {
      setFormData({
        service_name: '',
        description: '',
        status: 'Active',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setRemoveImage(false);
    setErrors({});
  }, [category, open]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageFile && imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: t('Please upload a valid image file.') }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: t('Image size must be less than 2MB.') }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.service_name.trim();

    const newErrors = {};

    if (!trimmedName) {
      newErrors.service_name = t('Service category name is required.');
    } else {
      const isDuplicate = existingCategories.some(
        (c) =>
          (c.service_name || c.name || '').toLowerCase() === trimmedName.toLowerCase() &&
          (!isEditing || c.id !== category.id)
      );

      if (isDuplicate) {
        newErrors.service_name = t('This service category already exists.');
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (onSubmit) {
      onSubmit({
        service_name: trimmedName,
        name: trimmedName,
        description: formData.description.trim(),
        is_active: formData.status === 'Active',
        image: imageFile,
        remove_image: removeImage,
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
                  {isEditing ? t('Edit Service Category') : t('Add Service Category')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  {isEditing
                    ? t('Modify service category details and availability.')
                    : t('Define a new service category for mobile bookings and providers.')}
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
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Category Name')} *
                </label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.service_name}
                    onChange={(e) => {
                      setFormData({ ...formData, service_name: e.target.value });
                      if (errors.service_name) setErrors({ ...errors, service_name: '' });
                    }}
                    placeholder={t('e.g. Cleaning, Plumbing, Electrical')}
                    className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none transition-all ${
                      errors.service_name
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent'
                    }`}
                  />
                </div>
                {errors.service_name && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.service_name}</p>
                )}
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('Category Image / Icon')}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative flex items-center gap-4 rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-16 w-16 rounded-lg object-cover border border-slate-200 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">
                        {imageFile ? imageFile.name : t('Current Image')}
                      </p>
                      {imageFile && (
                        <p className="text-[11px] text-slate-400">
                          {(imageFile.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-semibold text-theme-accent hover:underline"
                        >
                          {t('Change')}
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                        >
                          <Trash2 className="h-3 w-3" />
                          {t('Remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-slate-200 p-5 hover:border-theme-accent hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {t('Click to upload category image')}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {t('PNG, JPG, WEBP, or SVG up to 2MB')}
                    </span>
                  </button>
                )}

                {errors.image && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.image}</p>
                )}
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
                  placeholder={t('Explain the scope of services under this category...')}
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
                  {isEditing ? t('Save Changes') : t('Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;
}
