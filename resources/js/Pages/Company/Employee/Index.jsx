import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import StatCard from '@/Components/Cards/StatCard';
import TabSwitch from '@/Components/Other/TabSwitch';
import TableCard from '@/Components/Cards/TableCard';
import {
  Users,
  UserCheck,
  Clock,
  Star,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Briefcase,
  Phone,
  Mail,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
  ChevronDown,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  MoreVertical,
  Activity,
  Award,
  Zap,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function EmployeeIndex() {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  // Mock initial technicians dataset
  const initialTechnicians = [
    {
      id: 'TECH-101',
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.m@apexservices.com',
      phone: '+1 (555) 234-5678',
      specialization: 'Plumbing',
      roleTitle: 'Master Plumber',
      status: 'on_shift_job', // 'on_shift_job', 'available', 'off_duty', 'on_break'
      activeAssignment: 'JOB-4089',
      hourlyRate: '48.00',
      shiftAssignment: 'Morning Shift (08:00 - 16:00)',
      rating: 4.9,
      completedJobs: 142,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      location: 'Downtown District 4',
      joinedDate: 'Jan 2024',
      recentJobs: [
        { id: 'JOB-4089', client: 'Sarah Jenkins', service: 'Emergency Pipe Leak Repair', status: 'In Progress', date: 'Today' },
        { id: 'JOB-4055', client: 'Michael Scott', service: 'Water Heater Replacement', status: 'Completed', date: 'Yesterday' },
        { id: 'JOB-4012', client: 'Pam Beesly', service: 'Drain Clog Removal', status: 'Completed', date: '3 days ago' },
      ],
    },
    {
      id: 'TECH-102',
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.r@apexservices.com',
      phone: '+1 (555) 876-5432',
      specialization: 'HVAC',
      roleTitle: 'Lead HVAC Specialist',
      status: 'on_shift_job',
      activeAssignment: 'JOB-4084',
      hourlyRate: '52.00',
      shiftAssignment: 'Day Shift (09:00 - 17:00)',
      rating: 4.85,
      completedJobs: 98,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Northside Suburbs',
      joinedDate: 'Mar 2024',
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
      phone: '+1 (555) 345-6789',
      specialization: 'Electrical',
      roleTitle: 'Master Electrician',
      status: 'available',
      activeAssignment: null,
      hourlyRate: '55.00',
      shiftAssignment: 'Day Shift (08:30 - 16:30)',
      rating: 4.95,
      completedJobs: 176,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Commercial Zone West',
      joinedDate: 'Nov 2023',
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
      phone: '+1 (555) 901-2345',
      specialization: 'Plumbing',
      roleTitle: 'Plumbing Specialist',
      status: 'on_shift_job',
      activeAssignment: 'JOB-4078',
      hourlyRate: '45.00',
      shiftAssignment: 'Morning Shift (07:00 - 15:00)',
      rating: 4.78,
      completedJobs: 84,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      location: 'Westside Avenue',
      joinedDate: 'May 2024',
      recentJobs: [
        { id: 'JOB-4078', client: 'Elena Rostova', service: 'High-Pressure Sewer Line Cleansing', status: 'In Progress', date: 'Today' },
      ],
    },
    {
      id: 'TECH-105',
      firstName: 'Elena',
      lastName: 'Gomez',
      email: 'elena.g@apexservices.com',
      phone: '+1 (555) 654-9870',
      specialization: 'General Repair',
      roleTitle: 'Senior Maintenance Tech',
      status: 'available',
      activeAssignment: null,
      hourlyRate: '42.00',
      shiftAssignment: 'Day Shift (09:00 - 17:00)',
      rating: 4.92,
      completedJobs: 115,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: 'Central Plaza',
      joinedDate: 'Feb 2024',
      recentJobs: [
        { id: 'JOB-4033', client: 'Dwight Schrute', service: 'Drywall Repair & Fixture Fitting', status: 'Completed', date: 'Yesterday' },
      ],
    },
    {
      id: 'TECH-106',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.v@apexservices.com',
      phone: '+1 (555) 432-1098',
      specialization: 'HVAC',
      roleTitle: 'HVAC Technician',
      status: 'available',
      activeAssignment: null,
      hourlyRate: '46.00',
      shiftAssignment: 'Evening Shift (14:00 - 22:00)',
      rating: 4.88,
      completedJobs: 67,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      location: 'Eastside Sector',
      joinedDate: 'Jun 2024',
      recentJobs: [
        { id: 'JOB-4019', client: 'Stanley Hudson', service: 'Ductwork Inspection', status: 'Completed', date: '3 days ago' },
      ],
    },
    {
      id: 'TECH-107',
      firstName: 'Sophia',
      lastName: 'Chen',
      email: 'sophia.c@apexservices.com',
      phone: '+1 (555) 789-0123',
      specialization: 'Electrical',
      roleTitle: 'Electrical Specialist',
      status: 'available',
      activeAssignment: null,
      hourlyRate: '49.00',
      shiftAssignment: 'Morning Shift (08:00 - 16:00)',
      rating: 4.96,
      completedJobs: 130,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      location: 'Tech Corridor',
      joinedDate: 'Jan 2024',
      recentJobs: [
        { id: 'JOB-4022', client: 'Oscar Martinez', service: 'EV Charger Installation', status: 'Completed', date: '4 days ago' },
      ],
    },
    {
      id: 'TECH-108',
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.t@apexservices.com',
      phone: '+1 (555) 321-6549',
      specialization: 'Roofing',
      roleTitle: 'Roofing & Gutter Expert',
      status: 'on_break',
      activeAssignment: null,
      hourlyRate: '44.00',
      shiftAssignment: 'Day Shift (08:00 - 16:00)',
      rating: 4.75,
      completedJobs: 52,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      location: 'Southside Heights',
      joinedDate: 'Jul 2024',
      recentJobs: [],
    },
    {
      id: 'TECH-109',
      firstName: 'Lucas',
      lastName: 'Bennett',
      email: 'lucas.b@apexservices.com',
      phone: '+1 (555) 890-1234',
      specialization: 'Plumbing',
      roleTitle: 'Junior Plumber',
      status: 'off_duty',
      activeAssignment: null,
      hourlyRate: '38.00',
      shiftAssignment: 'Off Duty',
      rating: 4.70,
      completedJobs: 41,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      location: 'Suburban North',
      joinedDate: 'Aug 2024',
      recentJobs: [],
    },
    {
      id: 'TECH-110',
      firstName: 'Hannah',
      lastName: 'Abbott',
      email: 'hannah.a@apexservices.com',
      phone: '+1 (555) 456-7890',
      specialization: 'HVAC',
      roleTitle: 'HVAC Diagnostics Tech',
      status: 'off_duty',
      activeAssignment: null,
      hourlyRate: '47.00',
      shiftAssignment: 'Off Duty',
      rating: 4.82,
      completedJobs: 79,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      location: 'Downtown East',
      joinedDate: 'Apr 2024',
      recentJobs: [],
    },
  ];

  // State Management
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [selectedTechForSchedule, setSelectedTechForSchedule] = useState(null);
  const [deletingTech, setDeletingTech] = useState(null);

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: 'Plumbing',
    roleTitle: '',
    hourlyRate: '45.00',
    shiftAssignment: 'Morning Shift (08:00 - 16:00)',
    status: 'available',
  });

  // Calculate Key Metrics
  const totalStaff = technicians.length;
  const currentlyOnShift = technicians.filter((t) => t.status === 'on_shift_job' || t.status === 'available' || t.status === 'on_break').length;
  const availableForDispatch = technicians.filter((t) => t.status === 'available').length;
  const avgRating = useMemo(() => {
    if (!technicians.length) return '0.0';
    const sum = technicians.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / technicians.length).toFixed(1);
  }, [technicians]);

  // Filtered Technicians List
  const filteredTechnicians = useMemo(() => {
    return technicians.filter((tech) => {
      // Search text match (Name, Employee ID, Specialization, Role)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tech.firstName.toLowerCase().includes(q) ||
        tech.lastName.toLowerCase().includes(q) ||
        tech.id.toLowerCase().includes(q) ||
        tech.specialization.toLowerCase().includes(q) ||
        tech.roleTitle.toLowerCase().includes(q) ||
        tech.phone.includes(q) ||
        tech.email.toLowerCase().includes(q);

      // Status filter
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

      // Skill filter
      const matchesSkill = skillFilter === 'all' || tech.specialization.toLowerCase() === skillFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSkill;
    });
  }, [technicians, searchQuery, statusFilter, skillFilter]);

  // Handle Add New Open
  const handleOpenAddModal = () => {
    setEditingTech(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: 'Plumbing',
      roleTitle: 'Plumbing Specialist',
      hourlyRate: '45.00',
      shiftAssignment: 'Morning Shift (08:00 - 16:00)',
      status: 'available',
    });
    setIsModalOpen(true);
  };

  // Handle Edit Open
  const handleOpenEditModal = (tech) => {
    setEditingTech(tech);
    setFormData({
      firstName: tech.firstName,
      lastName: tech.lastName,
      email: tech.email,
      phone: tech.phone,
      specialization: tech.specialization,
      roleTitle: tech.roleTitle,
      hourlyRate: tech.hourlyRate,
      shiftAssignment: tech.shiftAssignment,
      status: tech.status,
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler (Add / Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) return;

    if (editingTech) {
      // Update existing
      setTechnicians((prev) =>
        prev.map((t) =>
          t.id === editingTech.id
            ? {
                ...t,
                ...formData,
                roleTitle: formData.roleTitle || `${formData.specialization} Technician`,
              }
            : t
        )
      );
    } else {
      // Create new auto-generated ID
      const newIdNumber = Math.max(...technicians.map((t) => parseInt(t.id.replace('TECH-', ''), 10) || 100)) + 1;
      const newTech = {
        id: `TECH-${newIdNumber}`,
        ...formData,
        roleTitle: formData.roleTitle || `${formData.specialization} Technician`,
        activeAssignment: null,
        rating: 5.0,
        completedJobs: 0,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + newIdNumber}?w=150&auto=format&fit=crop&q=80`,
        location: 'Main Service Hub',
        joinedDate: 'Just Now',
        recentJobs: [],
      };
      setTechnicians((prev) => [newTech, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Quick Shift Status Toggle
  const handleToggleShiftStatus = (techId) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== techId) return t;
        let nextStatus = 'available';
        if (t.status === 'available') nextStatus = 'off_duty';
        else if (t.status === 'off_duty') nextStatus = 'available';
        else if (t.status === 'on_break') nextStatus = 'available';
        else if (t.status === 'on_shift_job') nextStatus = 'available';

        return {
          ...t,
          status: nextStatus,
          shiftAssignment: nextStatus === 'off_duty' ? 'Off Duty' : t.shiftAssignment === 'Off Duty' ? 'Day Shift (08:00 - 16:00)' : t.shiftAssignment,
        };
      })
    );
  };

  // Confirm Delete
  const handleDeleteTech = () => {
    if (!deletingTech) return;
    setTechnicians((prev) => prev.filter((t) => t.id !== deletingTech.id));
    setDeletingTech(null);
  };

  // Helper Badge Renderers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'on_shift_job':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('On Shift - In Job')}
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EC] text-[#2F4F2F] border border-[#C6E2CB] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            {t('Available for Job')}
          </span>
        );
      case 'on_break':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600" />
            {t('On Break')}
          </span>
        );
      case 'off_duty':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            {t('Off Duty')}
          </span>
        );
    }
  };

  const getSpecializationBadge = (spec) => {
    switch (spec.toLowerCase()) {
      case 'plumbing':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">{spec}</span>;
      case 'hvac':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">{spec}</span>;
      case 'electrical':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">{spec}</span>;
      case 'roofing':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">{spec}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{spec}</span>;
    }
  };

  const employeeTabs = [
    { key: 'all', label: `${t('All')} (${totalStaff})` },
    { key: 'available', label: `${t('Available')} (${availableForDispatch})` },
    { key: 'on_shift_job', label: `${t('On Shift - In Job')} (${currentlyOnShift})` },
    { key: 'on_break', label: `${t('On Break')} (${technicians.filter((t) => t.status === 'on_break').length})` },
    { key: 'off_duty', label: `${t('Off Duty')} (${technicians.filter((t) => t.status === 'off_duty').length})` },
  ];

  return (
    <AppLayout>
      <Head title={t('Employee Management')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Employee Management')}
          description={t('Manage field service technicians, assignments, and availability.')}
          action={
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              {t('Add New Technician')}
            </button>
          }
        />

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
            label={t('Currently On Shift')}
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
            label={t('Average Rating')}
            value={`${avgRating} / 5.0`}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
            ringClass="ring-amber-50/50"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <TabSwitch tabs={employeeTabs} activeTab={statusFilter} onChange={setStatusFilter} />
            <div className="text-xs text-slate-500 font-medium">
              {t('Showing')} <span className="font-bold text-slate-900">{filteredTechnicians.length}</span> {t('technicians')}
            </div>
          </div>

          {/* 3. SEARCH & FILTER CONTROLS BAR */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search by Name, Employee ID (TECH-101), or Specialty...')}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & View Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Status Dropdown */}
              <div className="relative flex items-center">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
                >
                  <option value="all">{t('Status: All')}</option>
                  <option value="on_shift">{t('On Shift (Any)')}</option>
                  <option value="available">{t('Available Only')}</option>
                  <option value="on_shift_job">{t('In Active Job')}</option>
                  <option value="on_break">{t('On Break')}</option>
                  <option value="off_duty">{t('Off Duty')}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
              </div>

              {/* Skill / Specialization Dropdown */}
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent transition-all cursor-pointer outline-none appearance-none bg-none [background-image:none]"
                >
                  <option value="all">{t('Skill: All Specialties')}</option>
                  <option value="Plumbing">{t('Plumbing')}</option>
                  <option value="HVAC">{t('HVAC')}</option>
                  <option value="Electrical">{t('Electrical')}</option>
                  <option value="General Repair">{t('General Repair')}</option>
                  <option value="Roofing">{t('Roofing')}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
              </div>

              {/* View Mode Toggle Buttons */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                <button
                  onClick={() => setViewMode('table')}
                  title={t('Table View')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('Table')}</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title={t('Grid View')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('Grid')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TECHNICIAN LIST / GRID / EMPTY STATE IN TABLECARD */}
        <TableCard>
          {filteredTechnicians.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{t('No technicians match your search')}</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {t('Try adjusting your search query, status filters, or skill selection to see field staff.')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSkillFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all"
              >
                {t('Reset Filters')}
              </button>
            </div>
          ) : viewMode === 'table' ? (

          /* --- TABLE VIEW --- */
          <div className="bg-white rounded-2xl border border-[#E2E4D9] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-[#F9FAF7] border-b border-[#E2E4D9] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6 w-64">{t('Technician')}</th>
                    <th className="py-3.5 px-6 w-44">{t('Specialization')}</th>
                    <th className="py-3.5 px-6 w-48">{t('Status')}</th>
                    <th className="py-3.5 px-6 w-40">{t('Active Job')}</th>
                    <th className="py-3.5 px-6 w-36">{t('Rating & Jobs')}</th>
                    <th className="py-3.5 px-6 w-32">{t('Hourly Rate')}</th>
                    <th className="py-3.5 px-6 w-36 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2EA] text-sm">
                  {filteredTechnicians.map((tech) => (
                    <tr key={tech.id} className="hover:bg-[#FAFBF7] transition-colors group">
                      
                      {/* Technician Info Column */}
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            src={tech.avatar}
                            alt={tech.firstName}
                            className="w-10 h-10 rounded-full object-cover border border-[#E2E4D9] shadow-2xs shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              <span className="truncate">{tech.firstName} {tech.lastName}</span>
                              <span className="font-mono text-xs font-bold text-[#5E6933] bg-[#EBF5EC] px-2 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap shrink-0">
                                {tech.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {tech.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialization / Role Column */}
                      <td className="py-4 px-6 align-middle">
                        <div className="space-y-1">
                          <div>{getSpecializationBadge(tech.specialization)}</div>
                          <div className="text-xs font-medium text-gray-500 truncate">{tech.roleTitle}</div>
                        </div>
                      </td>

                      {/* Status Badge Column */}
                      <td className="py-4 px-6 align-middle whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(tech.status)}
                          <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tech.shiftAssignment}
                          </div>
                        </div>
                      </td>

                      {/* Active Assignment Column */}
                      <td className="py-4 px-6 align-middle whitespace-nowrap">
                        {tech.activeAssignment ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                            {tech.activeAssignment}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400 italic">
                            {t('Unassigned')}
                          </span>
                        )}
                      </td>

                      {/* Rating & Jobs Column */}
                      <td className="py-4 px-6 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-extrabold text-gray-900">{tech.rating}</span>
                          <span className="text-xs text-gray-400 font-medium">({tech.completedJobs} {t('jobs')})</span>
                        </div>
                      </td>

                      {/* Hourly Rate Column */}
                      <td className="py-4 px-6 align-middle whitespace-nowrap">
                        <span className="font-bold text-gray-900">${tech.hourlyRate}/hr</span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* Schedule / History Button */}
                          <button
                            onClick={() => setSelectedTechForSchedule(tech)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 border border-[#E2E4D9] bg-white hover:bg-gray-50 rounded-lg transition-all shadow-2xs"
                            title={t('View Schedule & History')}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Shift Toggle Button */}
                          <button
                            onClick={() => handleToggleShiftStatus(tech.id)}
                            className="p-1.5 text-gray-600 hover:text-emerald-700 border border-[#E2E4D9] bg-white hover:bg-emerald-50 rounded-lg transition-all shadow-2xs"
                            title={t('Toggle Shift Status')}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(tech)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 border border-[#E2E4D9] bg-white hover:bg-blue-50 rounded-lg transition-all shadow-2xs"
                            title={t('Edit Technician Details')}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteTech(tech.id)}
                            className="p-1.5 text-gray-600 hover:text-rose-600 border border-[#E2E4D9] bg-white hover:bg-rose-50 rounded-lg transition-all shadow-2xs"
                            title={t('Remove Technician')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER / PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F9FAF7] px-6 py-3.5 border-t border-[#E2E4D9] text-xs text-gray-600">
              <div className="whitespace-nowrap">
                {t('Showing')} <span className="font-bold text-gray-900">1</span>–
                <span className="font-bold text-gray-900">{filteredTechnicians.length}</span> {t('of')}{' '}
                <span className="font-bold text-gray-900">{filteredTechnicians.length}</span> {t('technicians')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-3 py-1 font-semibold text-gray-800">
                  {t('Page 1 of 1')}
                </span>
              </div>
            </div>
          </div>
        ) : (

          /* --- GRID CARD VIEW --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTechnicians.map((tech) => (
              <div
                key={tech.id}
                className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Top Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tech.avatar}
                      alt={tech.firstName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-base leading-tight">
                        {tech.firstName} {tech.lastName}
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">
                        {tech.roleTitle}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {tech.id}
                  </span>
                </div>

                {/* Status & Specialization Row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>{getStatusBadge(tech.status)}</div>
                  <div>{getSpecializationBadge(tech.specialization)}</div>
                </div>

                {/* Details Container */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 space-y-2 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Briefcase className="w-3.5 h-3.5" />
                      {t('Active Assignment')}
                    </span>
                    {tech.activeAssignment ? (
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {tech.activeAssignment}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">{t('Unassigned')}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {t('Shift')}
                    </span>
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">{tech.shiftAssignment}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      {t('Pay Rate')}
                    </span>
                    <span className="font-bold text-slate-900">${tech.hourlyRate}/hr</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3 h-3" />
                      {tech.phone}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-extrabold text-slate-900">{tech.rating}</span>
                      <span className="text-[11px] text-slate-400">({tech.completedJobs})</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedTechForSchedule(tech)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('Schedule')}</span>
                  </button>

                  <button
                    onClick={() => handleToggleShiftStatus(tech.id)}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border border-emerald-200"
                    title={t('Quick Toggle Shift Status')}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(tech)}
                    className="py-2 px-3 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center transition-all"
                    title={t('Edit Details')}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingTech(tech)}
                    className="py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center transition-all"
                    title={t('Delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
        </TableCard>

        {/* 5. ADD / EDIT TECHNICIAN MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {editingTech ? t('Edit Technician Details') : t('Add New Field Technician')}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {editingTech ? t('Update staff profile, pay rates, and shift parameters') : t('Register a new team member to your provider workforce')}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                
                {/* Names Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('First Name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. David"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Last Name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Miller"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    />
                  </div>
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Phone Number')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Email Address')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tech@company.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    />
                  </div>
                </div>

                {/* Specialization & Role Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Primary Specialization')} *
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                          roleTitle: `${e.target.value} Specialist`,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    >
                      <option value="Plumbing">{t('Plumbing')}</option>
                      <option value="HVAC">{t('HVAC')}</option>
                      <option value="Electrical">{t('Electrical')}</option>
                      <option value="General Repair">{t('General Repair')}</option>
                      <option value="Roofing">{t('Roofing')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Role Title')}
                    </label>
                    <input
                      type="text"
                      value={formData.roleTitle}
                      onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                      placeholder="e.g. Master Plumber"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    />
                  </div>
                </div>

                {/* Hourly Rate & Shift Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Hourly Rate ($ USD)')}
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      placeholder="45.00"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t('Shift Assignment')}
                    </label>
                    <select
                      value={formData.shiftAssignment}
                      onChange={(e) => setFormData({ ...formData, shiftAssignment: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5E6933]/30 focus:border-[#5E6933] outline-none"
                    >
                      <option value="Morning Shift (08:00 - 16:00)">Morning Shift (08:00 - 16:00)</option>
                      <option value="Day Shift (09:00 - 17:00)">Day Shift (09:00 - 17:00)</option>
                      <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
                      <option value="On-Call Duty">On-Call Duty</option>
                      <option value="Off Duty">Off Duty</option>
                    </select>
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    {t('Current Status')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'available', label: t('Available'), color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                      { id: 'on_shift_job', label: t('In Job'), color: 'bg-blue-50 text-blue-800 border-blue-300' },
                      { id: 'on_break', label: t('On Break'), color: 'bg-amber-50 text-amber-800 border-amber-300' },
                      { id: 'off_duty', label: t('Off Duty'), color: 'bg-slate-100 text-slate-700 border-slate-300' },
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.id}
                        onClick={() => setFormData({ ...formData, status: st.id })}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          formData.status === st.id ? `${st.color} shadow-xs ring-2 ring-offset-1 ring-slate-400` : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md hover:opacity-90 transition-all"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    {editingTech ? t('Save Changes') : t('Create Technician Profile')}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* 6. VIEW SCHEDULE & HISTORY MODAL */}
        {selectedTechForSchedule && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTechForSchedule.avatar}
                    alt={selectedTechForSchedule.firstName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedTechForSchedule.firstName} {selectedTechForSchedule.lastName}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {selectedTechForSchedule.roleTitle} • {selectedTechForSchedule.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTechForSchedule(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Stats Summary Grid */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('Overall Rating')}</span>
                    <span className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {selectedTechForSchedule.rating}
                    </span>
                  </div>
                  <div className="text-center border-x border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('Jobs Completed')}</span>
                    <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                      {selectedTechForSchedule.completedJobs}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('Hourly Rate')}</span>
                    <span className="text-xl font-extrabold text-emerald-800 mt-1 block">
                      ${selectedTechForSchedule.hourlyRate}/hr
                    </span>
                  </div>
                </div>

                {/* Shift & Location Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">{t('Assigned Shift:')}</span>
                    <span className="font-bold text-slate-800">{selectedTechForSchedule.shiftAssignment}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">{t('Primary Service Zone:')}</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedTechForSchedule.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 font-semibold">{t('Joined Workforce:')}</span>
                    <span className="font-bold text-slate-800">{selectedTechForSchedule.joinedDate}</span>
                  </div>
                </div>

                {/* Recent Completed / Active Jobs List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    {t('Recent Dispatch & Job History')}
                  </h4>
                  {selectedTechForSchedule.recentJobs && selectedTechForSchedule.recentJobs.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTechForSchedule.recentJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{job.service}</div>
                            <div className="text-slate-500 mt-0.5">
                              {job.client} • <span className="font-mono">{job.id}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              job.status === 'In Progress' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {job.status}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">{job.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400 italic">
                      {t('No recent job history recorded yet.')}
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setSelectedTechForSchedule(null)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-all"
                >
                  {t('Close')}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 7. DELETE CONFIRMATION MODAL */}
        {deletingTech && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {t('Deactivate / Delete Technician?')}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {t('Are you sure you want to remove')} <strong className="text-slate-800">{deletingTech.firstName} {deletingTech.lastName}</strong> ({deletingTech.id}) {t('from active service dispatch?')}
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeletingTech(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleDeleteTech}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md"
                >
                  {t('Deactivate Technician')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
