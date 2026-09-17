import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, Star, Clock } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function AssignTechModal({
  booking,
  isOpen,
  onClose,
  technicians,
  onAssignTech,
}) {
  const { t } = useTranslation();
  const [selectedTechId, setSelectedTechId] = useState(booking?.assignedTech?.id || '');

  const activeTechnicians = (technicians || []).filter(
    (tech) => tech.status !== 'inactive' && tech.status !== 'deleted'
  );

  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    onAssignTech(booking.id, selectedTechId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {booking.assignedTech ? t('Reassign Technician') : t('Dispatch Technician')}
            </h2>
            <p className="text-xs font-bold text-[#5E6933] mt-0.5">
              {booking.id} - {booking.serviceTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-600">
            {t('Select an available field technician from your registered company workforce:')}
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {/* Unassign Option */}
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
                  <p className="font-extrabold text-sm text-slate-800">{t('Unassigned')}</p>
                  <p className="text-xs text-slate-500 font-medium">{t('Keep job in pending dispatch queue')}</p>
                </div>
              </div>

              <input
                type="radio"
                name="techRadio"
                checked={selectedTechId === ''}
                onChange={() => setSelectedTechId('')}
                className="accent-[#5E6933] w-4 h-4"
              />
            </div>

            {/* List of Technicians */}
            {activeTechnicians.map((tech) => {
              const isSelected = selectedTechId === tech.id;
              const isAvailable = tech.status === 'available';
              const techName = tech.name || `${tech.firstName || ''} ${tech.lastName || ''}`.trim();
              const techRole = tech.role || tech.roleTitle || tech.specialization || t('Technician');
              const techAvatar = tech.avatar_url || tech.avatar || tech.profile_image || null;
              const techInitials = techName
                ? techName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                : 'T';

              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechId(tech.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#5E6933] bg-[#EBF5EC]/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {techAvatar ? (
                      <img
                        src={techAvatar}
                        alt={techName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-theme-accent/10 text-theme-accent font-bold text-xs flex items-center justify-center shrink-0 border border-theme-accent/20">
                        {techInitials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-sm text-slate-900">{techName}</p>
                        <span className="flex items-center text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {tech.rating || 5.0}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{techRole} • {tech.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isAvailable ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {t('Available')}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        {t('On Job')}
                      </span>
                    )}

                    <input
                      type="radio"
                      name="techRadio"
                      checked={isSelected}
                      onChange={() => setSelectedTechId(tech.id)}
                      className="accent-[#5E6933] w-4 h-4"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            {t('Cancel')}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:opacity-90 active:scale-98"
            style={{ backgroundColor: 'var(--color-accent, #5E6933)' }}
          >
            {t('Confirm Assignment')}
          </button>
        </div>

      </div>
    </div>
  );
}
