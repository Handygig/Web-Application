import React, { useState } from 'react';
import {
  UserPlus,
  Eye,
  MapPin,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';
import { StatusBadge, UrgencyBadge, CategoryBadge } from './BookingBadgeHelpers';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingTable({
  bookings,
  onViewDetails,
  onOpenAssignModal,
  onUpdateStatus,
}) {
  const { t } = useTranslation();
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-5">{t('Job ID & Service')}</th>
              <th className="py-4 px-5">{t('Customer & Location')}</th>
              <th className="py-4 px-5">{t('Assigned Technician')}</th>
              <th className="py-4 px-5">{t('Schedule & Window')}</th>
              <th className="py-4 px-5">{t('Status')}</th>
              <th className="py-4 px-5">{t('Service Fee')}</th>
              <th className="py-4 px-5 text-right">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p>{t('No bookings found matching your search or filters.')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const isUnassigned = !booking.assignedTech;

                return (
                  <tr
                    key={booking.id}
                    onClick={() => onViewDetails(booking)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* 1. Job ID & Service */}
                    <td className="py-4 px-5 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 group-hover:text-[#5E6933] transition-colors">
                            {booking.id}
                          </span>
                          <UrgencyBadge urgency={booking.urgency} />
                        </div>
                        <p className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
                          {booking.serviceTitle}
                        </p>
                        <div>
                          <CategoryBadge category={booking.category} />
                        </div>
                      </div>
                    </td>

                    {/* 2. Customer & Location */}
                    <td className="py-4 px-5 align-top">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{booking.customerName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{booking.customerPhone}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-slate-500 font-medium max-w-[200px] line-clamp-2">
                          <MapPin className="w-3.5 h-3.5 text-[#5E6933] shrink-0 mt-0.5" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Assigned Technician */}
                    <td className="py-4 px-5 align-top">
                      {isUnassigned ? (
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                            {t('Unassigned')}
                          </span>
                          <div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAssignModal(booking);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:opacity-90 active:scale-95"
                              style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              {t('Assign Tech')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.assignedTech.avatar}
                            alt={booking.assignedTech.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{booking.assignedTech.name}</p>
                            <p className="text-xs font-medium text-slate-500">
                              {booking.assignedTech.role}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenAssignModal(booking);
                              }}
                              className="text-[11px] font-bold text-[#5E6933] hover:underline mt-0.5 block"
                            >
                              {t('Reassign')}
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 4. Schedule & Window */}
                    <td className="py-4 px-5 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.scheduledTime}</span>
                        </div>
                        {booking.isImmediate && (
                          <span className="inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            {t('Immediate Dispatch')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Status Badge */}
                    <td className="py-4 px-5 align-top">
                      <StatusBadge status={booking.status} />
                    </td>

                    {/* 6. Service Fee */}
                    <td className="py-4 px-5 align-top">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          ${booking.serviceFee.toFixed(2)}
                        </span>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              booking.paymentStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : booking.paymentStatus === 'Cash on Delivery'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 7. Actions */}
                    <td className="py-4 px-5 align-top text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(booking);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('View')}</span>
                        </button>

                        <button
                          onClick={(e) => toggleMenu(e, booking.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Action Menu */}
                      {activeMenuId === booking.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-5 top-12 z-30 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 text-left text-xs font-semibold text-slate-700 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewDetails(booking);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-800"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span>{t('View Full Details')}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenAssignModal(booking);
                            }}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-[#5E6933]"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>{isUnassigned ? t('Assign Technician') : t('Reassign Technician')}</span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <div className="px-4 py-1 text-[10px] font-bold uppercase text-slate-400">
                            {t('Change Status')}
                          </div>

                          {booking.status !== 'in_progress' && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onUpdateStatus(booking.id, 'in_progress');
                              }}
                              className="w-full px-4 py-2 hover:bg-sky-50 text-sky-700 flex items-center gap-2"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>{t('Mark In Progress')}</span>
                            </button>
                          )}

                          {booking.status !== 'completed' && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onUpdateStatus(booking.id, 'completed');
                              }}
                              className="w-full px-4 py-2 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>{t('Mark Completed')}</span>
                            </button>
                          )}

                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onUpdateStatus(booking.id, 'cancelled');
                              }}
                              className="w-full px-4 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>{t('Cancel Booking')}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
