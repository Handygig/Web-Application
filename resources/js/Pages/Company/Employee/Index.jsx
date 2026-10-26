import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import StatCard from '@/Components/Cards/StatCard';
import TableCard from '@/Components/Cards/TableCard';
import DeleteConfirmationModal from '@/Components/Modals/DeleteConfirmationModal';
import FloatingToast from '@/Components/Other/FloatingToast';
import {
  Users,
  Clock,
  Star,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Phone,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  Zap,
  Droplets,
  Wind,
  Wrench,
  Layers,
  Hammer,
  Sparkles,
  Paintbrush,
  MapPin,
  Globe,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

import EmployeeDetailsDrawer from './EmployeeDetailsDrawer';
import EmployeeFormDrawer from './EmployeeFormDrawer';
import { useCompanyTechnicians } from '@/Hooks/useCompanyTechnicians';

export default function EmployeeIndex({ serviceCategories = [], googleMapsApiKey = '' }) {
  const { t } = useTranslation();
  const { flash } = usePage().props;

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (flash?.success) {
      const timer = setTimeout(() => showToast(flash.success, 'success'), 0);
      return () => clearTimeout(timer);
    } else if (flash?.error) {
      const timer = setTimeout(() => showToast(flash.error, 'error'), 0);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Initial technicians dataset (no hourly rate, no shift assignment, supports multiple services & Google Map radius)
  const initialTechnicians = [
    {
      id: 'TECH-101',
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.m@apexservices.com',
      phone: '+94 77 234 5678',
      specialization: 'Electrical',
      services: ['test sub service'],
      roleTitle: 'Master Electrician',
      status: 'on_shift_job', // 'on_shift_job', 'available', 'off_duty', 'on_break'
      activeAssignment: 'JOB-4089',
      serviceRadius: 25,
      latitude: 6.9271,
      longitude: 79.8612,
      rating: 4.9,
      completedJobs: 142,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 04, Sri Lanka',
      joinedDate: 'Jan 2024',
      emergencyContact: 'Sarah Miller — +94 71 987 1234 (Spouse)',
      certifications: 'Electrical Safety License #LK-884.',
      recentJobs: [
        { id: 'JOB-4089', client: 'Sarah Jenkins', service: 'test sub service', status: 'In Progress', date: 'Today' },
        { id: 'JOB-4055', client: 'Michael Scott', service: 'Circuit Inspection', status: 'Completed', date: 'Yesterday' },
        { id: 'JOB-4012', client: 'Pam Beesly', service: 'test sub service', status: 'Completed', date: '3 days ago' },
      ],
    },
    {
      id: 'TECH-102',
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.r@apexservices.com',
      phone: '+94 77 876 5432',
      specialization: 'Electrical',
      services: ['test sub service'],
      roleTitle: 'Lead HVAC Specialist',
      status: 'on_shift_job',
      activeAssignment: 'JOB-4084',
      serviceRadius: 30,
      latitude: 6.9319,
      longitude: 79.8478,
      rating: 4.85,
      completedJobs: 98,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 03, Sri Lanka',
      joinedDate: 'Mar 2024',
      emergencyContact: 'Carlos Rivera — +94 71 321 7654 (Brother)',
      certifications: 'EPA Universal HVAC Certification, NATE Certified.',
      recentJobs: [
        { id: 'JOB-4084', client: 'Robert Chen', service: 'HVAC Unit Diagnostics & Tune-up', status: 'In Progress', date: 'Today' },
        { id: 'JOB-4040', client: 'Jim Halpert', service: 'Central AC Refrigerant Refill', status: 'Completed', date: '2 days ago' },
      ],
    },
    {
      id: 'TECH-103',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.w@apexservices.com',
      phone: '+94 77 345 6789',
      specialization: 'Electrical',
      services: ['Electrical', 'General Repair', 'Roofing'],
      roleTitle: 'Master Electrician',
      status: 'available',
      activeAssignment: null,
      serviceRadius: 20,
      latitude: 6.9147,
      longitude: 79.8731,
      rating: 4.95,
      completedJobs: 176,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 07, Sri Lanka',
      joinedDate: 'Nov 2023',
      emergencyContact: 'Martha Wilson — +94 71 876 1234 (Mother)',
      certifications: 'Commercial Master Electrician License #EL-9901.',
      recentJobs: [
        { id: 'JOB-4081', client: 'Marcus Brody', service: 'Commercial Electrical Panel Upgrade', status: 'Scheduled', date: 'Today, 2:30 PM' },
        { id: 'JOB-4029', client: 'Angela Martin', service: 'Lighting Circuit Installation', status: 'Completed', date: '4 days ago' },
      ],
    },
    {
      id: 'TECH-104',
      firstName: 'Sam',
      lastName: 'Patel',
      email: 'sam.p@apexservices.com',
      phone: '+94 77 901 2345',
      specialization: 'Plumbing',
      services: ['Plumbing', 'Cleaning'],
      roleTitle: 'Plumbing Specialist',
      status: 'on_shift_job',
      activeAssignment: 'JOB-4078',
      serviceRadius: 15,
      latitude: 6.8941,
      longitude: 79.8547,
      rating: 4.78,
      completedJobs: 84,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 05, Sri Lanka',
      joinedDate: 'May 2024',
      emergencyContact: 'Priya Patel — +94 71 234 9988 (Wife)',
      certifications: 'Journeyman Plumber License #PL-3312.',
      recentJobs: [
        { id: 'JOB-4078', client: 'Elena Rostova', service: 'High-Pressure Sewer Line Cleansing', status: 'In Progress', date: 'Today' },
      ],
    },
    {
      id: 'TECH-105',
      firstName: 'Elena',
      lastName: 'Gomez',
      email: 'elena.g@apexservices.com',
      phone: '+94 77 654 9870',
      specialization: 'General Repair',
      services: ['General Repair', 'Carpentry', 'Painting'],
      roleTitle: 'Senior Maintenance Tech',
      status: 'available',
      activeAssignment: null,
      serviceRadius: 35,
      latitude: 6.9016,
      longitude: 79.8703,
      rating: 4.92,
      completedJobs: 115,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 08, Sri Lanka',
      joinedDate: 'Feb 2024',
      emergencyContact: 'Luis Gomez — +94 71 443 8877 (Father)',
      certifications: 'OSHA 30 Maintenance Certification, Multi-Trade Skilled.',
      recentJobs: [
        { id: 'JOB-4033', client: 'Dwight Schrute', service: 'Drywall Repair & Fixture Fitting', status: 'Completed', date: 'Yesterday' },
      ],
    },
    {
      id: 'TECH-106',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.v@apexservices.com',
      phone: '+94 77 432 1098',
      specialization: 'HVAC',
      services: ['HVAC', 'General Repair'],
      roleTitle: 'HVAC Technician',
      status: 'available',
      activeAssignment: null,
      serviceRadius: 25,
      latitude: 6.8856,
      longitude: 79.8654,
      rating: 4.88,
      completedJobs: 67,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 06, Sri Lanka',
      joinedDate: 'Jun 2024',
      emergencyContact: 'Tanya Vance — +94 71 112 9900 (Sister)',
      certifications: 'HVAC Duct & Air Flow Diagnostics Certified.',
      recentJobs: [
        { id: 'JOB-4019', client: 'Stanley Hudson', service: 'Ductwork Inspection', status: 'Completed', date: '3 days ago' },
      ],
    },
    {
      id: 'TECH-107',
      firstName: 'Sophia',
      lastName: 'Chen',
      email: 'sophia.c@apexservices.com',
      phone: '+94 77 789 0123',
      specialization: 'Electrical',
      services: ['Electrical', 'HVAC'],
      roleTitle: 'Electrical Specialist',
      status: 'available',
      activeAssignment: null,
      serviceRadius: 40,
      latitude: 6.9110,
      longitude: 79.8600,
      rating: 4.96,
      completedJobs: 130,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 02, Sri Lanka',
      joinedDate: 'Jan 2024',
      emergencyContact: 'Kevin Chen — +94 71 776 5544 (Husband)',
      certifications: 'Residential & EV Charger Installation Specialist.',
      recentJobs: [
        { id: 'JOB-4022', client: 'Oscar Martinez', service: 'EV Charger Installation', status: 'Completed', date: '4 days ago' },
      ],
    },
    {
      id: 'TECH-108',
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.t@apexservices.com',
      phone: '+94 77 321 6549',
      specialization: 'Roofing',
      services: ['Roofing', 'General Repair', 'Carpentry'],
      roleTitle: 'Roofing & Gutter Expert',
      status: 'on_break',
      activeAssignment: null,
      serviceRadius: 30,
      latitude: 6.8722,
      longitude: 79.8789,
      rating: 4.75,
      completedJobs: 52,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      location: 'Dehiwala, Sri Lanka',
      joinedDate: 'Jul 2024',
      emergencyContact: 'Laura Taylor — +94 71 334 1122 (Mother)',
      certifications: 'Commercial Roofing & Waterproofing Specialist.',
      recentJobs: [],
    },
    {
      id: 'TECH-109',
      firstName: 'Lucas',
      lastName: 'Bennett',
      email: 'lucas.b@apexservices.com',
      phone: '+94 77 890 1234',
      specialization: 'Plumbing',
      services: ['Plumbing'],
      roleTitle: 'Junior Plumber',
      status: 'off_duty',
      activeAssignment: null,
      serviceRadius: 15,
      latitude: 6.9400,
      longitude: 79.8600,
      rating: 4.70,
      completedJobs: 41,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 10, Sri Lanka',
      joinedDate: 'Aug 2024',
      emergencyContact: 'George Bennett — +94 71 998 1122 (Father)',
      certifications: 'Apprentice Plumber License #AP-7041.',
      recentJobs: [],
    },
    {
      id: 'TECH-110',
      firstName: 'Hannah',
      lastName: 'Abbott',
      email: 'hannah.a@apexservices.com',
      phone: '+94 77 456 7890',
      specialization: 'HVAC',
      services: ['HVAC', 'Electrical', 'Cleaning'],
      roleTitle: 'HVAC Diagnostics Tech',
      status: 'off_duty',
      activeAssignment: null,
      serviceRadius: 25,
      latitude: 6.9350,
      longitude: 79.8550,
      rating: 4.82,
      completedJobs: 79,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      location: 'Colombo 11, Sri Lanka',
      joinedDate: 'Apr 2024',
      emergencyContact: 'Neville Abbott — +94 71 667 8899 (Brother)',
      certifications: 'Commercial HVAC Diagnostics & System Balancing.',
      recentJobs: [],
    },
  ];

  // State Management with reactive custom hook & localStorage persistence
  const { technicians, activeTechnicians, setTechnicians } = useCompanyTechnicians(initialTechnicians);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Side Drawer States
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [editingTech, setEditingTech] = useState(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);

  // Delete Modal State
  const [deletingTech, setDeletingTech] = useState(null);

  // Calculate Key Metrics
  const totalStaff = activeTechnicians.length;
  const currentlyOnShift = activeTechnicians.filter(
    (t) => t.status === 'on_shift_job' || t.status === 'available' || t.status === 'on_break'
  ).length;
  const availableForDispatch = activeTechnicians.filter((t) => t.status === 'available').length;
  const avgRating = useMemo(() => {
    if (!activeTechnicians.length) return '0.0';
    const sum = activeTechnicians.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / activeTechnicians.length).toFixed(1);
  }, [activeTechnicians]);

  // Filtered Technicians List (matching multi-service capabilities)
  const filteredTechnicians = useMemo(() => {
    return activeTechnicians.filter((tech) => {
      const q = searchQuery.toLowerCase().trim();
      const techServices = Array.isArray(tech.services) ? tech.services : [tech.specialization || ''];
      const servicesString = techServices.join(' ').toLowerCase();

      const matchesSearch =
        !q ||
        tech.firstName.toLowerCase().includes(q) ||
        tech.lastName.toLowerCase().includes(q) ||
        tech.id.toLowerCase().includes(q) ||
        servicesString.includes(q) ||
        (tech.roleTitle && tech.roleTitle.toLowerCase().includes(q)) ||
        (tech.location && tech.location.toLowerCase().includes(q)) ||
        tech.phone.includes(q) ||
        tech.email.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === 'on_shift') {
        matchesStatus = tech.status === 'on_shift_job' || tech.status === 'available' || tech.status === 'on_break';
      } else if (statusFilter === 'available') {
        matchesStatus = tech.status === 'available';
      } else if (statusFilter === 'on_shift_job') {
        matchesStatus = tech.status === 'on_shift_job';
      } else if (statusFilter === 'off_duty') {
        matchesStatus = tech.status === 'off_duty';
      } else if (statusFilter === 'on_break') {
        matchesStatus = tech.status === 'on_break';
      }

      // Check if any assigned service matches the skill filter
      const matchesSkill =
        skillFilter === 'all' ||
        techServices.some((s) => s.toLowerCase() === skillFilter.toLowerCase()) ||
        (tech.specialization && tech.specialization.toLowerCase() === skillFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesSkill;
    });
  }, [activeTechnicians, searchQuery, statusFilter, skillFilter]);

  // Pagination calculations
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage) || 1;
  const paginatedTechnicians = useMemo(() => {
    return filteredTechnicians.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredTechnicians, currentPage, itemsPerPage]);

  // Status Change Handler for Dropdown Pill
  const handleStatusChange = (techId, newStatus) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== techId) return t;
        const updated = { ...t, status: newStatus };
        if (selectedEmployeeForDetails && selectedEmployeeForDetails.id === techId) {
          setSelectedEmployeeForDetails(updated);
        }
        return updated;
      })
    );
  };

  // Handlers for Drawers
  const handleOpenAddDrawer = () => {
    setEditingTech(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEditDrawer = (tech) => {
    setEditingTech(tech);
    setIsFormDrawerOpen(true);
  };

  const handleViewDetails = (tech) => {
    setSelectedEmployeeForDetails(tech);
    setIsDetailsDrawerOpen(true);
  };

  const handleSaveTechnician = (savedData) => {
    if (editingTech) {
      setTechnicians((prev) =>
        prev.map((t) => {
          if (t.id !== editingTech.id) return t;
          const updated = {
            ...t,
            ...savedData,
          };
          if (selectedEmployeeForDetails && selectedEmployeeForDetails.id === t.id) {
            setSelectedEmployeeForDetails(updated);
          }
          return updated;
        })
      );
      showToast(t('Employee updated successfully'), 'success');
    } else {
      const newIdNumber = Math.max(...technicians.map((t) => parseInt(t.id.replace('TECH-', ''), 10) || 100)) + 1;
      const newTech = {
        id: `TECH-${newIdNumber}`,
        ...savedData,
        services: savedData.services && savedData.services.length > 0 ? savedData.services : [savedData.specialization || 'General Repair'],
        serviceRadius: savedData.serviceRadius || 25,
        latitude: savedData.latitude || 6.9271,
        longitude: savedData.longitude || 79.8612,
        activeAssignment: null,
        rating: 5.0,
        completedJobs: 0,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + newIdNumber}?w=150&auto=format&fit=crop&q=80`,
        location: savedData.location || 'Colombo, Sri Lanka',
        joinedDate: 'Just Now',
        recentJobs: [],
      };
      setTechnicians((prev) => [newTech, ...prev]);
      showToast(t('Employee created successfully'), 'success');
    }

    setIsFormDrawerOpen(false);
    setEditingTech(null);
  };

  // Confirm Delete with Toast Feedback
  const handleDeleteTech = () => {
    if (!deletingTech) return;
    setTechnicians((prev) => prev.filter((t) => t.id !== deletingTech.id));
    showToast(t('Successfully deleted'), 'delete_success');
    setDeletingTech(null);
  };

  // Category Icon Renderer
  const getCategoryIcon = (specialization) => {
    const cat = specialization?.toLowerCase() || '';
    if (cat.includes('plumb')) return <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
    if (cat.includes('electric')) return <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    if (cat.includes('hvac') || cat.includes('air') || cat.includes('heat')) return <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
    if (cat.includes('roof')) return <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    if (cat.includes('carpent')) return <Hammer className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
    if (cat.includes('clean')) return <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    if (cat.includes('paint')) return <Paintbrush className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
    return <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  };

  // Status Badge / Dropdown Config Renderer (matching Bookings design)
  const getStatusConfig = (status) => {
    switch (status) {
      case 'available':
        return {
          label: t('Available'),
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dotClass: 'bg-emerald-500',
        };
      case 'on_shift_job':
        return {
          label: t('In Job'),
          badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dotClass: 'bg-sky-500',
        };
      case 'on_break':
        return {
          label: t('On Break'),
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dotClass: 'bg-amber-500',
        };
      case 'off_duty':
      default:
        return {
          label: t('Off Duty'),
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-400',
        };
    }
  };

  return (
    <AppLayout>
      <Head title={t('Employee Management')} />

      <div className="flex w-full flex-col gap-6">
        {/* Toast Notifications */}
        <FloatingToast
          message={toastMessage?.msg}
          type={toastMessage?.type}
          onClose={() => setToastMessage(null)}
        />

        {/* 1. PAGE HEADER */}
        <PageHeader
          title={t('Employee Management')}
          description={t('Manage field staff, assign multiple service capabilities, and set coverage radius on Google Maps.')}
          action={
            <button
              type="button"
              onClick={handleOpenAddDrawer}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t('Add New Technician')}</span>
            </button>
          }
        />

        {/* 2. SUMMARY METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            icon={Users}
            label={t('Total Technicians')}
            value={totalStaff.toString()}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-theme-accent"
            ringClass="ring-indigo-50/50"
          />

          <StatCard
            icon={Clock}
            label={t('Active on Duty')}
            value={currentlyOnShift.toString()}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
            ringClass="ring-emerald-50/50"
          />

          <StatCard
            icon={Zap}
            label={t('Available for Dispatch')}
            value={availableForDispatch.toString()}
            iconBgClass="bg-sky-50"
            iconColorClass="text-sky-600"
            ringClass="ring-sky-50/50"
          />

          <StatCard
            icon={Star}
            label={t('Average Staff Rating')}
            value={`${avgRating} / 5.0`}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
            ringClass="ring-amber-50/50"
          />
        </div>

        {/* 3. FILTERS & CONTROLS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')}{' '}
              <span className="font-bold text-slate-900">{filteredTechnicians.length}</span>{' '}
              {t('technicians')}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t('Search by Name, ID (TECH-101), Service, or Location...')}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
              {/* Status Dropdown */}
              <div className="relative flex items-center">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
                >
                  <option value="all">{t('Status: All')}</option>
                  <option value="on_shift">{t('Active / On Shift')}</option>
                  <option value="available">{t('Available Only')}</option>
                  <option value="on_shift_job">{t('In Active Job')}</option>
                  <option value="on_break">{t('On Break')}</option>
                  <option value="off_duty">{t('Off Duty')}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
              </div>

              {/* Service / Capabilities Dropdown */}
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={skillFilter}
                  onChange={(e) => {
                    setSkillFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
                >
                  <option value="all">{t('Service: All Capabilities')}</option>
                  <option value="Plumbing">{t('Plumbing')}</option>
                  <option value="HVAC">{t('HVAC & Cooling')}</option>
                  <option value="Electrical">{t('Electrical')}</option>
                  <option value="General Repair">{t('General Repair')}</option>
                  <option value="Roofing">{t('Roofing')}</option>
                  <option value="Carpentry">{t('Carpentry')}</option>
                  <option value="Cleaning">{t('Cleaning')}</option>
                  <option value="Painting">{t('Painting')}</option>
                  {serviceCategories?.map((c) => (
                    <option key={c.id} value={c.service_name}>
                      {c.service_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. TECHNICIAN DATA TABLE CONTAINER */}
        <TableCard>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">{t('Technician')}</th>
                    <th className="px-6 py-4">{t('Assigned Services')}</th>
                    <th className="px-6 py-4">{t('Status')}</th>
                    <th className="px-6 py-4">{t('Active Job')}</th>
                    <th className="px-6 py-4">{t('Rating & Jobs')}</th>
                    <th className="px-6 py-4">{t('Coverage Radius')}</th>
                    <th className="px-6 py-4 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTechnicians.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <AlertTriangle className="w-8 h-8 text-slate-300" />
                          <p>{t('No technicians found matching your search or filters.')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedTechnicians.map((tech) => {
                      const statusConfig = getStatusConfig(tech.status);
                      const techName = `${tech.firstName || ''} ${tech.lastName || ''}`.trim() || tech.name || 'Technician';
                      const techAvatar = tech.avatar_url || tech.avatar || tech.profile_image || null;
                      const techInitials = techName
                        ? techName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                        : 'T';

                      const techServices = Array.isArray(tech.services) && tech.services.length > 0
                        ? tech.services
                        : [tech.specialization || 'General Repair'];

                      return (
                        <tr
                          key={tech.id}
                          onClick={() => handleViewDetails(tech)}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        >
                          {/* 1. Technician Info */}
                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-3">
                              {techAvatar ? (
                                <img
                                  src={techAvatar}
                                  alt={techName}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-theme-accent/10 text-theme-accent font-bold text-xs flex items-center justify-center shrink-0 border border-theme-accent/20">
                                  {techInitials}
                                </div>
                              )}
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-sm truncate max-w-[160px]">
                                    {tech.firstName} {tech.lastName}
                                  </span>
                                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 shrink-0">
                                    {tech.id}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate max-w-[200px]">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{tech.phone}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Assigned Services (Multiple Services) */}
                          <td className="px-6 py-4 align-middle">
                            <div className="flex flex-wrap gap-1 max-w-[240px]">
                              {techServices.slice(0, 2).map((srv, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200/80 text-slate-700"
                                >
                                  {getCategoryIcon(srv)}
                                  <span>{srv}</span>
                                </span>
                              ))}
                              {techServices.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-theme-accent/10 text-theme-accent">
                                  +{techServices.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 3. Status Dropdown Pill */}
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            <div
                              className="relative inline-flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.badgeClass} shadow-2xs transition-all hover:brightness-95`}
                              >
                                <span className={`h-2 w-2 rounded-full shrink-0 ${statusConfig.dotClass}`} />
                                <select
                                  value={tech.status}
                                  onChange={(e) => handleStatusChange(tech.id, e.target.value)}
                                  className="bg-transparent appearance-none bg-none [background-image:none] border-none py-0 pl-0 pr-4 text-xs font-bold focus:ring-0 focus:outline-none cursor-pointer leading-tight text-inherit outline-none shadow-none"
                                >
                                  <option value="available" className="bg-white text-slate-800 font-medium">
                                    {t('Available')}
                                  </option>
                                  <option value="on_shift_job" className="bg-white text-slate-800 font-medium">
                                    {t('In Job')}
                                  </option>
                                  <option value="on_break" className="bg-white text-slate-800 font-medium">
                                    {t('On Break')}
                                  </option>
                                  <option value="off_duty" className="bg-white text-slate-800 font-medium">
                                    {t('Off Duty')}
                                  </option>
                                </select>
                                <ChevronDown className="w-3 h-3 absolute right-2.5 pointer-events-none opacity-60 shrink-0" />
                              </div>
                            </div>
                          </td>

                          {/* 4. Active Job */}
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            {tech.activeAssignment ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold">
                                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                                <span>{tech.activeAssignment}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium italic">
                                {t('Unassigned')}
                              </span>
                            )}
                          </td>

                          {/* 5. Rating & Jobs */}
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-extrabold text-slate-900 text-sm">{tech.rating}</span>
                              <span className="text-xs text-slate-400 font-medium">({tech.completedJobs} {t('jobs')})</span>
                            </div>
                          </td>

                          {/* 6. Coverage Radius (Google Maps) */}
                          <td className="px-6 py-4 align-middle whitespace-nowrap">
                            {tech.isEntireCountry || String(tech.serviceRadius || '').toLowerCase().includes('entire') || String(tech.serviceRadius || '').toLowerCase().includes('island') ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                {t('Entire Country')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs">
                                <MapPin className="w-3.5 h-3.5 text-theme-accent" />
                                {tech.serviceRadius || 25} km
                              </span>
                            )}
                          </td>

                          {/* 7. Actions */}
                          <td className="px-6 py-4 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(tech);
                                }}
                                title={t('View Details')}
                                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditDrawer(tech);
                                }}
                                title={t('Edit Details')}
                                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingTech(tech);
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
                  {filteredTechnicians.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                </span>
                –
                <span className="font-bold text-slate-900">
                  {Math.min(currentPage * itemsPerPage, filteredTechnicians.length)}
                </span>{' '}
                {t('of')} <span className="font-bold text-slate-900">{filteredTechnicians.length}</span> {t('technicians')}
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
        </TableCard>

        {/* 5. EMPLOYEE VIEW DETAILS SIDE DRAWER */}
        <EmployeeDetailsDrawer
          employee={selectedEmployeeForDetails}
          isOpen={isDetailsDrawerOpen}
          onClose={() => {
            setIsDetailsDrawerOpen(false);
            setSelectedEmployeeForDetails(null);
          }}
          onEdit={(tech) => {
            setIsDetailsDrawerOpen(false);
            handleOpenEditDrawer(tech);
          }}
          onUpdateStatus={handleStatusChange}
          googleMapsApiKey={googleMapsApiKey}
        />

        {/* 6. ADD / EDIT EMPLOYEE SIDE DRAWER */}
        <EmployeeFormDrawer
          isOpen={isFormDrawerOpen}
          onClose={() => {
            setIsFormDrawerOpen(false);
            setEditingTech(null);
          }}
          onSave={handleSaveTechnician}
          editingTech={editingTech}
          googleMapsApiKey={googleMapsApiKey}
          availableCategories={serviceCategories}
        />

        {/* 7. DELETE CONFIRMATION MODAL */}
        <DeleteConfirmationModal
          isOpen={!!deletingTech}
          onClose={() => setDeletingTech(null)}
          onConfirm={handleDeleteTech}
          title={t('Remove Employee?')}
          description={
            deletingTech
              ? t('Are you sure you want to remove :name (:id) from active workforce? This action cannot be undone.', {
                  name: `${deletingTech.firstName} ${deletingTech.lastName}`,
                  id: deletingTech.id,
                })
              : t('Are you sure you want to remove this employee? This action cannot be undone.')
          }
          confirmText={t('Remove Employee')}
        />

      </div>
    </AppLayout>
  );
}
