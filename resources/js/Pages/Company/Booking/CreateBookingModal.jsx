import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import {
  formatSriLankanPhoneDigits,
  formatPhoneDisplay,
  validatePhone,
} from '@/Utils/phoneValidation';

const getSriLankaDateString = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
};

export default function CreateBookingModal({
  isOpen,
  onClose,
  technicians = [],
  onCreateBooking,
  onSaveBooking,
  bookingToEdit = null,
}) {
  const { t } = useTranslation();

  const isEditMode = Boolean(bookingToEdit);

  // Filter only active, non-deleted technicians for assignment
  const activeTechnicians = technicians.filter(
    (tObj) => tObj.status !== 'inactive' && tObj.status !== 'deleted'
  );

  const [countryCode, setCountryCode] = useState('+94');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [formData, setFormData] = useState({
    serviceTitle: '',
    category: 'Plumbing',
    urgency: 'Normal',
    customerName: '',
    customerEmail: '',
    address: '',
    scheduledDate: getSriLankaDateString(),
    scheduledTime: '10:00 AM - 12:00 PM',
    isImmediate: false,
    assignedTechId: '',
    serviceFee: '180.00',
    paymentMethod: 'Credit Card',
    customerNotes: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (bookingToEdit) {
      // Extract country code and phone digits if present
      let rawPhone = bookingToEdit.customerPhone || '';
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

      setFormData({
        serviceTitle: bookingToEdit.serviceTitle || '',
        category: bookingToEdit.category || 'Plumbing',
        urgency: bookingToEdit.urgency || bookingToEdit.priority || 'Normal',
        customerName: bookingToEdit.customerName || '',
        customerEmail: bookingToEdit.customerEmail || '',
        address: bookingToEdit.address || '',
        scheduledDate: bookingToEdit.scheduledDate || getSriLankaDateString(),
        scheduledTime: bookingToEdit.scheduledTime || '10:00 AM - 12:00 PM',
        isImmediate: Boolean(bookingToEdit.isImmediate),
        assignedTechId: bookingToEdit.assignedTech?.id || '',
        serviceFee: bookingToEdit.serviceFee ? String(bookingToEdit.serviceFee) : '180.00',
        paymentMethod: bookingToEdit.paymentMethod || 'Credit Card',
        customerNotes: bookingToEdit.customerNotes || '',
        status: bookingToEdit.status || 'scheduled',
      });
    } else {
      setCountryCode('+94');
      setPhoneDigits('');
      setPhoneError('');
      setFormData({
        serviceTitle: '',
        category: 'Plumbing',
        urgency: 'Normal',
        customerName: '',
        customerEmail: '',
        address: '',
        scheduledDate: getSriLankaDateString(),
        scheduledTime: '10:00 AM - 12:00 PM',
        isImmediate: false,
        assignedTechId: '',
        serviceFee: '180.00',
        paymentMethod: 'Credit Card',
        customerNotes: '',
        status: 'scheduled',
      });
    }
  }, [bookingToEdit, isOpen]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validatePhone(phoneDigits, countryCode, t);
    if (err) {
      setPhoneError(err);
      return;
    }

    if (!formData.serviceTitle || !formData.customerName || !formData.customerEmail || !formData.address) {
      return;
    }

    const formattedDisplay = formatPhoneDisplay(phoneDigits, countryCode);
    const fullPhone = `${countryCode} ${formattedDisplay}`;
    const assignedTechObj = activeTechnicians.find((tObj) => tObj.id === formData.assignedTechId) || null;
    const techFullName = assignedTechObj ? (assignedTechObj.name || `${assignedTechObj.firstName || ''} ${assignedTechObj.lastName || ''}`.trim()) : null;
    const techRole = assignedTechObj ? (assignedTechObj.role || assignedTechObj.roleTitle || assignedTechObj.specialization || 'Technician') : null;

    if (isEditMode && bookingToEdit) {
      const updatedBooking = {
        ...bookingToEdit,
        serviceTitle: formData.serviceTitle,
        category: formData.category,
        urgency: formData.urgency,
        priority: formData.urgency,
        customerName: formData.customerName,
        customerPhone: fullPhone,
        customerEmail: formData.customerEmail,
        address: formData.address,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        isImmediate: formData.isImmediate,
        assignedTech: assignedTechObj
          ? {
              id: assignedTechObj.id,
              name: techFullName,
              role: techRole,
              avatar: assignedTechObj.avatar,
            }
          : null,
        status: formData.status || 'scheduled',
        serviceFee: parseFloat(formData.serviceFee) || 180.0,
        customerNotes: formData.customerNotes,
      };

      onSaveBooking?.(updatedBooking);
    } else {
      onCreateBooking?.({
        serviceTitle: formData.serviceTitle,
        category: formData.category,
        urgency: formData.urgency,
        priority: formData.urgency,
        customerName: formData.customerName,
        customerPhone: fullPhone,
        customerEmail: formData.customerEmail,
        address: formData.address,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        isImmediate: formData.isImmediate,
        assignedTech: assignedTechObj
          ? {
              id: assignedTechObj.id,
              name: techFullName,
              role: techRole,
              avatar: assignedTechObj.avatar,
            }
          : null,
        status: formData.status || 'scheduled',
        serviceFee: parseFloat(formData.serviceFee) || 180.0,
        feeBreakdown: {
          base: (parseFloat(formData.serviceFee) || 180.0) * 0.75,
          urgencySurcharge: formData.urgency === 'Emergency' ? 40.0 : 0.0,
          partsMaterials: 20.0,
        },
        paymentStatus: 'Paid',
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes,
        checklist: [
          { id: 'c1', task: 'Initial site inspection and safety checks', completed: false },
          { id: 'c2', task: `Perform ${formData.serviceTitle} work`, completed: false },
          { id: 'c3', task: 'Verify service operational quality and cleanup', completed: false },
        ],
        timeline: [
          {
            status: 'Manual Booking Created',
            time: 'Just Now',
            note: 'Job dispatched manually via Company Portal',
          },
        ],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEditMode
                ? `${t('Edit Booking')} ${bookingToEdit?.id ? `#${bookingToEdit.id.replace('#', '')}` : ''}`
                : t('Create Manual Booking')}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {isEditMode
                ? t('Update customer service job details and status')
                : t('Schedule and dispatch a new customer service job')}
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
        <form id="booking-form" onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Service Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-black block">
                {t('Service Job Title')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.serviceTitle}
                onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                placeholder={t('e.g. Emergency Pipe Leak Repair')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Category')}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              >
                <option value="Plumbing">{t('Plumbing')}</option>
                <option value="HVAC">{t('HVAC')}</option>
                <option value="Electrical">{t('Electrical')}</option>
                <option value="General Repair">{t('General Repair')}</option>
              </select>
            </div>
          </div>

          {/* Customer Name, Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">
                {t('Customer Full Name')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder={t('e.g. Sarah Jenkins')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            {/* Country Code & Numeric Phone Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">
                {t('Phone Number')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none shrink-0 cursor-pointer"
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
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none ${
                    phoneError ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-xs font-semibold text-rose-500 mt-1">{phoneError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">
                {t('Email Address')} <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder={t('sarah@example.com')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>
          </div>

          {/* Service Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black block">
              {t('Service Address / Location')} <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('742 Evergreen Terrace, Suite 4B, Downtown')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
            />
          </div>

          {/* Schedule Date, Time Window, Urgency & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Scheduled Date')}</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Time Window')}</label>
              <input
                type="text"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                placeholder={t('e.g. 10:00 AM - 12:00 PM')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Priority')}</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              >
                <option value="Emergency">{t('Emergency')}</option>
                <option value="High">{t('High')}</option>
                <option value="Normal">{t('Normal')}</option>
              </select>
            </div>
          </div>

          {/* Tech Assignment, Fee & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Assign Technician')}</label>
              <select
                value={formData.assignedTechId}
                onChange={(e) => setFormData({ ...formData, assignedTechId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              >
                <option value="">{t('-- Unassigned --')}</option>
                {activeTechnicians.map((tObj) => (
                  <option key={tObj.id} value={tObj.id}>
                    {tObj.name || `${tObj.firstName} ${tObj.lastName}`} ({tObj.role || tObj.roleTitle || tObj.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Status')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              >
                <option value="scheduled">{t('Scheduled')}</option>
                <option value="in_progress">{t('In Progress')}</option>
                <option value="pending">{t('Pending')}</option>
                <option value="completed">{t('Completed')}</option>
                <option value="canceled">{t('Canceled')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-black block">{t('Estimated Fee ($)')}</label>
              <input
                type="number"
                step="0.01"
                value={formData.serviceFee}
                onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>
          </div>

          {/* Customer Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-black block">{t('Customer Notes & Special Instructions')}</label>
            <textarea
              rows="3"
              value={formData.customerNotes}
              onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
              placeholder={t('Enter any specific details, gate codes, or issue description...')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none resize-none"
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
            form="booking-form"
            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:opacity-90 active:scale-98"
            style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
          >
            {isEditMode ? t('Save Changes') : t('+ Dispatch Booking')}
          </button>
        </div>

      </div>
    </div>
  );
}
