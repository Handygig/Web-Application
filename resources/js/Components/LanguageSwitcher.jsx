import { router, usePage } from '@inertiajs/react';

export default function LanguageSwitcher() {
    const { locale, availableLocales } = usePage().props;

    function changeLocale(newLocale) {
        router.post(
            route('locale.change'),
            { locale: newLocale },
            {
                preserveScroll: true,
            }
        );
    }

    return (
        <select
            value={locale}
            onChange={(event) => changeLocale(event.target.value)}
            className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
            {Object.entries(availableLocales).map(([code, name]) => (
                <option key={code} value={code}>
                    {name}
                </option>
            ))}
        </select>
    );
}