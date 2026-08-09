export const toTitleCase = (text = '') =>
    text
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());