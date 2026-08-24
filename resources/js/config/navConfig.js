import {
    LayoutDashboard,
    Users,
    UserCheck,
    ShieldAlert,
    Layers,
    CalendarDays,
    CreditCard,
    UserCircle,
    Building2,
    UserCog,
    FileText,
    Settings,
} from 'lucide-react';

export function getNavByRole(t) {
    const adminNav = [
        {
            category: t('MENU'),
            items: [
                {
                    label: t('Dashboard'),
                    icon: LayoutDashboard,
                    href: '/admin/dashboard',
                },
                {
                    label: t('Bookings'),
                    icon: CalendarDays,
                    href: '/admin/bookings',
                    activePaths: ['/admin/bookings*'],
                },
                {
                    label: t('Customers'),
                    icon: Users,
                    href: '/admin/customers',
                    activePaths: ['/admin/customers*'],
                },
            ],
        },
        {
            category: t('MANAGEMENT'),
            items: [
                {
                    label: t('Provider Management'),
                    icon: UserCheck,
                    children: [
                        { label: t('View Providers'), href: '/admin/providers' },
                        { label: t('KYC / KYB Approvals'), href: '/admin/providers/kyc' },
                        { label: t('Banned Accounts'), href: '/admin/providers/banned' },
                    ],
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
                    label: t('Audit Logs'),
                    icon: FileText,
                    href: '/admin/audit-logs',
                    activePaths: ['/admin/audit-logs*'],
                },
            ],
        },
        {
            category: t('GENERAL'),
            items: [
                {
                    label: t('Profile Settings'),
                    icon: UserCircle,
                    href: '/admin/profile',
                },
            ],
        },
    ];

    const companyNav = [
        {
            category: t('MENU'),
            items: [
                {
                    label: t('Dashboard'),
                    icon: LayoutDashboard,
                    href: '/company/dashboard',
                },
                {
                    label: t('Bookings'),
                    icon: CalendarDays,
                    href: '/company/bookings',
                    activePaths: ['/company/bookings*'],
                },
            ],
        },
        {
            category: t('MANAGEMENT'),
            items: [
                {
                    label: t('Employee Management'),
                    icon: UserCog,
                    href: '/company/employees',
                    activePaths: ['/company/employees*'],
                },
                {
                    label: t('Payments'),
                    icon: CreditCard,
                    href: '/company/payments',
                    activePaths: ['/company/payments*'],
                },
            ],
        },
        {
            category: t('GENERAL'),
            items: [
                {
                    label: t('Profile'),
                    icon: UserCircle,
                    href: '/company/profile',
                },
            ],
        },
    ];

    return {
        admin: adminNav,
        company: companyNav,
    };
}
