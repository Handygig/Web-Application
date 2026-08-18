import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, UserCheck, AlertTriangle } from 'lucide-react';
import { StatusBadge, UrgencyBadge } from './BookingBadgeHelpers';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingCalendar({ bookings, onViewDetails, onOpenAssignModal }) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState('2026-08-15');

  // Time slots for dispatch schedule view
  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#5E6933]" />
            <span>{t('Dispatch Calendar Schedule')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {t('View and manage daily technician job assignments timeline')}
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSelectedDate('2026-08-14')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === '2026-08-14' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            {t('Yesterday')}
          </button>
          <button
            onClick={() => setSelectedDate('2026-08-15')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === '2026-08-15'
                ? 'bg-[#5E6933] text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            {t('Today (Aug 15)')}
          </button>
          <button
            onClick={() => setSelectedDate('2026-08-16')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDate === '2026-08-16' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            {t('Tomorrow')}
          </button>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-4">
        {timeSlots.map((slot) => {
          // Find matching bookings for this slot window
          const slotBookings = bookings.filter((b) => {
            const timeStr = b.scheduledTime.toUpperCase();
            const slotHourStr = slot.split(':')[0]; // e.g. "08" or "09"
            const slotPeriod = slot.split(' ')[1]; // "AM" or "PM"
            return timeStr.includes(slotHourStr) && timeStr.includes(slotPeriod);
          });

          return (
            <div key={slot} className="flex items-start gap-4 group">
              {/* Time slot column */}
              <div className="w-24 shrink-0 pt-1 text-right">
                <span className="text-xs font-extrabold text-slate-500">{slot}</span>
              </div>

              {/* Slot Content */}
              <div className="flex-1 min-h-[70px] bg-slate-50/60 rounded-2xl border border-slate-200/60 p-3 space-y-2 group-hover:border-slate-300 transition-colors">
                {slotBookings.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-1">
                    {t('No scheduled jobs for this time window')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {slotBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => onViewDetails(b)}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-[#5E6933] transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-900">{b.id}</span>
                            <UrgencyBadge urgency={b.urgency} />
                          </div>
                          <StatusBadge status={b.status} />
                        </div>

                        <p className="font-bold text-xs text-slate-800 line-clamp-1">
                          {b.serviceTitle}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span className="truncate">{b.customerName}</span>
                          <span className="font-bold text-slate-900">${b.serviceFee.toFixed(2)}</span>
                        </div>

                        {/* Tech info */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          {b.assignedTech ? (
                            <span className="font-bold text-[#5E6933] flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              {b.assignedTech.name}
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAssignModal(b);
                              }}
                              className="text-rose-600 font-extrabold flex items-center gap-1 hover:underline"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {t('Needs Dispatch')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
