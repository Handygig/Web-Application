import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useTranslation } from '@/Hooks/useTranslation';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Other/PageHeader';
import TableCard from '@/Components/Cards/TableCard';
import DataTable from '@/Components/Table/DataTable';
import StatusToggleCell from '@/Components/Table/StatusToggleCell';
import SearchBar from '@/Components/Inputs/SearchBar';
import Paginator from '@/Components/Table/Paginator';
import EmptyState from '@/Components/Other/EmptyState';

const MOCK_CUSTOMERS = [
    { id: 1, full_name: 'James Whitfield', email: 'james.whitfield@email.com', phone: '+1 555-0101', joined: 'Jan 12, 2025', status: true },
    { id: 2, full_name: 'Priya Nair', email: 'priya.nair@email.com', phone: '+44 20 7946 0102', joined: 'Feb 3, 2025', status: true },
    { id: 3, full_name: 'Carlos Romero', email: 'carlos.romero@email.com', phone: '+34 91 123 4567', joined: 'Feb 18, 2025', status: false },
    { id: 4, full_name: 'Amelia Foster', email: 'amelia.foster@email.com', phone: '+61 2 9876 5432', joined: 'Mar 5, 2025', status: true },
    { id: 5, full_name: 'Yuki Tanaka', email: 'yuki.tanaka@email.com', phone: '+81 3-1234-5678', joined: 'Mar 22, 2025', status: true },
    { id: 6, full_name: 'Sofia Eriksson', email: 'sofia.eriksson@email.com', phone: '+46 8 123 456', joined: 'Apr 7, 2025', status: false },
    { id: 7, full_name: 'Omar Al-Rashid', email: 'omar.rashid@email.com', phone: '+971 4 123 4567', joined: 'Apr 14, 2025', status: true },
    { id: 8, full_name: 'Lena Hoffmann', email: 'lena.hoffmann@email.com', phone: '+49 30 12345678', joined: 'May 1, 2025', status: true },
];

export default function CustomerIndex() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);

    const filtered = customers.filter(
        (c) =>
            c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery),
    );

    function toggleStatus(id) {
        setCustomers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c)),
        );
    }

    const columns = [
        {
            key: 'full_name',
            label: t('Name'),
            className: 'w-[22%]',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-accent/10 text-xs font-bold text-theme-accent">
                        {row.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium text-slate-800">{row.full_name}</span>
                </div>
            ),
        },
        { key: 'email', label: t('Email'), className: 'w-[28%]' },
        { key: 'phone', label: t('Phone'), className: 'w-[18%]' },
        { key: 'joined', label: t('Joined'), className: 'w-[14%]', cellClassName: 'text-slate-500 text-sm' },
        {
            key: 'status',
            label: t('Status'),
            className: 'w-[18%]',
            render: (row) => (
                <StatusToggleCell
                    active={row.status}
                    onToggle={() => toggleStatus(row.id)}
                    activeLabel={t('Active')}
                    inactiveLabel={t('Banned')}
                />
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title={t('Customer Management')} />

            <div className="flex w-full flex-col gap-6">
                <PageHeader
                    title={t('Customer Management')}
                    description={t('View and manage all registered customers.')}
                    actionHref={route('admin.customers.create')}
                    actionLabel={t('Add Customer')}
                />

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('Search by name, email or phone…')}
                        className="w-full lg:max-w-[340px]"
                    />
                </div>

                <TableCard>
                    {filtered.length > 0 ? (
                        <>
                            <DataTable columns={columns} rows={filtered} rowKey="id" />
                            <Paginator links={[]} />
                        </>
                    ) : (
                        <EmptyState
                            icon={Users}
                            title={t('No Customers Found')}
                            description={
                                searchQuery
                                    ? t('Try adjusting your search query.')
                                    : t('No customers have registered yet.')
                            }
                        />
                    )}
                </TableCard>
            </div>
        </AppLayout>
    );
}
