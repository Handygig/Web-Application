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
  ChevronLeft,
  ChevronRight,
  MoreVertical,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(bookings.length / itemsPerPage) || 1;
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E4D9] shadow-sm overflow-hidden space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-[#F9FAF7] border-b border-[#E2E4D9] text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-6 w-44">{t('Job ID & Urgency')}</th>
              <th className="py-3.5 px-6 w-56">{t('Service & Category')}</th>
              <th className="py-3.5 px-6 w-52">{t('Customer & Location')}</th>
              <th className="py-3.5 px-6 w-48">{t('Assigned Technician')}</th>
              <th className="py-3.5 px-6 w-44">{t('Schedule Window')}</th>
              <th className="py-3.5 px-6 w-40">{t('Status')}</th>
              <th className="py-3.5 px-6 w-32 text-right">{t('Service Fee')}</th>
              <th className="py-3.5 px-6 w-36 text-right">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EA] text-sm">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-gray-300" />
                    <p>{t('No bookings found matching your search or filters.')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBookings.map((booking) => {
                const isUnassigned = !booking.assignedTech;

                return (
                  <tr
                    key={booking.id}
                    onClick={() => onViewDetails(booking)}
                    className="hover:bg-[#FAFBF7] transition-colors cursor-pointer group"
                  >
                    {/* 1. Job ID & Urgency */}
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-1.5">
                        <span className="font-mono text-xs font-bold text-[#5E6933] bg-[#EBF5EC] px-2.5 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap inline-block">
                          {booking.id}
                        </span>
                        <div>
                          <UrgencyBadge urgency={booking.urgency} />
                        </div>
                      </div>
                    </td>

                    {/* 2. Service & Category */}
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 group-hover:text-[#5E6933] transition-colors truncate max-w-[200px]" title={booking.serviceTitle}>
                          {booking.serviceTitle}
                        </p>
                        <div>
                          <CategoryBadge category={booking.category} />
                        </div>
                      </div>
                    </td>

                    {/* 3. Customer & Location */}
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-900 text-sm truncate">{booking.customerName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{booking.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium truncate max-w-[180px]">
                          <MapPin className="w-3.5 h-3.5 text-[#5E6933] shrink-0" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Assigned Tech */}
                    <td className="py-4 px-6 align-middle">
                      {isUnassigned ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAssignModal(booking);
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t('Assign Tech')}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {booking.assignedTech.avatar ? (
                            <img
                              src={booking.assignedTech.avatar}
                              alt={booking.assignedTech.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#E2E4D9]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#EBF5EC] text-[#5E6933] font-bold text-xs flex items-center justify-center border border-emerald-200">
                              {booking.assignedTech.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-xs truncate max-w-[120px]">
                              {booking.assignedTech.name}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate max-w-[120px]">
                              {booking.assignedTech.role || t('Technician')}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 5. Schedule Window */}
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-0.5 text-xs font-medium text-gray-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-900 font-semibold">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#5E6933]" />
                          <span>{booking.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{booking.scheduledTimeWindow}</span>
                        </div>
                      </div>
                    </td>

                    {/* 6. Status */}
                    <td className="py-4 px-6 align-middle">
                      <StatusBadge status={booking.status} />
                    </td>

                    {/* 7. Service Fee */}
                    <td className="py-4 px-6 align-middle text-right">
                      <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                        {booking.estimatedPrice}
                      </span>
                    </td>

                    {/* 8. Actions */}
                    <td className="py-4 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(booking);
                          }}
                          className="px-3 py-1.5 bg-white border border-[#E2E4D9] hover:bg-[#5E6933] hover:text-white hover:border-[#5E6933] text-gray-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('Details')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* TABLE FOOTER / PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F9FAF7] px-6 py-3.5 border-t border-[#E2E4D9] text-xs text-gray-600">
        <div className="whitespace-nowrap">
          {t('Showing')}{' '}
          <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span>–
          <span className="font-bold text-gray-900">
            {Math.min(currentPage * itemsPerPage, bookings.length)}
          </span>{' '}
          {t('of')} <span className="font-bold text-gray-900">{bookings.length}</span> {t('bookings')}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-[#E2E4D9] text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{t('Previous')}</span>
          </button>
          <span className="px-3 py-1 font-semibold text-gray-800">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white border border-[#E2E4D9] text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1"
          >
            <span>{t('Next')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
