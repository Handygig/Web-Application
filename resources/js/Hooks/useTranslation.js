import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations } = usePage().props;

    function t(key, replacements = {}) {
        let value = translations?.[key] ?? key;

        Object.entries(replacements).forEach(([replaceKey, replaceValue]) => {
            value = value.replace(`:${replaceKey}`, String(replaceValue));
        });

        return value;
    }

    return { t };
}
