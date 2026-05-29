const startYear = 2026;
const currentYear = new Date().getFullYear();
const copyrightElement = document.getElementById('copyright');

// Only updates the text if the year becomes 2027 or later
if (currentYear > startYear) {
    copyrightElement.innerHTML = `&copy; ${startYear}–${currentYear} DalanDan. All rights reserved.`;
}