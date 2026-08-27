import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Calendar,
  Clock,
  User,
  Briefcase,
  Building,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Tag,
  Ban,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingDetailModal({
  open = false,
  booking = null,
  onClose,
  onStatusChange,
  onPromptCancel,
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!onClose || !open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open || !booking) return null;

  const status = booking.status || 'Pending';
  const isPending = status === 'Pending';
  const isConfirmed = status === 'Confirmed';
  const isCompleted = status === 'Completed';
  const isCancelled = status === 'Cancelled';

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onMouseDown={() => onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[100] w-full max-w-4xl overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.25)] border border-slate-100 transition-all my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Tag className="h-4 w-4 text-theme-accent" />
            {t('Booking Details')}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Clean & Clear Service / Property Logo */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-theme-accent text-white shadow-md ring-4 ring-white overflow-hidden">
              {booking.logo || booking.image || booking.serviceLogo || booking.providerLogo ? (
                <img
                  src={booking.logo || booking.image || booking.serviceLogo || booking.providerLogo}
                  alt={booking.propertyName || 'Service Logo'}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Building className="h-8 w-8 text-white stroke-[2]" />
              )}
            </div>

            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-bold text-slate-900">{booking.propertyName}</h2>
                {booking.id && (
                  <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-200/80 border border-slate-300/60 px-2 py-0.5 rounded-md">
                    {booking.id}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold ${
                    isPending
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : isConfirmed
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isPending
                        ? 'bg-amber-500'
                        : isConfirmed
                        ? 'bg-sky-500'
                        : isCompleted
                        ? 'bg-emerald-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{booking.bookingDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{booking.timeSlot || '10:00 AM – 12:00 PM'}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {booking.amount}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isPending && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onStatusChange) onStatusChange(booking, 'Confirmed');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition shadow-2xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t('Confirm Booking')}
              </button>
            )}

            {isConfirmed && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onStatusChange) onStatusChange(booking, 'Completed');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-2xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t('Mark Completed')}
              </button>
            )}

            {!isCancelled && !isCompleted && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onPromptCancel) onPromptCancel(booking);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition shadow-2xs"
              >
                <Ban className="h-3.5 w-3.5" />
                {t('Cancel Booking')}
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Info Cards (Customer, Provider, Property) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Customer Info Card */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              <User className="h-4 w-4 text-theme-accent" />
              {t('Customer Information')}
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 text-sm block">{booking.customerName}</span>
              <span className="text-slate-500 block truncate">{booking.customerEmail}</span>
              <span className="text-slate-500 block">{booking.customerPhone || '+94 77 123 4567'}</span>
              <span className="font-mono text-slate-400 text-[11px] block mt-1">ID: {booking.customerId || 'CUST-102'}</span>
            </div>
          </div>

          {/* Provider Info Card */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              <Briefcase className="h-4 w-4 text-theme-accent" />
              {t('Provider Information')}
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 text-sm block">{booking.providerName}</span>
              {booking.providerBusiness && (
                <span className="font-semibold text-theme-accent block">{booking.providerBusiness}</span>
              )}
              <span className="text-slate-500 block truncate">{booking.providerEmail || 'provider@example.com'}</span>
              <span className="font-mono text-slate-400 text-[11px] block mt-1">ID: {booking.providerId || 'PRV-204'}</span>
            </div>
          </div>

          {/* Service / Property Info Card */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              <Building className="h-4 w-4 text-theme-accent" />
              {t('Property / Service')}
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 text-sm block">{booking.propertyName}</span>
              <span className="text-slate-500 block">{booking.category || 'Luxury Accommodation'}</span>
              <span className="flex items-center gap-1 text-slate-500 block">
                <MapPin className="h-3 w-3 text-slate-400" />
                {booking.location || 'Colombo, Sri Lanka'}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Timeline History Log */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-theme-accent" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Booking History Timeline')}</h4>
          </div>

          <div className="space-y-3 pl-2 border-l-2 border-slate-200 text-xs">
            {(booking.history || [
              { date: booking.createdDate || 'Aug 15, 2026 – 10:30 AM', title: 'Booking created by customer' },
              { date: 'Aug 15, 2026 – 11:10 AM', title: 'Booking confirmed by provider' },
            ]).map((h, idx) => (
              <div key={idx} className="relative pl-4">
                <span className="absolute -left-[17px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-indigo-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-theme-accent" />
                </span>
                <span className="font-bold text-slate-900">{h.date}</span>
                <p className="text-slate-600 mt-0.5">{h.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
