import { router, usePage } from '@inertiajs/react';

export default function LanguageSwitcher() {
    const { locale = 'en', availableLocales = {} } = usePage().props;

    const changeLocale = (event) => {
        router.post(
            route('locale.update'),
            { locale: event.target.value },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <select
            value={locale}
            onChange={changeLocale}
            className="rounded-md border-gray-300 bg-white py-1.5 pe-8 ps-3 text-sm font-medium text-gray-600 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
            aria-label="Language"
        >
            {Object.entries(availableLocales).map(([value, label]) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}
