import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Award,
  Droplets,
  Zap,
  Wind,
  Wrench,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function EmployeeDetailsDrawer({
  employee,
  isOpen,
  onClose,
  onEdit,
  onUpdateStatus,
}) {
  const { t } = useTranslation();

  if (!isOpen || !employee) return null;

  // Category Icon Renderer
  const getCategoryIcon = (specialization) => {
    const cat = specialization?.toLowerCase() || '';
    if (cat.includes('plumb')) return <Droplets className="w-4 h-4 text-sky-500 shrink-0" />;
    if (cat.includes('electric')) return <Zap className="w-4 h-4 text-amber-500 shrink-0" />;
    if (cat.includes('hvac') || cat.includes('air') || cat.includes('heat')) return <Wind className="w-4 h-4 text-teal-500 shrink-0" />;
    return <Wrench className="w-4 h-4 text-slate-500 shrink-0" />;
  };

  // Status Badge Helper
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

  const statusConfig = getStatusConfig(employee.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {employee.avatar_url || employee.avatar || employee.profile_image ? (
              <img
                src={employee.avatar_url || employee.avatar || employee.profile_image}
                alt={employee.firstName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-theme-accent/10 text-theme-accent font-bold text-sm flex items-center justify-center shrink-0 border border-theme-accent/20">
                {(`${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.name || 'T')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {employee.firstName} {employee.lastName}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {employee.roleTitle || `${employee.specialization} Technician`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          {/* Quick Status Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                {t('Current Status')}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.badgeClass}`}>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${statusConfig.dotClass}`} />
                  <span>{statusConfig.label}</span>
                </div>
              </div>
            </div>

            {/* Change Status Dropdown */}
            {onUpdateStatus && (
              <div className="flex items-center gap-2">
                <select
                  value={employee.status}
                  onChange={(e) => onUpdateStatus(employee.id, e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-theme-accent/30 focus:border-theme-accent outline-none cursor-pointer shadow-2xs"
                >
                  <option value="available">{t('Set: Available')}</option>
                  <option value="on_shift_job">{t('Set: In Job')}</option>
                  <option value="on_break">{t('Set: On Break')}</option>
                  <option value="off_duty">{t('Set: Off Duty')}</option>
                </select>
              </div>
            )}
          </div>

          {/* Performance & Metrics Summary */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('Rating')}</span>
              <span className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {employee.rating}
              </span>
            </div>
            <div className="text-center border-x border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('Completed Jobs')}</span>
              <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                {employee.completedJobs}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('Pay Rate')}</span>
              <span className="text-xl font-extrabold text-emerald-800 mt-1 block">
                ${employee.hourlyRate}/hr
              </span>
            </div>
          </div>

          {/* Contact & Personal Registration Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-theme-accent" />
              {t('Contact & Personal Details')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">{t('Full Name')}</span>
                <span className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Employee ID')}</span>
                <span className="font-bold text-slate-900 font-mono">{employee.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Phone Number')}</span>
                <a href={`tel:${employee.phone}`} className="font-bold text-slate-800 hover:underline flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {employee.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Email Address')}</span>
                <a href={`mailto:${employee.email}`} className="font-bold text-slate-800 hover:underline flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {employee.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Primary Service Zone')}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {employee.location || t('Main Hub')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Joined Workforce')}</span>
                <span className="font-bold text-slate-800">{employee.joinedDate || t('Recent')}</span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-2 border-t border-slate-200/60 text-xs">
              <span className="text-slate-400 font-medium block">{t('Emergency Contact')}</span>
              <span className="font-semibold text-slate-700">
                {employee.emergencyContact || `${employee.lastName} Family — ${employee.phone} (Primary)`}
              </span>
            </div>
          </div>

          {/* Professional Work & Schedule Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-theme-accent" />
              {t('Work Schedule & Specialization')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">{t('Specialization')}</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 font-bold mt-1">
                  {getCategoryIcon(employee.specialization)}
                  <span>{employee.specialization}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Role Title')}</span>
                <span className="font-bold text-slate-900 block mt-1">{employee.roleTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Assigned Shift')}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {employee.shiftAssignment}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">{t('Active Job')}</span>
                {employee.activeAssignment ? (
                  <span className="inline-block font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mt-1">
                    {employee.activeAssignment}
                  </span>
                ) : (
                  <span className="text-slate-400 italic block mt-1">{t('Unassigned')}</span>
                )}
              </div>
            </div>

            {/* Certifications & Experience */}
            <div className="pt-2 border-t border-slate-200/60 text-xs">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {t('Certifications & Background')}
              </span>
              <p className="font-semibold text-slate-700 mt-0.5">
                {employee.certifications || `${employee.specialization} Verified Specialist License, Safety Protocol Certified.`}
              </p>
            </div>
          </div>

          {/* Dispatch & Job History */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-theme-accent" />
              {t('Recent Dispatch & Job History')}
            </h3>
            {employee.recentJobs && employee.recentJobs.length > 0 ? (
              <div className="space-y-2">
                {employee.recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs"
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
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400 italic border border-slate-200/80">
                {t('No recent job history recorded yet.')}
              </div>
            )}
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 sticky bottom-0 z-20 flex items-center justify-between">
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              {t('Edit Technician')}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition-colors ml-auto"
          >
            {t('Close Details')}
          </button>
        </div>

      </div>
    </div>
  );
}
