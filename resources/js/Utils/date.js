/**
 * Format a date string (e.g. "2026-Jun", "2026-06-10 08:30:00") into a human-readable format like "June 2026".
 * 
 * @param {string} dateStr 
 * @returns {string}
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length >= 2) {
        const year = parts[0];
        const monthPart = parts[1];
        const months = {
            'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
            'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
            'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December',
            '01': 'January', '02': 'February', '03': 'March', '04': 'April',
            '05': 'May', '06': 'June', '07': 'July', '08': 'August',
            '09': 'September', '10': 'October', '11': 'November', '12': 'December'
        };
        const monthName = months[monthPart] || months[monthPart.substring(0, 3)] || monthPart;
        return `${monthName} ${year}`;
    }
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    } catch { }
    return dateStr;
};

export const formatDateTimeLocal = (date = new Date()) => {
    const pad = (value) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
};

export const getInitialDateTime = (selectedDate) => {
    const now = new Date();
    if (selectedDate) {
        let year = now.getFullYear();
        let month = now.getMonth();
        let date = now.getDate();

        if (typeof selectedDate === 'string') {
            const parts = selectedDate.split('-');
            if (parts.length === 3) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                date = parseInt(parts[2], 10);
            } else {
                const d = new Date(selectedDate);
                if (!isNaN(d.getTime())) {
                    // If parsed from UTC date-only string, getHours() in India (+05:30) is 5, but we want to adjust safely
                    // Using UTC methods to get the date parts ensures we get the actual YYYY-MM-DD from the ISO string
                    year = d.getUTCFullYear();
                    month = d.getUTCMonth();
                    date = d.getUTCDate();
                }
            }
        } else if (selectedDate instanceof Date) {
            year = selectedDate.getFullYear();
            month = selectedDate.getMonth();
            date = selectedDate.getDate();
        }

        const d = new Date(year, month, date, now.getHours(), now.getMinutes());
        return formatDateTimeLocal(d);
    }
    return formatDateTimeLocal(now);
};

export default {
    formatDate,
    formatDateTimeLocal,
    getInitialDateTime,
};
