import React from 'react';
import {
  MapPin,
  Phone,
  Calendar,
  Clock,
  UserPlus,
  Eye,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { StatusBadge, UrgencyBadge, CategoryBadge } from './BookingBadgeHelpers';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingList({
  bookings,
  onViewDetails,
  onOpenAssignModal,
}) {
  const { t } = useTranslation();

  if (bookings.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center text-slate-400">
        <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="font-medium">{t('No bookings found matching your criteria.')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {bookings.map((booking) => {
        const isUnassigned = !booking.assignedTech;

        return (
          <div
            key={booking.id}
            onClick={() => onViewDetails(booking)}
            className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            {/* Card Header: Job ID, Urgency, Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-lg group-hover:text-[#5E6933] transition-colors">
                    {booking.id}
                  </span>
                  <UrgencyBadge urgency={booking.urgency} />
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base line-clamp-2">
                  {booking.serviceTitle}
                </h3>
                <div className="mt-1">
                  <CategoryBadge category={booking.category} />
                </div>
              </div>
            </div>

            {/* Customer Details & Schedule */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl space-y-2 border border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{booking.customerName}</span>
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  {booking.customerPhone}
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#5E6933] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{booking.address}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {booking.scheduledDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {booking.scheduledTime}
                </span>
              </div>
            </div>

            {/* Tech & Fee Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {/* Tech Info */}
              {isUnassigned ? (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                    {t('Unassigned')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAssignModal(booking);
                    }}
                    className="p-1.5 rounded-xl bg-[#5E6933] text-white hover:opacity-90"
                    title={t('Assign Tech')}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    src={booking.assignedTech.avatar}
                    alt={booking.assignedTech.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{booking.assignedTech.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{booking.assignedTech.role}</p>
                  </div>
                </div>
              )}

              {/* Price & Action */}
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900">
                  ${booking.serviceFee.toFixed(2)}
                </span>
                <div className="text-[10px] text-slate-500 font-bold">{booking.paymentStatus}</div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
