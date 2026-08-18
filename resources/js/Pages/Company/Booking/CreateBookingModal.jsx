import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, DollarSign, User, Phone, Mail, MapPin, Wrench } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function CreateBookingModal({
  isOpen,
  onClose,
  technicians,
  onCreateBooking,
}) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    serviceTitle: '',
    category: 'Plumbing',
    urgency: 'Normal',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    scheduledDate: '2026-08-15',
    scheduledTime: '10:00 AM - 12:00 PM',
    isImmediate: false,
    assignedTechId: '',
    serviceFee: '180.00',
    paymentMethod: 'Credit Card',
    customerNotes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.serviceTitle || !formData.customerName || !formData.customerPhone || !formData.address) {
      return;
    }

    const assignedTechObj = technicians.find((t) => t.id === formData.assignedTechId) || null;

    onCreateBooking({
      serviceTitle: formData.serviceTitle,
      category: formData.category,
      urgency: formData.urgency,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || `${formData.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: formData.address,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      isImmediate: formData.isImmediate,
      assignedTech: assignedTechObj
        ? {
            id: assignedTechObj.id,
            name: assignedTechObj.name,
            role: assignedTechObj.role,
            avatar: assignedTechObj.avatar,
          }
        : null,
      status: assignedTechObj ? 'scheduled' : 'pending_dispatch',
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

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{t('Create Manual Booking')}</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {t('Schedule and dispatch a new customer service job')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Service Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Service Job Title *')}</label>
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
              <label className="text-xs font-bold text-slate-700">{t('Category')}</label>
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
              <label className="text-xs font-bold text-slate-700">{t('Customer Full Name *')}</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder={t('e.g. Sarah Jenkins')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Phone Number *')}</label>
              <input
                type="text"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder={t('e.g. +1 (555) 234-9012')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Email Address')}</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder={t('sarah@example.com')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>
          </div>

          {/* Service Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t('Service Address / Location *')}</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('742 Evergreen Terrace, Suite 4B, Downtown')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
            />
          </div>

          {/* Schedule Date, Time Window & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Scheduled Date')}</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Time Window')}</label>
              <input
                type="text"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                placeholder={t('e.g. 10:00 AM - 12:00 PM')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Urgency Level')}</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              >
                <option value="Normal">{t('Normal / Standard')}</option>
                <option value="High">{t('High Priority')}</option>
                <option value="Emergency">{t('Emergency / Immediate')}</option>
              </select>
            </div>
          </div>

          {/* Tech Assignment & Service Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Assign Technician')}</label>
              <select
                value={formData.assignedTechId}
                onChange={(e) => setFormData({ ...formData, assignedTechId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
              >
                <option value="">{t('-- Dispatch Later / Unassigned --')}</option>
                {technicians.map((tObj) => (
                  <option key={tObj.id} value={tObj.id}>
                    {tObj.name} ({tObj.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t('Estimated Fee ($)')}</label>
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
            <label className="text-xs font-bold text-slate-700">{t('Customer Notes & Special Instructions')}</label>
            <textarea
              rows="3"
              value={formData.customerNotes}
              onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
              placeholder={t('Enter any specific details, gate codes, or issue description...')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              {t('Cancel')}
            </button>
            
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:opacity-90 active:scale-98"
              style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
            >
              {t('+ Dispatch Booking')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
