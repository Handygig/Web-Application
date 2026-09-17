import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Droplets,
  Zap,
  Wind,
  Wrench,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingTable({
  bookings = [],
  onViewDetails,
  onOpenAssignModal,
  onUpdateStatus,
  onUpdatePriority,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [localStatuses, setLocalStatuses] = useState({});
  const [localPriorities, setLocalPriorities] = useState({});

  // Sync local status & priority tracking with bookings prop
  useEffect(() => {
    const statusMap = {};
    const priorityMap = {};
    bookings.forEach((b) => {
      statusMap[b.id] = b.status || 'scheduled';
      priorityMap[b.id] = b.urgency || b.priority || 'Normal';
    });
    setLocalStatuses(statusMap);
    setLocalPriorities(priorityMap);
  }, [bookings]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(bookings.length / itemsPerPage) || 1;
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (bookingId, newStatus) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [bookingId]: newStatus,
    }));
    if (onUpdateStatus) {
      onUpdateStatus(bookingId, newStatus);
    }
  };

  const handlePriorityChange = (bookingId, newPriority) => {
    setLocalPriorities((prev) => ({
      ...prev,
      [bookingId]: newPriority,
    }));
    if (onUpdatePriority) {
      onUpdatePriority(bookingId, newPriority);
    }
  };

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('plumb')) return <Droplets className="w-4 h-4 text-sky-500 shrink-0" />;
    if (cat.includes('electric')) return <Zap className="w-4 h-4 text-amber-500 shrink-0" />;
    if (cat.includes('hvac') || cat.includes('air') || cat.includes('heat'))
      return <Wind className="w-4 h-4 text-teal-500 shrink-0" />;
    return <Wrench className="w-4 h-4 text-slate-500 shrink-0" />;
  };

  const getPriorityConfig = (priority) => {
    const p = priority?.toLowerCase() || '';
    if (p === 'emergency') {
      return {
        label: t('Emergency'),
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dotClass: 'bg-rose-500',
      };
    }
    if (p === 'high') {
      return {
        label: t('High'),
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200/80',
        dotClass: 'bg-orange-500',
      };
    }
    return {
      label: t('Normal'),
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      dotClass: 'bg-slate-400',
    };
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return {
          label: t('Scheduled'),
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dotClass: 'bg-amber-500',
        };
      case 'in_progress':
        return {
          label: t('In Progress'),
          badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dotClass: 'bg-sky-500',
        };
      case 'pending_dispatch':
      case 'pending':
        return {
          label: t('Pending'),
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-400',
        };
      case 'completed':
        return {
          label: t('Completed'),
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dotClass: 'bg-emerald-500',
        };
      case 'cancelled':
      case 'canceled':
        return {
          label: t('Canceled'),
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dotClass: 'bg-rose-500',
        };
      default:
        return {
          label: status || t('Scheduled'),
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dotClass: 'bg-amber-500',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">{t('Job ID')}</th>
              <th className="px-6 py-4">{t('Priority')}</th>
              <th className="px-6 py-4">{t('Assigned Technician')}</th>
              <th className="px-6 py-4">{t('Category')}</th>
              <th className="px-6 py-4">{t('Customer Name')}</th>
              <th className="px-6 py-4">{t('Status')}</th>
              <th className="px-6 py-4 text-right">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p>{t('No bookings found matching your search or filters.')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBookings.map((booking) => {
                const techName = booking.assignedTech?.name || (booking.assignedTech?.firstName ? `${booking.assignedTech.firstName} ${booking.assignedTech.lastName}`.trim() : null);
                const techRole = booking.assignedTech?.role || booking.assignedTech?.roleTitle || booking.assignedTech?.specialization || t('Technician');
                const isUnassigned = !booking.assignedTech || !techName;
                const currentStatus = localStatuses[booking.id] || booking.status || 'scheduled';
                const currentPriority =
                  localPriorities[booking.id] || booking.urgency || booking.priority || 'Normal';

                const statusConfig = getStatusConfig(currentStatus);
                const priorityConfig = getPriorityConfig(currentPriority);

                const techInitials = techName
                  ? techName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'T';

                const formattedJobId = booking.id?.startsWith('#') ? booking.id : `#${booking.id}`;

                return (
                  <tr
                    key={booking.id}
                    onClick={() => onViewDetails?.(booking)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* 1. Job ID */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {formattedJobId}
                      </span>
                    </td>

                    {/* 2. Priority Column (Adjacent to Job ID) */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div
                        className="relative inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${priorityConfig.badgeClass} shadow-2xs transition-all hover:brightness-95`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${priorityConfig.dotClass}`}
                          />
                          <select
                            value={currentPriority}
                            onChange={(e) => handlePriorityChange(booking.id, e.target.value)}
                            className="bg-transparent appearance-none bg-none [background-image:none] border-none py-0 pl-0 pr-4 text-xs font-bold focus:ring-0 focus:outline-none cursor-pointer leading-tight text-inherit outline-none shadow-none"
                          >
                            <option
                              value="Emergency"
                              className="bg-white text-slate-800 font-medium"
                            >
                              {t('Emergency')}
                            </option>
                            <option value="High" className="bg-white text-slate-800 font-medium">
                              {t('High')}
                            </option>
                            <option value="Normal" className="bg-white text-slate-800 font-medium">
                              {t('Normal')}
                            </option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2.5 pointer-events-none opacity-60 shrink-0" />
                        </div>
                      </div>
                    </td>

                    {/* 3. Assigned Technician */}
                    <td className="px-6 py-4 align-middle">
                      {isUnassigned ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium italic">
                            {t('Unassigned')}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAssignModal?.(booking);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t('Assign')}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {booking.assignedTech?.avatar_url || booking.assignedTech?.avatar || booking.assignedTech?.profile_image ? (
                            <img
                              src={booking.assignedTech.avatar_url || booking.assignedTech.avatar || booking.assignedTech.profile_image}
                              alt={techName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-theme-accent/10 text-theme-accent font-bold text-xs flex items-center justify-center shrink-0 border border-theme-accent/20">
                              {techInitials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate max-w-[150px]">
                              {techName}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[150px]">
                              {techRole}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 4. Category */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-semibold">
                        {getCategoryIcon(booking.category)}
                        <span>{booking.category}</span>
                      </div>
                    </td>

                    {/* 5. Customer Name */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-bold text-slate-900 text-sm truncate max-w-[180px]">
                          {booking.customerName}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate max-w-[180px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {booking.customerEmail || 'customer@example.com'}
                          </span>
                        </div>
                        {booking.customerPhone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{booking.customerPhone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 6. Status (Interactive Dropdown Pill) */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div
                        className="relative inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.badgeClass} shadow-2xs transition-all hover:brightness-95`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${statusConfig.dotClass}`}
                          />
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className="bg-transparent appearance-none bg-none [background-image:none] border-none py-0 pl-0 pr-4 text-xs font-bold focus:ring-0 focus:outline-none cursor-pointer leading-tight text-inherit outline-none shadow-none"
                          >
                            <option
                              value="scheduled"
                              className="bg-white text-slate-800 font-medium"
                            >
                              {t('Scheduled')}
                            </option>
                            <option
                              value="in_progress"
                              className="bg-white text-slate-800 font-medium"
                            >
                              {t('In Progress')}
                            </option>
                            <option value="pending" className="bg-white text-slate-800 font-medium">
                              {t('Pending')}
                            </option>
                            <option
                              value="completed"
                              className="bg-white text-slate-800 font-medium"
                            >
                              {t('Completed')}
                            </option>
                            <option
                              value="canceled"
                              className="bg-white text-slate-800 font-medium"
                            >
                              {t('Canceled')}
                            </option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2.5 pointer-events-none opacity-60 shrink-0" />
                        </div>
                      </div>
                    </td>

                    {/* 7. Actions */}
                    <td className="px-6 py-4 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails?.(booking);
                          }}
                          title={t('View')}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit) {
                              onEdit(booking);
                            } else {
                              onViewDetails?.(booking);
                            }
                          }}
                          title={t('Edit')}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDelete) {
                              onDelete(booking);
                            }
                          }}
                          title={t('Delete')}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 px-6 py-3.5 border-t border-slate-100 text-xs text-slate-600">
        <div className="whitespace-nowrap">
          {t('Showing')}{' '}
          <span className="font-bold text-slate-900">
            {bookings.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>
          –
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * itemsPerPage, bookings.length)}
          </span>{' '}
          {t('of')} <span className="font-bold text-slate-900">{bookings.length}</span>{' '}
          {t('bookings')}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{t('Previous')}</span>
          </button>
          <span className="px-3 py-1 font-semibold text-slate-800">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-1 shadow-2xs"
          >
            <span>{t('Next')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
