import {
    LayoutDashboard,
    Users,
    UserCheck,
    ShieldAlert,
    Layers,
    CalendarDays,
    CreditCard,
    UserCircle,
    UserCog,
    FileText,
    Settings,
    MapPin,
    Wrench,
    Tag,
    Gift,
    HelpCircle,
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
                    label: t('Service Categories'),
                    icon: Layers,
                    href: '/admin/service-categories',
                    activePaths: ['/admin/service-categories*'],
                },
                {
                    label: t('Services'),
                    icon: Wrench,
                    href: '/admin/services',
                    activePaths: ['/admin/services*'],
                },
                {
                    label: t('Exclusive Offers'),
                    icon: Tag,
                    href: '/admin/exclusive-offers',
                    activePaths: ['/admin/exclusive-offers*'],
                },
                {
                    label: t('Rewards & Referral'),
                    icon: Gift,
                    href: '/admin/rewards',
                    activePaths: ['/admin/rewards*'],
                },
                {
                    label: t('Help & FAQs'),
                    icon: HelpCircle,
                    href: '/admin/faqs',
                    activePaths: ['/admin/faqs*'],
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
                    label: t('Service Areas'),
                    icon: MapPin,
                    href: '/company/service-areas',
                    activePaths: ['/company/service-areas*'],
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
