import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Calendar, Plus, UserCheck } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

import BookingMetrics from './BookingMetrics';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import BookingList from './BookingList';
import BookingCalendar from './BookingCalendar';
import BookingDetailsDrawer from './BookingDetailsDrawer';
import CreateBookingModal from './CreateBookingModal';
import AssignTechModal from './AssignTechModal';

import { initialBookingsData, initialTechniciansList } from './mockBookings';

export default function BookingIndex() {
  const { t } = useTranslation();

  // State Management
  const [bookings, setBookings] = useState(initialBookingsData);
  const [technicians] = useState(initialTechniciansList);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'list' | 'calendar'

  // Modal / Drawer State
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [bookingToAssign, setBookingToAssign] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Calculate Key Summary Metrics
  const metrics = useMemo(() => {
    const totalBookings = bookings.length + 118; // 128 total
    const pendingDispatch = bookings.filter((b) => b.status === 'pending_dispatch' || !b.assignedTech).length;
    const inProgress = bookings.filter((b) => b.status === 'in_progress').length;
    const completedToday = bookings.filter((b) => b.status === 'completed').length + 12; // 14 completed

    return {
      totalBookings,
      pendingDispatch,
      inProgress,
      completedToday,
    };
  }, [bookings]);

  // Filtered Bookings List
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.address.toLowerCase().includes(q) ||
        (b.assignedTech && b.assignedTech.name.toLowerCase().includes(q));

      // 2. Status Filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending_dispatch' && (b.status === 'pending_dispatch' || !b.assignedTech)) ||
        b.status === statusFilter;

      // 3. Category Filter
      const matchesCategory =
        categoryFilter === 'all' ||
        b.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bookings, searchQuery, statusFilter, categoryFilter]);

  // Handlers for Drawer & Modals
  const handleViewDetails = (booking) => {
    setSelectedBookingDetails(booking);
    setIsDetailsOpen(true);
  };

  const handleOpenAssignModal = (booking) => {
    setBookingToAssign(booking);
    setIsAssignModalOpen(true);
  };

  const handleAssignTech = (bookingId, techId) => {
    const techObj = technicians.find((t) => t.id === techId) || null;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        const newStatus = techObj ? (b.status === 'pending_dispatch' ? 'scheduled' : b.status) : 'pending_dispatch';

        const updated = {
          ...b,
          assignedTech: techObj
            ? {
                id: techObj.id,
                name: techObj.name,
                role: techObj.role,
                avatar: techObj.avatar,
              }
            : null,
          status: newStatus,
          timeline: [
            ...b.timeline,
            {
              status: techObj ? 'Technician Assigned' : 'Unassigned',
              time: 'Just Now',
              note: techObj ? `Assigned to ${techObj.name}` : 'Returned to dispatch queue',
            },
          ],
        };

        if (selectedBookingDetails && selectedBookingDetails.id === bookingId) {
          setSelectedBookingDetails(updated);
        }

        return updated;
      })
    );
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        const updated = {
          ...b,
          status: newStatus,
          timeline: [
            ...b.timeline,
            {
              status: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
              time: 'Just Now',
              note: `Status changed in Provider Dispatch Dashboard`,
            },
          ],
        };

        if (selectedBookingDetails && selectedBookingDetails.id === bookingId) {
          setSelectedBookingDetails(updated);
        }

        return updated;
      })
    );
  };

  const handleToggleChecklist = (bookingId, checklistItemId) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        const updatedChecklist = b.checklist.map((item) =>
          item.id === checklistItemId ? { ...item, completed: !item.completed } : item
        );

        const updated = { ...b, checklist: updatedChecklist };

        if (selectedBookingDetails && selectedBookingDetails.id === bookingId) {
          setSelectedBookingDetails(updated);
        }

        return updated;
      })
    );
  };

  const handleCreateBooking = (newBookingData) => {
    const newIdNumber = Math.max(...bookings.map((b) => parseInt(b.id.replace('JOB-', ''), 10) || 4080)) + 1;

    const createdBooking = {
      id: `JOB-${newIdNumber}`,
      ...newBookingData,
    };

    setBookings((prev) => [createdBooking, ...prev]);
  };

  return (
    <AppLayout>
      <div className="bookings-management-root mx-auto max-w-[1400px] space-y-6 pb-12">
        
        {/* 1. TOP HEADER & ACTION BAR */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('Bookings & Service Requests')}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF5EC] text-[#2F4F2F] border border-[#C6E2CB]">
                <Calendar className="w-3.5 h-3.5 text-[#4CAF50]" />
                {t('Dispatch Hub')}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {t('Track, schedule, assign technicians, and manage customer service jobs')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-md hover:opacity-90 active:scale-98"
              style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('+ Create Manual Booking')}</span>
            </button>
          </div>
        </div>

        {/* 2. SUMMARY METRIC CARDS (TOP 4 CARDS) */}
        <BookingMetrics metrics={metrics} />

        {/* 3. SEARCH, FILTER & VIEW CONTROLS */}
        <BookingFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalResults={filteredBookings.length}
        />

        {/* 4. BOOKINGS DATA VIEW (TABLE / CARDS LIST / CALENDAR) */}
        {viewMode === 'table' && (
          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onOpenAssignModal={handleOpenAssignModal}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {viewMode === 'list' && (
          <BookingList
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onOpenAssignModal={handleOpenAssignModal}
          />
        )}

        {viewMode === 'calendar' && (
          <BookingCalendar
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onOpenAssignModal={handleOpenAssignModal}
          />
        )}

        {/* 5. BOOKING DETAILS & DISPATCH DRAWER */}
        <BookingDetailsDrawer
          booking={selectedBookingDetails}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedBookingDetails(null);
          }}
          technicians={technicians}
          onAssignTech={handleAssignTech}
          onUpdateStatus={handleUpdateStatus}
          onToggleChecklist={handleToggleChecklist}
        />

        {/* 6. CREATE MANUAL BOOKING MODAL */}
        <CreateBookingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          technicians={technicians}
          onCreateBooking={handleCreateBooking}
        />

        {/* 7. QUICK ASSIGN / REASSIGN TECH MODAL */}
        <AssignTechModal
          booking={bookingToAssign}
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setBookingToAssign(null);
          }}
          technicians={technicians}
          onAssignTech={handleAssignTech}
        />

      </div>
    </AppLayout>
  );
}
