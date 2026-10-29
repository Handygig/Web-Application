import {
    LayoutDashboard,
    Users,
    UserCheck,
    Layers,
    CalendarDays,
    CreditCard,
    UserCircle,
    UserCog,
    Wrench,
    Tag,
    Gift,
    HelpCircle,
    Briefcase,
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
                    label: t('Jobs'),
                    icon: Briefcase,
                    children: [
                        { label: t('Search'), href: '/company/jobs/search', activePaths: ['/company/jobs/search'] },
                        { label: t('New Requests'), href: '/company/jobs/search?status=new', activePaths: ['/company/jobs/search?status=new*'] },
                        { label: t('Assignments'), href: '/company/jobs/assignments', activePaths: ['/company/jobs/assignments*'] },
                    ],
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
