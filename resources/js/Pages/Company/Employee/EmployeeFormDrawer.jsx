import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Camera,
  User,
  MapPin,
  Check,
  Droplets,
  Wind,
  Zap,
  Wrench,
  Layers,
  Hammer,
  Sparkles,
  Paintbrush,
  Tv,
  Shield,
  Info,
  Plus,
  Globe,
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Circle, Marker, Autocomplete } from '@react-google-maps/api';
import { useTranslation } from '@/Hooks/useTranslation';
import {
  formatSriLankanPhoneDigits,
  formatPhoneDisplay,
  validatePhone,
} from '@/Utils/phoneValidation';

const mapLibraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '240px',
  borderRadius: '1rem',
};

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };

// Dynamic Icon Resolver for Admin-Created Categories
const getCategoryIcon = (iconKey, name = '') => {
  const key = (iconKey || name || '').toLowerCase();
  if (key.includes('clean')) return Sparkles;
  if (key.includes('plumb')) return Droplets;
  if (key.includes('electr')) return Zap;
  if (key.includes('paint')) return Paintbrush;
  if (key.includes('garden') || key.includes('lawn')) return Sparkles;
  if (key.includes('appliance')) return Tv;
  if (key.includes('hvac') || key.includes('cool') || key.includes('air')) return Wind;
  if (key.includes('secur') || key.includes('cctv') || key.includes('alarm')) return Shield;
  if (key.includes('carpent') || key.includes('wood')) return Hammer;
  if (key.includes('roof')) return Layers;
  return Wrench;
};

// Fallback category catalog matching seeded admin categories if availableCategories is empty
const FALLBACK_CATEGORIES = [
  { id: '1', service_name: 'Cleaning', icon: 'cleaning', services: [] },
  { id: '2', service_name: 'Plumbing', icon: 'plumbing', services: [] },
  { id: '3', service_name: 'Electrical', icon: 'electrical', services: [{ id: 1, name: 'test sub service' }] },
  { id: '4', service_name: 'Painting', icon: 'painting', services: [] },
  { id: '5', service_name: 'Gardening', icon: 'gardening', services: [] },
  { id: '6', service_name: 'Appliances', icon: 'appliances', services: [] },
  { id: '7', service_name: 'HVAC', icon: 'hvac', services: [] },
  { id: '8', service_name: 'Security', icon: 'security', services: [] },
];

