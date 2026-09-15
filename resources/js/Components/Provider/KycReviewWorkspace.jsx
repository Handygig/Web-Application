import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  ShieldCheck,
  CheckSquare,
  Square,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import DocumentViewerModal from '@/Components/Modals/DocumentViewerModal';

const DEFAULT_CHECKLIST = [
  {
    id: 1,
    text: 'Identity information matches submitted information',
    checked: false,
    required: true,
  },
  { id: 2, text: 'Business information is valid', checked: false, required: true },
  { id: 3, text: 'Documents are clear and readable', checked: false, required: true },
  { id: 4, text: 'Documents are not expired', checked: false, required: true },
  { id: 5, text: 'Required documents have been submitted', checked: false, required: true },
  { id: 6, text: 'Information across documents is consistent', checked: false, required: true },
  { id: 7, text: 'No suspicious or conflicting information found', checked: false, required: true },
];

export default function KycReviewWorkspace({
  request = null,
  onBack,
  onApprove,
  onReject,
  processing = false,
}) {
  const { t } = useTranslation();

  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [checklistError, setChecklistError] = useState('');

  useEffect(() => {
    // Reset checklist when request changes or if already approved
    if (request?.status === 'Approved') {
      setChecklist(DEFAULT_CHECKLIST.map((item) => ({ ...item, checked: true })));
    } else {
      setChecklist(DEFAULT_CHECKLIST.map((item) => ({ ...item, checked: false })));
    }
    setChecklistError('');
  }, [request]);

  if (!request) return null;

  const allRequiredChecked = checklist
    .filter((item) => item.required)
    .every((item) => item.checked);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
    if (checklistError) setChecklistError('');
  };

  const handleOpenDoc = (doc) => {
    setSelectedDoc(doc);
    setIsDocViewerOpen(true);
  };

  const handleApproveClick = () => {
    if (!allRequiredChecked) {
      setChecklistError(
        t('Please complete all mandatory verification checklist items before approving.')
      );
      return;
    }
    setChecklistError('');
    if (onApprove) onApprove(request);
  };

  const isPending = request.status === 'Pending';
  const isApproved = request.status === 'Approved';
  const isRejected = request.status === 'Rejected';

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Header bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('Back to Submissions')}
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {t('Verification Review')} - {request.applicationId || request.providerName}
            </h2>
            <p className="text-xs text-slate-500">
              {t('Submitted on')}: {request.submittedDate} • {t('Type')}: {request.verificationType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : isRejected
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isApproved && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            {isRejected && <XCircle className="h-4 w-4 text-red-600" />}
            {isPending && <Clock className="h-4 w-4 text-amber-600" />}
            {request.status}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Provider Information */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-theme-accent/10 font-bold text-theme-accent text-lg shadow-2xs">
                {request.providerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {request.providerName}
                </h3>
                <p className="text-xs font-medium text-theme-accent truncate">
                  {request.businessName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('Verification Type')}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-xs bg-theme-accent text-white px-2.5 py-1 rounded-lg">
                <ShieldCheck className="h-3.5 w-3.5" />
                {request.verificationType}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-medium">{t('Email Address')}</span>
                  <span className="font-semibold text-slate-800 break-all">{request.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-medium">{t('Phone Number')}</span>
                  <span className="font-semibold text-slate-800">
                    {request.phone || '+1 555-0198'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-medium">{t('Address')}</span>
                  <span className="font-semibold text-slate-800">
                    {request.address || '742 Evergreen Terrace'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-medium">{t('Country')}</span>
                  <span className="font-semibold text-slate-800">
                    {request.country || 'United States'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-medium">{t('Registration Date')}</span>
                  <span className="font-semibold text-slate-800">
                    {request.registrationDate || 'Jan 12, 2025'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-medium">
                    {t('Provider ID / Application ID')}
                  </span>
                  <span className="font-mono font-semibold text-slate-800">
                    {request.applicationId || `APP-${request.id}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviewer Note / Status Card */}
          {request.reviewer && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('Last Review Info')}
              </span>
              <p className="text-xs text-slate-700">
                <span className="font-bold">{t('Reviewer')}:</span> {request.reviewer}
              </p>
              {request.rejectionReason && (
                <p className="text-xs text-red-600 mt-2 bg-red-50 p-2.5 rounded-xl border border-red-100">
                  <span className="font-bold block">{t('Rejection Reason')}:</span>{' '}
                  {request.rejectionReason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Submitted Documents, Checklist, History & Decision Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* SECTION 6. Submitted Documents */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {t('Submitted Documents')} ({request.documents?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {t(
                'Click "View Document" on any file to inspect, zoom, or download the uploaded verification proofs.'
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {request.documents?.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-theme-accent ring-1 ring-indigo-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {doc.fileType} • {doc.fileSize}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {t('Uploaded')}: {doc.uploadDate}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDoc(doc)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5 text-theme-accent" />
                    {t('View Document')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8. Verification Checklist */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">{t('Verification Checklist')}</h3>
              <span className="text-xs font-semibold text-slate-500">
                {checklist.filter((i) => i.checked).length} / {checklist.length} {t('Completed')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {t(
                'All mandatory verification criteria must be inspected and checked prior to approving this submission.'
              )}
            </p>

            {checklistError && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{checklistError}</span>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-xs text-left transition border ${
                    item.checked
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <span className="flex-1">{t(item.text)}</span>
                  {item.required && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {t('Required')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 9. Admin Decision Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">{t('Verification Decision')}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isPending
                  ? t('Select an action to finalize this provider verification request.')
                  : t('This request is currently set to') + ` ${request.status}.`}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onReject(request)}
                disabled={processing}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                {t('Reject')}
              </button>

              <button
                type="button"
                onClick={handleApproveClick}
                disabled={processing}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-md transition active:scale-95 disabled:opacity-50 ${
                  allRequiredChecked
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-emerald-600/70 hover:bg-emerald-600 opacity-90'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {t('Approve')}
              </button>
            </div>
          </div>

          {/* SECTION 13. Verification History */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-theme-accent" />
              <h3 className="text-base font-bold text-slate-900">{t('Verification History')}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3">{t('Date')}</th>
                    <th className="py-2.5 px-3">{t('Action')}</th>
                    <th className="py-2.5 px-3">{t('Status')}</th>
                    <th className="py-2.5 px-3">{t('Reviewer')}</th>
                    <th className="py-2.5 px-3">{t('Reason / Notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(
                    request.history || [
                      {
                        date: request.submittedDate,
                        action: 'Initial Submission',
                        status: 'Pending',
                        reviewer: '—',
                        reason: 'Submitted by provider for review.',
                      },
                    ]
                  ).map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-medium text-slate-900">{h.date}</td>
                      <td className="py-2.5 px-3 font-medium">{h.action}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold ${
                            h.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : h.status === 'Rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{h.reviewer}</td>
                      <td className="py-2.5 px-3 text-slate-500 italic">{h.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        open={isDocViewerOpen}
        document={selectedDoc}
        onClose={() => setIsDocViewerOpen(false)}
      />
    </div>
  );
}
