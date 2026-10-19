import React from 'react';
import { Menu } from '@headlessui/react';
import { MoreVertical, Eye, Edit3, CheckCircle2, Lock, Trash2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function CustomerActionMenu({
  customer,
  onViewDetails,
  onEdit,
  onReactivate,
  onPromptBan,
  onPromptDelete,
}) {
  const { t } = useTranslation();
  const status = customer.status || 'Active';
  const isActive = status === 'Active';
  const isBanned = status === 'Banned';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition">
        <MoreVertical className="h-4 w-4" />
      </Menu.Button>

      <Menu.Items
        anchor="bottom end"
        className="z-50 w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 focus:outline-none text-xs font-medium divide-y divide-slate-100 [--anchor-gap:4px]"
      >
        <div className="py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onViewDetails(customer)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                  active ? 'bg-slate-50' : ''
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
                {t('View Profile')}
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onEdit(customer)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                  active ? 'bg-slate-50' : ''
                }`}
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                {t('Edit Account')}
              </button>
            )}
          </Menu.Item>

          {isBanned && (
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onReactivate(customer)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-emerald-700 ${
                    active ? 'bg-emerald-50' : ''
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  {t('Reactivate Account')}
                </button>
              )}
            </Menu.Item>
          )}

          {!isBanned && (
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onPromptBan(customer)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-700 ${
                    active ? 'bg-red-50' : ''
                  }`}
                >
                  <Lock className="h-3.5 w-3.5 text-red-600" />
                  {t('Ban Account')}
                </button>
              )}
            </Menu.Item>
          )}
        </div>

        <div className="py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onPromptDelete(customer)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                  active ? 'bg-red-50' : ''
                }`}
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                {t('Delete Customer')}
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