export default function EmployeeFormDrawer({
  isOpen,
  onClose,
  onSave,
  editingTech = null,
  googleMapsApiKey = '',
  availableCategories = [],
}) {
  const { t } = useTranslation();

  const isEditMode = Boolean(editingTech);
  const effectiveApiKey = googleMapsApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: effectiveApiKey,
    libraries: mapLibraries,
  });

  const [countryCode, setCountryCode] = useState('+94');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  // Active Category Selection for Two-Tier Service Selection
  const [activeCategory, setActiveCategory] = useState('');

  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);

  // Build categories directly from admin-created categories and services passed from backend
  const categoriesList = useMemo(() => {
    const rawCategories = Array.isArray(availableCategories) && availableCategories.length > 0
      ? availableCategories
      : FALLBACK_CATEGORIES;

    return rawCategories.map((cat) => {
      const catName = cat.service_name || cat.name || `Category ${cat.id}`;
      const IconComponent = getCategoryIcon(cat.icon, catName);
      const sList = Array.isArray(cat.services)
        ? cat.services.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean)
        : [];

      return {
        id: String(cat.id),
        name: catName,
        label: catName,
        icon: IconComponent,
        description: cat.description || '',
        services: sList,
      };
    });
  }, [availableCategories]);

  const activeCategoryData = useMemo(() => {
    if (!categoriesList || categoriesList.length === 0) return null;
    return categoriesList.find((c) => String(c.id) === String(activeCategory)) || categoriesList[0];
  }, [categoriesList, activeCategory]);

  const activeCategoryServices = useMemo(() => {
    return activeCategoryData?.services || [];
  }, [activeCategoryData]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    services: [],
    roleTitle: '',
    status: 'available',
    location: 'Colombo, Sri Lanka',
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    serviceRadius: 25,
    isEntireCountry: false,
    emergencyContact: '',
    certifications: '',
    avatar: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
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

        let techServices = [];
        if (Array.isArray(editingTech.services) && editingTech.services.length > 0) {
          techServices = editingTech.services;
        } else if (editingTech.specialization) {
          techServices = [editingTech.specialization];
        }

        // Set initial active category to match first service if possible
        const matchedCat = categoriesList.find((c) =>
          c.services.some((s) => techServices.includes(s)) || techServices.includes(c.label)
        );
        if (matchedCat) {
          setActiveCategory(matchedCat.id);
        } else if (categoriesList.length > 0) {
          setActiveCategory(categoriesList[0].id);
        }

        const isEntire = Boolean(
          editingTech.isEntireCountry ||
          String(editingTech.serviceRadius || '').toLowerCase().includes('entire') ||
          String(editingTech.serviceRadius || '').toLowerCase().includes('island') ||
          Number(editingTech.serviceRadius) >= 999
        );
        const lat = editingTech.latitude ? Number(editingTech.latitude) : DEFAULT_CENTER.lat;
        const lng = editingTech.longitude ? Number(editingTech.longitude) : DEFAULT_CENTER.lng;
        const radiusVal = isEntire ? 100 : (editingTech.serviceRadius ? Number(editingTech.serviceRadius) : 25);

        setFormData({
          firstName: editingTech.firstName || '',
          lastName: editingTech.lastName || '',
          email: editingTech.email || '',
          services: techServices,
          roleTitle: editingTech.roleTitle || '',
          status: editingTech.status || 'available',
          location: editingTech.location || 'Colombo, Sri Lanka',
          latitude: lat,
          longitude: lng,
          serviceRadius: radiusVal,
          isEntireCountry: isEntire,
          emergencyContact: editingTech.emergencyContact || '',
          certifications: editingTech.certifications || '',
          avatar: editingTech.avatar || '',
        });
      } else {
        setCountryCode('+94');
        setPhoneDigits('');
        setPhoneError('');
        setAvatarPreview('');

        const firstCatWithServices = categoriesList.find((c) => c.services.length > 0) || categoriesList[0];
        const initialActiveId = firstCatWithServices ? firstCatWithServices.id : '';
        const initialServices = firstCatWithServices && firstCatWithServices.services.length > 0
          ? [firstCatWithServices.services[0]]
          : [];
        const defaultRole = initialServices.length > 0
          ? `${initialServices[0]} Specialist`
          : (firstCatWithServices?.label ? `${firstCatWithServices.label} Specialist` : 'Service Specialist');

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          services: initialServices,
          roleTitle: defaultRole,
          status: 'available',
          location: 'Colombo, Sri Lanka',
          latitude: DEFAULT_CENTER.lat,
          longitude: DEFAULT_CENTER.lng,
          serviceRadius: 25,
          isEntireCountry: false,
          emergencyContact: '',
          certifications: '',
          avatar: '',
        });
        if (initialActiveId) {
          setActiveCategory(initialActiveId);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [editingTech, isOpen, categoriesList]);

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

  const toggleService = (serviceName) => {
    if (!serviceName) return;
    setFormData((prev) => {
      const exists = prev.services.includes(serviceName);
      let updatedServices;
      if (exists) {
        updatedServices = prev.services.filter((s) => s !== serviceName);
      } else {
        updatedServices = [...prev.services, serviceName];
      }

      return {
        ...prev,
        services: updatedServices,
        roleTitle: prev.roleTitle || (updatedServices.length > 0 ? `${updatedServices[0]} Specialist` : ''),
      };
    });
  };

  const selectAllInCategory = (catId) => {
    const cat = categoriesList.find((c) => String(c.id) === String(catId));
    if (!cat) return;
    setFormData((prev) => {
      const newServices = Array.from(new Set([...prev.services, ...cat.services]));
      return {
        ...prev,
        services: newServices,
      };
    });
  };

  const clearCategoryServices = (catId) => {
    const cat = categoriesList.find((c) => String(c.id) === String(catId));
    if (!cat) return;
    setFormData((prev) => {
      const remaining = prev.services.filter(
        (s) => !cat.services.includes(s) && s !== cat.label
      );
      return {
        ...prev,
        services: remaining,
      };
    });
  };

  const handleMapClick = (e) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleMarkerDragEnd = (e) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const onLoadAutocomplete = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const locName = place.formatted_address || place.name || formData.location;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location: locName,
        }));
        mapRef.current?.panTo({ lat, lng });
      }
    }
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
      specialization: formData.services[0] || 'General Repair',
      serviceRadius: formData.isEntireCountry ? 'Entire Country' : `${formData.serviceRadius} km`,
      isEntireCountry: formData.isEntireCountry,
      avatar: avatarPreview || formData.avatar || '',
      phone: fullPhone,
      roleTitle: formData.roleTitle || `${formData.services[0] || 'Service'} Specialist`,
    });

    onClose();
  };

  if (!isOpen) return null;

  const currentCenter = {
    lat: formData.isEntireCountry ? 7.8731 : (Number(formData.latitude) || DEFAULT_CENTER.lat),
    lng: formData.isEntireCountry ? 80.7718 : (Number(formData.longitude) || DEFAULT_CENTER.lng),
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
                ? t('Assign service categories, corresponding services, and map radius')
                : t('Register team member, select categories to assign services, and set coverage radius')}
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
        <form id="employee-drawer-form" onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Profile Photo Upload */}
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

          {/* TWO-TIER SERVICE SELECTION: CATEGORY -> CORRESPONDING SERVICES */}
          <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-sm font-bold text-slate-900 block">
                  {t('Assigned Services & Capabilities')} <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('Select a category to view and assign its corresponding services')}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-theme-accent/10 text-theme-accent self-start sm:self-auto shrink-0">
                {formData.services.length} {t('Services Selected')}
              </span>
            </div>

            {/* STEP 1: SERVICE CATEGORY TABS / PILLS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {t('1. Service Categories')}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {t('Select category to load services')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => {
                  const IconComponent = cat.icon || Wrench;
                  const isActive = String(activeCategory) === String(cat.id);
                  const selectedCountInCat = cat.services.filter((s) => formData.services.includes(s)).length +
                    (formData.services.includes(cat.label) ? 1 : 0);

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-theme-accent text-white border-theme-accent shadow-sm ring-2 ring-theme-accent/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{cat.label}</span>
                      {selectedCountInCat > 0 && (
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isActive ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {selectedCountInCat}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: CORRESPONDING SERVICES FOR ACTIVE CATEGORY */}
            <div className="space-y-2.5 pt-3 border-t border-slate-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    {t('2. Corresponding Services for')}
                  </span>
                  <span className="text-xs font-extrabold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-md">
                    {activeCategoryData?.label}
                  </span>
                </div>

                {activeCategoryServices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllInCategory(activeCategory)}
                      className="text-[11px] font-bold text-theme-accent hover:underline"
                    >
                      {t('Select All')}
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => clearCategoryServices(activeCategory)}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:underline"
                    >
                      {t('Clear')}
                    </button>
                  </div>
                )}
              </div>

              {/* Grid of Corresponding Services or Informative Empty State */}
              {activeCategoryServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCategoryServices.map((serviceName) => {
                    const isSelected = formData.services.includes(serviceName);

                    return (
                      <button
                        type="button"
                        key={serviceName}
                        onClick={() => toggleService(serviceName)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate pr-2">{serviceName}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center bg-white border border-dashed border-slate-200 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {t('No specific services added under :category yet', { category: activeCategoryData?.label || '' })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t('Services added by administrator under this category will automatically appear here.')}
                    </p>
                  </div>
                  {activeCategoryData?.label && (
                    <button
                      type="button"
                      onClick={() => toggleService(activeCategoryData.label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        formData.services.includes(activeCategoryData.label)
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {formData.services.includes(activeCategoryData.label) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          {t('General :category Capability Assigned', { category: activeCategoryData.label })}
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-theme-accent" />
                          {t('Assign General :category Capability', { category: activeCategoryData.label })}
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* STEP 3: CURRENTLY ASSIGNED SERVICES SUMMARY BADGES */}
            {formData.services.length > 0 && (
              <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('Total Assigned Services')} ({formData.services.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200/80">
                  {formData.services.map((srv) => (
                    <span
                      key={srv}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      <span>{srv}</span>
                      <button
                        type="button"
                        onClick={() => toggleService(srv)}
                        className="text-slate-400 hover:text-rose-600 rounded-full"
                        title={t('Remove Service')}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 block">{t('Role Title')}</label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              placeholder={t('e.g. Senior Master Plumber / Multi-Craft Specialist')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
            />
          </div>

          {/* GOOGLE MAPS SERVICE RADIUS & COUNTRY COVERAGE SECTION */}
          <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-theme-accent" />
                <h3 className="text-sm font-bold text-slate-900">{t('Service Coverage & Radius')}</h3>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5">
                {formData.isEntireCountry ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    {t('Entire Country (Island-wide)')}
                  </>
                ) : (
                  `${formData.serviceRadius} km ${t('Radius')}`
                )}
              </span>
            </div>

            {/* Option to Select Entire Country (Checkbox) */}
            <label className={`flex items-start sm:items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
              formData.isEntireCountry
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
            }`}>
              <div className="flex items-start sm:items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isEntireCountry}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isEntireCountry: e.target.checked }))}
                  className="w-4 h-4 mt-0.5 sm:mt-0 rounded text-theme-accent focus:ring-theme-accent border-slate-300 cursor-pointer accent-theme-accent shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-theme-accent" />
                    {t('Select Entire Country (Island-wide Coverage)')}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t('Employee is qualified and available to accept jobs across all districts nationwide.')}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                formData.isEntireCountry ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {formData.isEntireCountry ? t('Active') : t('Radius Mode')}
              </span>
            </label>

            {/* Base Location Search & Autocomplete */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {t('Base Location / Dispatch Center')}
              </label>
              {isLoaded ? (
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t('Search city, address, or neighborhood...')}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('e.g. Colombo, Sri Lanka')}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
                />
              )}
            </div>

            {/* Interactive Radius Slider (Disabled when Entire Country is checked) */}
            <div className={`space-y-2 transition-all ${formData.isEntireCountry ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{t('Service Radius Slider')}</span>
                <span className="text-theme-accent">
                  {formData.isEntireCountry ? t('Nationwide Coverage') : `${formData.serviceRadius} km`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                disabled={formData.isEntireCountry}
                value={formData.serviceRadius}
                onChange={(e) => setFormData({ ...formData, serviceRadius: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-theme-accent"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>1 km</span>
                <div className="flex items-center gap-1.5">
                  {[10, 25, 50, 75].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      disabled={formData.isEntireCountry}
                      onClick={() => setFormData({ ...formData, serviceRadius: preset })}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                        formData.serviceRadius === preset
                          ? 'bg-theme-accent text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset} km
                    </button>
                  ))}
                </div>
                <span>100 km</span>
              </div>
            </div>

            {/* Interactive Google Map Visualizer */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs relative">
              {formData.isEntireCountry && (
                <div className="absolute top-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-300 shadow-md flex items-center justify-between text-xs font-bold text-emerald-900 z-10">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                    <span>{t('Entire Country Coverage Active')}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {t('All Districts')}
                  </span>
                </div>
              )}
              {!isLoaded ? (
                <div className="w-full h-[240px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                  <MapPin className="w-8 h-8 text-slate-400 mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-700">
                    {loadError ? t('Google Maps preview offline') : t('Loading map coverage preview...')}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formData.isEntireCountry
                      ? t('Selected Coverage Area: Entire Country (Island-wide)')
                      : `${t('Selected Coverage Area:')} ${formData.serviceRadius} km ${t('around')} ${formData.location}`}
                  </p>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={currentCenter}
                  zoom={formData.isEntireCountry ? 7 : (formData.serviceRadius > 50 ? 9 : formData.serviceRadius > 20 ? 10 : 12)}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                  onClick={handleMapClick}
                  options={{
                    disableDefaultUI: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker
                    position={currentCenter}
                    draggable={!formData.isEntireCountry}
                    onDragEnd={handleMarkerDragEnd}
                    title={formData.isEntireCountry ? t('Nationwide Coverage') : t('Drag to relocate employee base')}
                  />
                  {!formData.isEntireCountry && (
                    <Circle
                      center={currentCenter}
                      radius={formData.serviceRadius * 1000}
                      options={{
                        fillColor: '#5E6933',
                        fillOpacity: 0.18,
                        strokeColor: '#5E6933',
                        strokeOpacity: 0.85,
                        strokeWeight: 2,
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium text-center">
              {t('Tip: Click on map or drag marker to set exact base location')}
            </p>
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

          {/* Emergency Contact */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 block">{t('Emergency Contact Details')}</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder={t('e.g. Jane Miller - +94 71 987 6543 (Spouse)')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none"
            />
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
