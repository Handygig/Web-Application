/**
 * Utility functions for Sri Lankan (+94) and international phone number formatting & validation
 */

export const formatSriLankanPhoneDigits = (raw) => {
  if (!raw) return '';
  // Extract digits only
  let digits = raw.replace(/\D/g, '');

  // If user typed 0771234567 (10 digits starting with 0), strip leading 0 -> 771234567
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Limit to max 9 digits for Sri Lanka local format
  return digits.slice(0, 9);
};

export const formatPhoneDisplay = (digits, countryCode = '+94') => {
  if (!digits) return '';

  if (countryCode === '+94') {
    const clean = formatSriLankanPhoneDigits(digits);
    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
  }

  return digits;
};

export const validatePhone = (digits, countryCode = '+94', t = (s) => s) => {
  if (!digits || !digits.trim()) {
    return t('Phone number is required.');
  }

  if (countryCode === '+94') {
    const cleanDigits = formatSriLankanPhoneDigits(digits);
    if (cleanDigits.length !== 9) {
      return t('Sri Lankan phone numbers (+94) must contain exactly 9 digits (e.g., 77 123 4567).');
    }
  } else {
    const clean = digits.replace(/\D/g, '');
    if (clean.length < 7 || clean.length > 12) {
      return t('Please enter a valid phone number (7 to 12 digits).');
    }
  }

  return '';
};
