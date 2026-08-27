import React from 'react';
import { Menu } from '@headlessui/react';
import { MoreVertical, Eye, CheckCircle2, Ban } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function BookingActionMenu({
  booking,
  onViewDetails,
  onStatusChange,
  onPromptCancel,
}) {
  const { t } = useTranslation();
  const status = booking.status || 'Pending';
  const isPending = status === 'Pending';
  const isConfirmed = status === 'Confirmed';
  const isCompleted = status === 'Completed';
  const isCancelled = status === 'Cancelled';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition">
        <MoreVertical className="h-4 w-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 focus:outline-none text-xs font-medium divide-y divide-slate-100">
        <div className="py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onViewDetails(booking)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                  active ? 'bg-slate-50' : ''
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
                {t('View Details')}
              </button>
            )}
          </Menu.Item>

          {isPending && (
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onStatusChange(booking, 'Confirmed')}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sky-700 ${
                    active ? 'bg-sky-50' : ''
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
                  {t('Confirm Booking')}
                </button>
              )}
            </Menu.Item>
          )}

          {isConfirmed && (
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onStatusChange(booking, 'Completed')}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-emerald-700 ${
                    active ? 'bg-emerald-50' : ''
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  {t('Mark Completed')}
                </button>
              )}
            </Menu.Item>
          )}
        </div>

        {!isCancelled && !isCompleted && (
          <div className="py-0.5">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onPromptCancel(booking)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                    active ? 'bg-red-50' : ''
                  }`}
                >
                  <Ban className="h-3.5 w-3.5 text-red-500" />
                  {t('Cancel Booking')}
                </button>
              )}
            </Menu.Item>
          </div>
        )}
      </Menu.Items>
    </Menu>
  );
}
