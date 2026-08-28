import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TabSwitch from '@/Components/Other/TabSwitch';
import TableCard from '@/Components/Cards/TableCard';
import { Building, MapPin, ShieldCheck, Mail, Phone, Globe, Save } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';

export default function ProfileIndex() {
  const { t } = useTranslation();
  const { auth } = usePage().props;

  const [activeTab, setActiveTab] = useState('company');

  const [companyInfo, setCompanyInfo] = useState({
    companyName: auth?.user?.name || 'Apex Home & Repair Services',
    registrationNumber: 'REG-2024-8901',
    email: auth?.user?.email || 'contact@apexrepairs.com',
    phone: '+94 11 234 5678',
    website: 'https://apexrepairs.example.com',
    address: '142 Galle Road',
    city: 'Colombo',
    province: 'Western Province',
    postalCode: '00300',
    description: 'Premier home maintenance, electrical, and plumbing service provider.',
  });

  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { key: 'company', label: t('Company Details') },
    { key: 'address', label: t('Location & Address') },
    { key: 'security', label: t('Security & Access') },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AppLayout>
      <Head title={t('Company Profile')} />

      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title={t('Company Profile')}
          description={t('Manage your business profile, operating location, and account settings.')}
        />

        <div className="flex flex-col gap-4">
          <TabSwitch tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <TableCard>
            {isSaved && (
              <div className="rounded-xl border border-emerald-300 bg-[#EBF5EC] p-4 text-sm font-semibold text-emerald-900">
                {t('Company profile details saved successfully!')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'company' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Building className="h-5 w-5 text-theme-accent" />
                    {t('Company Information')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('Company Name')}
                      </label>
                      <input
                        type="text"
                        value={companyInfo.companyName}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('Business Registration Number')}
                      </label>
                      <input
                        type="text"
                        value={companyInfo.registrationNumber}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, registrationNumber: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('Email Address')}
                      </label>
                      <input
                        type="email"
                        value={companyInfo.email}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('Contact Phone')}
                      </label>
                      <input
                        type="text"
                        value={companyInfo.phone}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      {t('Business Description')}
                    </label>
                    <textarea
                      rows={3}
                      value={companyInfo.description}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-theme-accent" />
                    {t('Headquarters & Operating Address')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('Street Address')}
                      </label>
                      <input
                        type="text"
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('City')}
                      </label>
                      <input
                        type="text"
                        value={companyInfo.city}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        {t('Province')}
                      </label>
                      <input
                        type="text"
                        value={companyInfo.province}
                        onChange={(e) => setCompanyInfo({ ...companyInfo, province: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-theme-accent focus:outline-none focus:ring-1 focus:ring-theme-accent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-theme-accent" />
                    {t('Account & Security')}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t('Your company account is verified and active. Contact admin for ownership transfers.')}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-200/80">
                <button
                  type="submit"
                  className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="h-4 w-4" />
                  {t('Save Changes')}
                </button>
              </div>
            </form>
          </TableCard>
        </div>
      </div>
    </AppLayout>
  );
}
