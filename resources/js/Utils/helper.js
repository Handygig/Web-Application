export const toTitleCase = (text = '') =>
    text
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

export const getBookingStatusStyles = (status = '') => {
  const s = status.toLowerCase();
  switch (s) {
    case 'pending':
      return {
        badge: 'bg-amber-50 text-amber-700 border border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'confirmed':
      return {
        badge: 'bg-sky-50 text-sky-700 border border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'completed':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        badge: 'bg-red-50 text-red-700 border border-red-200',
        dot: 'bg-red-500',
      };
  }
};