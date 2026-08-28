import React from 'react';
import { Menu } from '@headlessui/react';
import { MoreVertical, Eye, Edit3, Power, Trash2 } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function ProviderActionMenu({
  provider,
  onView,
  onEdit,
  onPromptToggleActive,
  onPromptDelete,
}) {
  const { t } = useTranslation();
  const isActive = provider.status === 'Active' || provider.status === 'active';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition">
        <MoreVertical className="h-4 w-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-50 mt-1 w-44 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/10 focus:outline-none text-xs font-medium divide-y divide-slate-100">
        <div className="py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onView(provider)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                  active ? 'bg-slate-50' : ''
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-slate-500" />
                {t('View Details')}
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onEdit(provider)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 ${
                  active ? 'bg-slate-50' : ''
                }`}
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                {t('Edit Provider')}
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onPromptToggleActive(provider)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left ${
                  isActive ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                } ${active ? (isActive ? 'bg-amber-50' : 'bg-emerald-50') : ''}`}
              >
                <Power className="h-3.5 w-3.5" />
                {isActive ? t('Deactivate') : t('Activate')}
              </button>
            )}
          </Menu.Item>
        </div>

        <div className="py-0.5">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onPromptDelete(provider)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 ${
                  active ? 'bg-red-50' : ''
                }`}
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                {t('Delete')}
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
