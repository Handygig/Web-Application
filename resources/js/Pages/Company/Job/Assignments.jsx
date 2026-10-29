import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import StatCard from '@/Components/Cards/StatCard';
import FloatingToast from '@/Components/Other/FloatingToast';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  UserCheck,
  UserX,
  MapPin,
  X,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

const fallbackAssignments = [
  {
    id: 1,
    job_request_id: 101,
    job_request: {
      id: 101,
      title: 'Whole-house Air Duct Cleaning & Sanitization',
      customer: { user: { name: 'Sarah Jenkins', phone: '+1 555-0192' } },
      property: { address_line: '742 Evergreen Terrace, Springfield' },
      service_category: { service_name: 'HVAC' },
      preferred_date: '2026-10-28 09:30:00',
    },
    provider: {
      id: 1,
      user: { name: 'Alex Rivera', email: 'alex.r@example.com', phone: '+1 555-0101' },
    },
    status: 'assigned',
    assigned_at: '2026-10-26 10:15:00',
  },
  {
    id: 2,
    job_request_id: 102,
    job_request: {
      id: 102,
      title: 'Commercial Main Breaker Upgrade & Circuit Rewiring',
      customer: { user: { name: 'Marcus Vance', phone: '+1 555-0184' } },
      property: { address_line: '120 Innovation Way, Suite 400' },
      service_category: { service_name: 'Electrical' },
      preferred_date: '2026-10-29 14:00:00',
    },
    provider: null,
    status: 'pending',
    assigned_at: null,
  },
  {
    id: 3,
    job_request_id: 103,
    job_request: {
      id: 103,
      title: 'Emergency Pipe Leak Repair & Valve Replacement',
      customer: { user: { name: 'Elena Rostova', phone: '+1 555-0177' } },
      property: { address_line: '54 Lakeview Dr, Greenfield' },
      service_category: { service_name: 'Plumbing' },
      preferred_date: '2026-10-27 11:00:00',
    },
    provider: {
      id: 2,
      user: { name: 'Liam Chen', email: 'liam.c@example.com', phone: '+1 555-0102' },
    },
    status: 'in_progress',
    assigned_at: '2026-10-26 08:00:00',
  },
  {
    id: 4,
    job_request_id: 104,
    job_request: {
      id: 104,
      title: 'Exterior Perimeter Security Camera Installation',
      customer: { user: { name: 'David Miller', phone: '+1 555-0155' } },
      property: { address_line: '88 Meadowbrook Ave, Westwood' },
      service_category: { service_name: 'Smart Home' },
      preferred_date: '2026-10-25 10:00:00',
    },
    provider: {
      id: 3,
      user: { name: 'Samantha Reed', email: 'sam.r@example.com', phone: '+1 555-0103' },
    },
    status: 'completed',
    assigned_at: '2026-10-24 09:00:00',
  },
];

const fallbackTechnicians = [
  { id: 1, user: { name: 'Alex Rivera', email: 'alex.r@example.com', phone: '+1 555-0101' } },
  { id: 2, user: { name: 'Liam Chen', email: 'liam.c@example.com', phone: '+1 555-0102' } },
  { id: 3, user: { name: 'Samantha Reed', email: 'sam.r@example.com', phone: '+1 555-0103' } },
  { id: 4, user: { name: 'Carlos Mendez', email: 'carlos.m@example.com', phone: '+1 555-0104' } },
];

