import {
    LayoutDashboard,
    Users,
    Briefcase,
    Layers,
    CalendarDays,
    CreditCard,
    UserCircle,
    Building2,
    UserCog,
} from 'lucide-react';

// Export a factory that accepts a translation function `t` (from `useTranslation()`)
export function getNavByRole(t) {
    const adminNav = [
        {
            label: t('Dashboard'),
            icon: LayoutDashboard,
            href: '/admin/dashboard',
        },
        {
            label: t('Provider Management'),
            icon: Briefcase,
            children: [
                { label: t('View Providers'), href: '/admin/providers' },
                { label: t('KYC / KYB Approvals'), href: '/admin/providers/kyc' },
                { label: t('Banned Accounts'), href: '/admin/providers/banned' },
            ],
        },
        {
            label: t('Customer Management'),
            icon: Users,
            href: '/admin/customers',
            activePaths: ['/admin/customers*'],
        },
        {
            label: t('Property Types'),
            icon: Building2,
            href: '/admin/property-types',
            activePaths: ['/admin/property-types*'],
        },
        {
            label: t('Job Types'),
            icon: Layers,
            href: '/admin/job-types',
            activePaths: ['/admin/job-types*'],
        },
        {
            label: t('Bookings'),
            icon: CalendarDays,
            href: '/admin/bookings',
            activePaths: ['/admin/bookings*'],
        },
        {
            label: t('Profile'),
            icon: UserCircle,
            href: '/admin/profile',
        },
    ];

    const companyNav = [
        {
            label: t('Dashboard'),
            icon: LayoutDashboard,
            href: '/company/dashboard',
        },
        {
            label: t('Employee Management'),
            icon: UserCog,
            href: '/company/employees',
            activePaths: ['/company/employees*'],
        },
        {
            label: t('Bookings'),
            icon: CalendarDays,
            href: '/company/bookings',
            activePaths: ['/company/bookings*'],
        },
        {
            label: t('Payments'),
            icon: CreditCard,
            href: '/company/payments',
            activePaths: ['/company/payments*'],
        },
    ];

    return {
        admin: adminNav,
        company: companyNav,
    };
}
