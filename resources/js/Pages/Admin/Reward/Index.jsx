import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
  Gift,
  Award,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  History,
  CheckCircle2,
  Sliders,
  Sparkles,
  Save,
} from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import StatCard from '@/Components/Cards/StatCard';
import SearchBar from '@/Components/Inputs/SearchBar';
import DataTable from '@/Components/Table/DataTable';
import Paginator from '@/Components/Table/Paginator';
import EmptyState from '@/Components/Other/EmptyState';
import TabSwitch from '@/Components/Other/TabSwitch';
import AdjustCustomerBalanceModal from '@/Components/Modals/AdjustCustomerBalanceModal';

export default function RewardIndex({
  settings,
  customers,
  transactions,
  stats,
  filters,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('settings');

  // Search state for customers
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');

  // Adjust Modal state
  const [adjustCustomer, setAdjustCustomer] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Settings Form
  const { data, setData, put, processing, errors } = useForm({
    points_per_dollar: settings?.points_per_dollar || '10',
    points_redemption_rate: settings?.points_redemption_rate || '100',
    referrer_bonus: settings?.referrer_bonus || '20.00',
    referee_discount: settings?.referee_discount || '20.00',
    welcome_bonus_points: settings?.welcome_bonus_points || '250',
    silver_points_threshold: settings?.silver_points_threshold || '500',
    gold_points_threshold: settings?.gold_points_threshold || '1000',
    platinum_points_threshold: settings?.platinum_points_threshold || '2500',
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    put(route('admin.rewards.settings.update'), {
      preserveScroll: true,
    });
  };

  const handleSearchCustomers = (val) => {
    setSearchQuery(val);
    router.get(
      route('admin.rewards.index'),
      { search: val },
      { preserveState: true, replace: true }
    );
  };

  const customerList = customers?.data || [];
  const transactionList = transactions?.data || [];

  const customerColumns = [
    {
      key: 'customer',
      label: t('Customer'),
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 text-sm block">
            {row.user?.full_name || row.user?.name || 'Customer'}
          </span>
          <span className="text-xs text-slate-400 block">
            {row.user?.email || row.user?.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'tier',
      label: t('Tier Badge'),
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{row.membership_tier || 'Member'}</span>
        </span>
      ),
    },
    {
      key: 'points',
      label: t('Reward Points'),
      render: (row) => (
        <span className="font-black text-slate-900 text-sm">
          {Number(row.reward_points || 0).toLocaleString()}{' '}
          <span className="text-slate-400 font-semibold text-xs">pts</span>
        </span>
      ),
    },
    {
      key: 'wallet',
      label: t('Wallet Credits'),
      render: (row) => (
        <span className="font-extrabold text-theme-accent text-sm">
          ${Number(row.wallet_balance || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'code',
      label: t('Referral Code'),
      render: (row) => (
        <span className="inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs">
          {row.referral_code || '—'}
        </span>
      ),
    },
    {
      key: 'referrals',
      label: t('Friends Invited'),
      render: (row) => (
        <span className="font-bold text-slate-800 text-xs">
          {row.referrals_count || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      label: t('Actions'),
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setAdjustCustomer(row);
              setIsAdjustModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-theme-accent transition shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('Adjust Balance')}</span>
          </button>
        </div>
      ),
    },
  ];

  const transactionColumns = [
    {
      key: 'customer',
      label: t('Customer'),
      render: (row) => (
        <span className="font-bold text-slate-900 text-xs">
          {row.customer?.user?.full_name || row.customer?.user?.name || `Customer #${row.customer_id}`}
        </span>
      ),
    },
    {
      key: 'type',
      label: t('Type'),
      render: (row) => {
        const isPositive = row.points > 0 || Number(row.amount) > 0;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap ${
              row.type === 'points_redeemed'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : row.type === 'referral_bonus'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : isPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {row.type.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'points_amount',
      label: t('Points / Amount'),
      render: (row) => (
        <div className="text-xs font-mono font-bold">
          {row.points !== 0 && (
            <span className={row.points > 0 ? 'text-emerald-600 block' : 'text-rose-600 block'}>
              {row.points > 0 ? `+${row.points}` : row.points} pts
            </span>
          )}
          {Number(row.amount) !== 0 && (
            <span className={Number(row.amount) > 0 ? 'text-theme-accent block' : 'text-rose-600 block'}>
              {Number(row.amount) > 0 ? `+$${Number(row.amount).toFixed(2)}` : `-$${Math.abs(Number(row.amount)).toFixed(2)}`}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      label: t('Description'),
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium leading-relaxed">
          {row.description}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: t('Date & Time'),
      render: (row) => (
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
        </span>
      ),
    },
  ];

  return (
    <AppLayout>
      <Head title={t('Rewards & Referrals')} />

      <div className="flex w-full flex-col gap-6">
        {/* Page Header */}
        <PageHeader
          title={t('Rewards & Referral Management')}
          description={t('Configure point rules, referral cash bonuses, member tiers, and customer balance adjustments.')}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard
            label={t('Total Points Awarded')}
            value={stats?.total_points_distributed?.toLocaleString() ?? 0}
            icon={Award}
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-600"
          />
          <StatCard
            label={t('Total Wallet Balances')}
            value={`$${Number(stats?.total_wallet_balance || 0).toFixed(2)}`}
            icon={DollarSign}
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-600"
          />
          <StatCard
            label={t('Active Referrals')}
            value={stats?.total_referrals ?? 0}
            icon={Users}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-indigo-600"
          />
          <StatCard
            label={t('Points Redeemed')}
            value={stats?.total_points_redeemed?.toLocaleString() ?? 0}
            icon={TrendingUp}
            iconBgClass="bg-purple-50"
            iconColorClass="text-purple-600"
          />
        </div>

        {/* Tab Switcher */}
        <div>
          <TabSwitch
            tabs={[
              { key: 'settings', label: t('Program Configuration') },
              { key: 'customers', label: t('Customer Balances & Referrals') },
              { key: 'transactions', label: t('Transaction Activity Ledger') },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* TAB 1: SETTINGS */}
        {activeTab === 'settings' && (
          <TableCard>
            <div className="flex flex-col gap-1 border-b border-slate-100 p-5">
              <h3 className="text-base font-extrabold text-slate-900">
                {t('Loyalty Points & Referral Rules')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('Adjust the global multiplier, redemption exchange rate, and referral rewards for the mobile app.')}
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-5 flex flex-col gap-6">
              {/* Points & Redemption */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-theme-accent">
                  <Award className="w-4 h-4" />
                  <span>{t('Points & Conversion Rate')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Points Earned Per $1 Spent')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={data.points_per_dollar}
                      onChange={(e) => setData('points_per_dollar', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t('e.g. 10 points for every $1 paid on service bookings.')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Points Redemption Rate (pts per $1 Credit)')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={data.points_redemption_rate}
                      onChange={(e) => setData('points_redemption_rate', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t('e.g. 100 points converts to $1.00 in-app wallet balance.')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    {t('Welcome Registration Bonus (Points)')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={data.welcome_bonus_points}
                    onChange={(e) => setData('welcome_bonus_points', e.target.value)}
                    className="w-full sm:w-1/2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                  />
                </div>
              </div>

              {/* Referral Program */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-theme-accent">
                  <Gift className="w-4 h-4" />
                  <span>{t('Invite Friends & Referral Bonus ("Invite Friends, Get $20 Each")')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Referrer Bonus ($ Wallet Credit)')} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={data.referrer_bonus}
                      onChange={(e) => setData('referrer_bonus', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t('Amount awarded to the customer when a referred friend completes their 1st service.')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Friend Welcome Discount ($ Off)')} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={data.referee_discount}
                      onChange={(e) => setData('referee_discount', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t('Discount given to new customers using a friend referral code.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Membership Tiers Thresholds */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-theme-accent">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('VIP Membership Tier Thresholds (Points)')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Silver Tier')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={data.silver_points_threshold}
                      onChange={(e) => setData('silver_points_threshold', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Gold Tier')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={data.gold_points_threshold}
                      onChange={(e) => setData('gold_points_threshold', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('Platinum Tier')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={data.platinum_points_threshold}
                      onChange={(e) => setData('platinum_points_threshold', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold focus:border-theme-accent focus:ring-1 focus:ring-theme-accent bg-white shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-theme-accent hover:bg-theme-accent-hover inline-flex items-center gap-2 rounded-[12px] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{processing ? t('Saving Settings...') : t('Save Reward Configuration')}</span>
                </button>
              </div>
            </form>
          </TableCard>
        )}

        {/* TAB 2: CUSTOMERS */}
        {activeTab === 'customers' && (
          <TableCard>
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchCustomers}
                placeholder={t('Search customer, email, referral code...')}
                className="w-full sm:max-w-md"
              />
            </div>

            <div className="p-0">
              {customerList.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title={t('No customers found')}
                  description={t('No customer records matched your search query.')}
                />
              ) : (
                <>
                  <DataTable columns={customerColumns} rows={customerList} rowKey="id" />
                  <div className="border-t border-slate-100 p-4">
                    <Paginator links={customers?.links || []} />
                  </div>
                </>
              )}
            </div>
          </TableCard>
        )}

        {/* TAB 3: TRANSACTIONS LEDGER */}
        {activeTab === 'transactions' && (
          <TableCard>
            <div className="flex flex-col gap-1 border-b border-slate-100 p-5">
              <h3 className="text-base font-extrabold text-slate-900">
                {t('Reward & Wallet Ledger')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('Real-time audit trail of all points earned, redeemed, and wallet credits across the platform.')}
              </p>
            </div>

            <div className="p-0">
              {transactionList.length === 0 ? (
                <EmptyState
                  icon={History}
                  title={t('No transactions yet')}
                  description={t('Transaction history will appear here as customers earn and redeem rewards.')}
                />
              ) : (
                <>
                  <DataTable columns={transactionColumns} rows={transactionList} rowKey="id" />
                  <div className="border-t border-slate-100 p-4">
                    <Paginator links={transactions?.links || []} />
                  </div>
                </>
              )}
            </div>
          </TableCard>
        )}
      </div>

      {/* Adjust Balance Modal */}
      <AdjustCustomerBalanceModal
        open={isAdjustModalOpen}
        customer={adjustCustomer}
        onClose={() => {
          setIsAdjustModalOpen(false);
          setAdjustCustomer(null);
        }}
      />
    </AppLayout>
  );
}
