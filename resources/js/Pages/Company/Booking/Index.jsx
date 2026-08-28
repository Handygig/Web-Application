import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import StatCard from '@/Components/Cards/StatCard';
import TabSwitch from '@/Components/Other/TabSwitch';
import TableCard from '@/Components/Cards/TableCard';
import { Tag, Clock, Activity, CheckCircle2, Plus } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

import BookingMetrics from './BookingMetrics';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import BookingList from './BookingList';
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

  const tabs = [
    { key: 'all', label: `${t('All')} (${metrics.totalBookings})` },
    { key: 'pending_dispatch', label: `${t('Pending Dispatch')} (${metrics.pendingDispatch})` },
    { key: 'in_progress', label: `${t('In Progress')} (${metrics.inProgress})` },
    { key: 'completed', label: `${t('Completed')} (${metrics.completedToday})` },
  ];

  return (
    <AppLayout>
      <Head title={t('Bookings')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Bookings')}
          description={t('View and manage customer bookings across the platform.')}
          action={
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Create Manual Booking')}
            </button>
          }
        />

        {/* 2. SUMMARY METRIC CARDS (TOP 4 CARDS) */}
        <BookingMetrics metrics={metrics} />

        {/* 3. TABS & SEARCH/FILTER CONTROLS */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <TabSwitch tabs={tabs} activeTab={statusFilter} onChange={setStatusFilter} />
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')} <span className="font-bold text-slate-900">{filteredBookings.length}</span> {t('bookings')}
            </div>
          </div>

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
        </div>

        {/* 4. BOOKINGS DATA VIEW (TABLE / CARDS LIST) */}
        <TableCard>
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
        </TableCard>

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