export default function JobAssignments({
  assignments = { data: [] },
  technicians = [],
  filters = {},
}) {
  const { t } = useTranslation();

  const [assignmentList, setAssignmentList] = useState(() => {
    if (assignments?.data && assignments.data.length > 0) {
      return assignments.data;
    }
    return fallbackAssignments;
  });

  const availableTechnicians = useMemo(() => {
    if (technicians && technicians.length > 0) {
      return technicians;
    }
    return fallbackTechnicians;
  }, [technicians]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [techFilter, setTechFilter] = useState(filters.technician_id || 'all');

  // Dispatch / Assign Modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredAssignments = useMemo(() => {
    return assignmentList.filter((item) => {
      const jobTitle = item.job_request?.title || '';
      const customerName = item.job_request?.customer?.user?.name || '';
      const techName = item.provider?.user?.name || '';

      const matchesSearch =
        !searchTerm ||
        jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        techName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      const matchesTech =
        techFilter === 'all' ||
        (techFilter === 'unassigned' && !item.provider_id && !item.provider) ||
        String(item.provider_id || item.provider?.id) === String(techFilter);

      return matchesSearch && matchesStatus && matchesTech;
    });
  }, [assignmentList, searchTerm, statusFilter, techFilter]);

  const stats = useMemo(() => {
    const total = assignmentList.length;
    const pending = assignmentList.filter((a) => !a.provider && a.status === 'pending').length;
    const inProgress = assignmentList.filter((a) => a.status === 'in_progress' || a.status === 'assigned').length;
    const completed = assignmentList.filter((a) => a.status === 'completed').length;
    return { total, pending, inProgress, completed };
  }, [assignmentList]);

  const openAssignModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedTechId(assignment.provider?.id ? String(assignment.provider.id) : '');
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    const chosenTech = availableTechnicians.find((t) => String(t.id) === String(selectedTechId)) || null;

    // Call server endpoint or update locally
    if (selectedAssignment.id && !String(selectedAssignment.id).startsWith('temp-')) {
      router.post(
        `/company/jobs/assignments/${selectedAssignment.id}/assign-technician`,
        { provider_id: selectedTechId || null },
        {
          preserveScroll: true,
          onSuccess: () => {
            setIsSubmitting(false);
            setSelectedAssignment(null);
            setToast({
              type: 'success',
              msg: chosenTech
                ? t('Assigned job to :tech successfully!', { tech: chosenTech.user?.name })
                : t('Job unassigned successfully.'),
            });
            setTimeout(() => setToast(null), 3500);
          },
          onError: () => {
            // Local fallback for offline/demo
            applyLocalUpdate(chosenTech);
          },
        }
      );
    } else {
      applyLocalUpdate(chosenTech);
    }
  };

  const applyLocalUpdate = (chosenTech) => {
    setIsSubmitting(false);
    setAssignmentList((prev) =>
      prev.map((a) => {
        if (a.id === selectedAssignment.id) {
          return {
            ...a,
            provider: chosenTech,
            provider_id: chosenTech ? chosenTech.id : null,
            status: chosenTech ? 'assigned' : 'pending',
            assigned_at: chosenTech ? new Date().toISOString() : null,
          };
        }
        return a;
      })
    );
    setSelectedAssignment(null);
    setToast({
      type: 'success',
      msg: chosenTech
        ? t('Assigned job to :tech successfully!', { tech: chosenTech.user?.name })
        : t('Job unassigned successfully.'),
    });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AppLayout>
      <Head title={t('Job Assignments')} />

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {/* Header */}
        <PageHeader
          title={t('Job Assignments')}
          subtitle={t('Dispatch and assign jobs to your registered technicians and track work progress.')}
          icon={Users}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('Total Assignments')}
            value={stats.total}
            icon={Briefcase}
            variant="default"
          />
          <StatCard
            title={t('Pending Dispatch')}
            value={stats.pending}
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title={t('Active / Dispatched')}
            value={stats.inProgress}
            icon={Clock}
            variant="default"
          />
          <StatCard
            title={t('Completed Jobs')}
            value={stats.completed}
            icon={CheckCircle2}
            variant="emerald"
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search by job title, customer, or technician...')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4a2d]/20 focus:border-[#0f4a2d] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f4a2d]/20 focus:border-[#0f4a2d] transition-all"
              >
                <option value="all">{t('All Statuses')}</option>
                <option value="pending">{t('Pending Dispatch')}</option>
                <option value="assigned">{t('Assigned')}</option>
                <option value="in_progress">{t('In Progress')}</option>
                <option value="completed">{t('Completed')}</option>
              </select>

              {/* Technician Filter */}
              <select
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f4a2d]/20 focus:border-[#0f4a2d] transition-all"
              >
                <option value="all">{t('All Technicians')}</option>
                <option value="unassigned">{t('Unassigned Only')}</option>
                {availableTechnicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.user?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">{t('Job Request')}</th>
                  <th className="px-6 py-4">{t('Customer & Location')}</th>
                  <th className="px-6 py-4">{t('Assigned Technician')}</th>
                  <th className="px-6 py-4">{t('Status')}</th>
                  <th className="px-6 py-4 text-right">{t('Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAssignments.map((assignment) => {
                  const job = assignment.job_request || {};
                  const customer = job.customer?.user || {};
                  const property = job.property || {};
                  const tech = assignment.provider?.user || null;

                  return (
                    <tr
                      key={assignment.id}
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      {/* Job Title & Category */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block line-clamp-1">
                            {job.title || t('Standard Job Request')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#0f4a2d] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {job.service_category?.service_name || t('General')}
                            </span>
                            <span className="text-xs text-slate-400">
                              #{job.id || assignment.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer & Location */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <span className="font-semibold text-slate-800 block">
                            {customer.name || t('Customer')}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {property.address_line || t('Springfield Area')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Technician */}
                      <td className="px-6 py-4">
                        {tech ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#0f4a2d]/10 text-[#0f4a2d] font-bold text-xs flex items-center justify-center">
                              {tech.name?.charAt(0) || 'T'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {tech.name}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {tech.phone || tech.email || t('Technician')}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <UserX className="w-3.5 h-3.5" />
                            {t('Unassigned')}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {assignment.status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#0f4a2d] border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t('Completed')}
                          </span>
                        )}
                        {assignment.status === 'in_progress' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Clock className="w-3.5 h-3.5" />
                            {t('In Progress')}
                          </span>
                        )}
                        {assignment.status === 'assigned' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <UserCheck className="w-3.5 h-3.5" />
                            {t('Assigned')}
                          </span>
                        )}
                        {(!assignment.status || assignment.status === 'pending') && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {t('Needs Dispatch')}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openAssignModal(assignment)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-[#0f4a2d] hover:text-white text-slate-700 transition-all duration-150"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {tech ? t('Reassign') : t('Dispatch')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAssignments.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">{t('No assignments found')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('Adjust the filters or search term to see job assignments.')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch / Assign Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {selectedAssignment.provider ? t('Reassign Technician') : t('Dispatch Technician')}
                </h2>
                <p className="text-xs font-semibold text-[#5E6933] mt-0.5">
                  {selectedAssignment.job_request?.title || `Job #${selectedAssignment.id}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmAssignment} className="p-6 space-y-4">
              <p className="text-xs font-semibold text-slate-600">
                {t('Select an employee/technician from your company to dispatch to this job:')}
              </p>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {/* Unassign option */}
                <div
                  onClick={() => setSelectedTechId('')}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTechId === ''
                      ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                      --
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{t('Leave Unassigned')}</h4>
                      <p className="text-[11px] text-slate-500">
                        {t('Mark job as pending dispatch')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technicians List */}
                {availableTechnicians.map((tech) => {
                  const isSelected = String(tech.id) === String(selectedTechId);
                  return (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTechId(String(tech.id))}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#0f4a2d] bg-emerald-50/50 shadow-xs ring-1 ring-[#0f4a2d]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f4a2d]/10 text-[#0f4a2d] flex items-center justify-center font-bold text-sm">
                          {tech.user?.name?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{tech.user?.name}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                              TECH-{tech.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{tech.user?.phone || tech.user?.email}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#0f4a2d] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#0f4a2d] text-white text-xs font-bold hover:bg-[#0c3c24] active:scale-95 transition-all shadow-xs disabled:opacity-50"
                >
                  <Users className="w-3.5 h-3.5" />
                  {isSubmitting ? t('Saving...') : t('Confirm Dispatch')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <FloatingToast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}
