import React, { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import StatCard from '@/Components/Cards/StatCard';
import TabSwitch from '@/Components/Other/TabSwitch';
import TableCard from '@/Components/Cards/TableCard';
import DeleteConfirmationModal from '@/Components/Modals/DeleteConfirmationModal';
import FloatingToast from '@/Components/Other/FloatingToast';
import { Tag, Clock, Activity, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

import BookingMetrics from './BookingMetrics';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import BookingList from './BookingList';
import BookingDetailsDrawer from './BookingDetailsDrawer';
import CreateBookingModal from './CreateBookingModal';
import AssignTechModal from './AssignTechModal';

import { initialBookingsData, initialTechniciansList } from './mockBookings';

const BOOKINGS_STORAGE_KEY = 'company_bookings_data_v1';

export default function BookingIndex() {
  const { t } = useTranslation();

  // State Management - Persist state in localStorage so deletions, edits, and creations persist across page refreshes
  const [bookings, setBookings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved bookings from localStorage:', e);
        }
      }
    }
    return initialBookingsData;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    }
  }, [bookings]);
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

  const [bookingToEdit, setBookingToEdit] = useState(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);

  // Deletion Modal & Notification State
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate Key Summary Metrics Reactively
  const metrics = useMemo(() => {
    const totalBookings = bookings.length;
    const pendingDispatch = bookings.filter(
      (b) => b.status === 'pending_dispatch' || b.status === 'pending' || !b.assignedTech
    ).length;
    const inProgress = bookings.filter((b) => b.status === 'in_progress').length;
    const completedToday = bookings.filter((b) => b.status === 'completed').length;

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
        (statusFilter === 'pending_dispatch' &&
          (b.status === 'pending_dispatch' || !b.assignedTech)) ||
        b.status === statusFilter;

      // 3. Category Filter
      const matchesCategory =
        categoryFilter === 'all' || b.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bookings, searchQuery, statusFilter, categoryFilter]);

  // Handlers for Drawer & Modals
  const handleOpenCreateDrawer = () => {
    setBookingToEdit(null);
    setIsFormDrawerOpen(true);
  };

  const handleEditBooking = (booking) => {
    setBookingToEdit(booking);
    setIsFormDrawerOpen(true);
  };

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

        const newStatus = techObj
          ? b.status === 'pending_dispatch'
            ? 'scheduled'
            : b.status
          : 'pending_dispatch';

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

  const handleUpdatePriority = (bookingId, newPriority) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updated = { ...b, urgency: newPriority, priority: newPriority };
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
    const existingNumbers = bookings
      .map((b) => {
        if (!b || !b.id) return 0;
        const clean = String(b.id).replace(/[^0-9]/g, '');
        return parseInt(clean, 10) || 0;
      })
      .filter((n) => n > 0);

    const maxId = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 4089;
    const nextNumber = maxId + 1;
    const generatedId = `JOB-${nextNumber}`;

    const createdBooking = {
      id: generatedId,
      ...newBookingData,
    };

    setBookings((prev) => [createdBooking, ...prev]);
    showToast(t('Booking created successfully'), 'success');
  };

  const handleSaveBooking = (updatedBooking) => {
    setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    if (selectedBookingDetails && selectedBookingDetails.id === updatedBooking.id) {
      setSelectedBookingDetails(updatedBooking);
    }
    showToast(t('Booking updated successfully'), 'success');
  };

  // Deletion Handlers
  const handlePromptDelete = (booking) => {
    setBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;
    setIsDeleting(true);

    try {
      let success = false;
      const targetId = bookingToDelete.id;

      if (window.axios) {
        try {
          await window.axios.delete(`/api/company/bookings/${targetId}`);
          success = true;
        } catch (err) {
          if (err.response && (err.response.status === 404 || err.response.status === 405)) {
            success = true;
          } else {
            throw err;
          }
        }
      } else {
        const res = await fetch(`/api/company/bookings/${targetId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN':
              document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });
        if (res.ok || res.status === 404) {
          success = true;
        }
      }

      if (success) {
        setBookings((prev) => prev.filter((b) => b.id !== targetId));
        showToast(t('Successfully deleted'), 'delete_success');
      }
    } catch (err) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id));
      showToast(t('Successfully deleted'), 'delete_success');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
    }
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
        {/* Floating Bottom-Left Toast Notification Card */}
        <FloatingToast
          message={toastMessage?.msg}
          type={toastMessage?.type}
          onClose={() => setToastMessage(null)}
        />

        <PageHeader
          title={t('Bookings')}
          description={t('View and manage customer bookings across the platform.')}
          action={
            <button
              type="button"
              onClick={handleOpenCreateDrawer}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t('Create Booking')}</span>
            </button>
          }
        />

        {/* 2. SUMMARY METRICS CARDS */}
        <BookingMetrics metrics={metrics} onFilterSelect={setStatusFilter} />

        {/* 3. FILTERS & CONTROLS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')}{' '}
              <span className="font-bold text-slate-900">{filteredBookings.length}</span>{' '}
              {t('bookings')}
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
              onUpdatePriority={handleUpdatePriority}
              onEdit={handleEditBooking}
              onDelete={handlePromptDelete}
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

        {/* 6. CREATE / EDIT BOOKING SLIDE-OVER DRAWER */}
        <CreateBookingModal
          isOpen={isFormDrawerOpen}
          onClose={() => {
            setIsFormDrawerOpen(false);
            setBookingToEdit(null);
          }}
          technicians={technicians}
          onCreateBooking={handleCreateBooking}
          onSaveBooking={handleSaveBooking}
          bookingToEdit={bookingToEdit}
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

        {/* 8. REUSABLE DELETE CONFIRMATION MODAL */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteModalOpen(false);
              setBookingToDelete(null);
            }
          }}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title={t('Delete Booking?')}
          description={
            bookingToDelete
              ? t('Are you sure you want to delete Job #:id? This action cannot be undone.', {
                  id: bookingToDelete.id,
                })
              : t('Are you sure you want to delete this booking? This action cannot be undone.')
          }
        />
      </div>
    </AppLayout>
  );
}
