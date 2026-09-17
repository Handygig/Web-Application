import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  UserCheck,
  UserPlus,
  CheckSquare,
  Square,
  DollarSign,
  FileText,
  Navigation,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  PlayCircle,
  CheckCircle,
  XCircle,
  History
} from 'lucide-react';
import { StatusBadge, UrgencyBadge, CategoryBadge } from './BookingBadgeHelpers';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingDetailsDrawer({
  booking,
  isOpen,
  onClose,
  technicians,
  onAssignTech,
  onUpdateStatus,
  onToggleChecklist,
}) {
  const { t } = useTranslation();

  if (!isOpen || !booking) return null;

  const isUnassigned = !booking.assignedTech;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold text-slate-900">{booking.id}</h2>
              <UrgencyBadge urgency={booking.urgency} />
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-sm font-bold text-slate-700">{booking.serviceTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Quick Action Bar for Status */}
          <div className="bg-[#EBF5EC] p-4 rounded-2xl border border-[#C6E2CB] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F4F2F]">
                {t('Current Status')}
              </span>
              <div className="mt-0.5 font-extrabold text-slate-900">
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {booking.status !== 'in_progress' && (
                <button
                  onClick={() => onUpdateStatus(booking.id, 'in_progress')}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <PlayCircle className="w-4 h-4" />
                  {t('In Progress')}
                </button>
              )}

              {booking.status !== 'completed' && (
                <button
                  onClick={() => onUpdateStatus(booking.id, 'completed')}
                  className="px-3.5 py-2 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                  style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('Mark Completed')}
                </button>
              )}

              {booking.status !== 'cancelled' && (
                <button
                  onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-rose-50 hover:text-rose-700 transition-all border border-slate-200 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  {t('Cancel')}
                </button>
              )}
            </div>
          </div>

          {/* Customer & Location Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#5E6933]" />
                {t('Customer Details')}
              </h3>

              <div className="space-y-1.5 text-sm">
                <p className="font-extrabold text-slate-900">{booking.customerName}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${booking.customerPhone}`} className="hover:underline text-slate-800">
                    {booking.customerPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${booking.customerEmail}`} className="hover:underline text-slate-800">
                    {booking.customerEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#5E6933]" />
                {t('Schedule Window')}
              </h3>

              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-slate-900">{booking.scheduledDate}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.scheduledTime}</span>
                </div>
                {booking.isImmediate && (
                  <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                    {t('Immediate Dispatch Requested')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Technician Assignment Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#5E6933]" />
                {t('Assigned Technician')}
              </h3>
              {isUnassigned && (
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t('Action Required')}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
              {isUnassigned ? (
                <div className="text-sm font-medium text-slate-500 italic">
                  {t('No technician has been dispatched yet.')}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {booking.assignedTech?.avatar_url || booking.assignedTech?.avatar || booking.assignedTech?.profile_image ? (
                    <img
                      src={booking.assignedTech.avatar_url || booking.assignedTech.avatar || booking.assignedTech.profile_image}
                      alt={booking.assignedTech.name || 'Technician'}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-theme-accent/10 text-theme-accent font-bold text-xs flex items-center justify-center shrink-0 border border-theme-accent/20">
                      {(booking.assignedTech?.name || 'Technician')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{booking.assignedTech?.name || 'Technician'}</p>
                    <p className="text-xs text-slate-500 font-medium">{booking.assignedTech?.role || t('Technician')}</p>
                  </div>
                </div>
              )}

              {/* Technician Dropdown Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={booking.assignedTech?.id || ''}
                  onChange={(e) => onAssignTech(booking.id, e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none cursor-pointer"
                >
                  <option value="">{t('-- Unassigned --')}</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          {booking.customerNotes && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                {t('Customer Notes & Instructions')}
              </h4>
              <p className="text-xs font-medium text-amber-950 leading-relaxed">
                "{booking.customerNotes}"
              </p>
            </div>
          )}

          {/* Map Preview Placeholder & Address */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#5E6933]" />
              {t('Service Location & Map Preview')}
            </h3>

            <div className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group">
              {/* Map Preview Mock Illustration */}
              <div className="h-44 bg-slate-200/80 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#5E6933_1px,transparent_1px)] [background-size:12px_12px]" />
                
                {/* Decorative Roads Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-0.5 bg-slate-300/80 rotate-12" />
                  <div className="w-full h-0.5 bg-slate-300/80 -rotate-45" />
                  <div className="h-full w-0.5 bg-slate-300/80" />
                </div>

                {/* Location Marker Pin */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="p-2.5 rounded-full bg-[#5E6933] text-white shadow-lg border-2 border-white">
                    <MapPin className="w-6 h-6 fill-white text-[#5E6933]" />
                  </div>
                  <div className="w-3 h-1 bg-slate-900/30 rounded-full blur-xs mt-1" />
                </div>

                {/* Navigation Overlay Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 line-clamp-1">{booking.address}</span>
                  <span className="font-extrabold text-[#5E6933] flex items-center gap-1 shrink-0">
                    <Navigation className="w-3.5 h-3.5" />
                    ETA ~15 min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Service Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#5E6933]" />
                {t('Field Technician Service Checklist')}
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {booking.checklist?.filter((c) => c.completed).length || 0} / {booking.checklist?.length || 0} {t('Completed')}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              {booking.checklist?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklist(booking.id, item.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                    item.completed ? 'bg-emerald-50/60 text-slate-500' : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/60'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs font-semibold leading-snug ${item.completed ? 'line-through text-slate-400' : ''}`}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary & Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#5E6933]" />
              {t('Invoice & Payment Summary')}
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between font-medium text-slate-600">
                <span>{t('Base Service Fee')}</span>
                <span className="font-bold text-slate-800">${booking.feeBreakdown?.base?.toFixed(2) || '0.00'}</span>
              </div>

              {booking.feeBreakdown?.urgencySurcharge > 0 && (
                <div className="flex justify-between font-medium text-amber-700">
                  <span>{t('Urgency Dispatch Surcharge')}</span>
                  <span className="font-bold">+${booking.feeBreakdown.urgencySurcharge.toFixed(2)}</span>
                </div>
              )}

              {booking.feeBreakdown?.partsMaterials > 0 && (
                <div className="flex justify-between font-medium text-slate-600">
                  <span>{t('Parts & Materials')}</span>
                  <span className="font-bold text-slate-800">+${booking.feeBreakdown.partsMaterials.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>{t('Total Invoice Fee')}</span>
                <span className="text-base text-[#5E6933]">${booking.serviceFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-1 font-semibold text-slate-600 text-[11px]">
                <span>{t('Payment Method')}</span>
                <span className="px-2 py-0.5 bg-slate-200/70 rounded text-slate-800">{booking.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          {booking.timeline?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#5E6933]" />
                {t('Job Activity Timeline')}
              </h3>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                {booking.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5E6933] mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{event.status}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{event.note}</p>
                      <span className="text-[10px] text-slate-400 font-semibold">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 sticky bottom-0 z-20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition-colors"
          >
            {t('Close Details')}
          </button>
        </div>

      </div>
    </div>
  );
}
