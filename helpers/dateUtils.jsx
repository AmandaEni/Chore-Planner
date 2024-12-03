/**
 * Utility functions for date handling and formatting with backend compatibility
 */

/**
 * Get today's date in 'YYYY-MM-DD' format
 * @returns {string} Formatted date string
 */
export const getTodayDate = () => {
  const today = new Date();
  return formatDate(today);
};

/**
 * Format a JavaScript Date object into 'YYYY-MM-DD' format
 * Ensures compatibility with backend database requirements.
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string (e.g., 'YYYY-MM-DD') into a JavaScript Date object
 * Ensures accurate date processing for backend integration.
 * @param {string} dateString - Date string in 'YYYY-MM-DD' format
 * @returns {Date} JavaScript Date object
 */
export const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Months are 0-indexed in JavaScript
};

/**
 * Get the day of the week for a given date
 * Useful for organizing data for backend operations.
 * @param {Date|string} date - JavaScript Date object or 'YYYY-MM-DD' string
 * @returns {string} Day of the week (e.g., 'Monday')
 */
export const getDayOfWeek = (date) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  return daysOfWeek[dateObj.getDay()];
};

/**
 * Check if two dates are the same day
 * Useful for backend comparisons.
 * @param {Date|string} date1 - First date (JavaScript Date object or 'YYYY-MM-DD' string)
 * @param {Date|string} date2 - Second date (JavaScript Date object or 'YYYY-MM-DD' string)
 * @returns {boolean} True if the dates are the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = typeof date1 === "string" ? parseDate(date1) : date1;
  const d2 = typeof date2 === "string" ? parseDate(date2) : date2;
  return d1.toDateString() === d2.toDateString();
};

/**
 * Add a specific number of days to a given date
 * Ensures database-friendly date manipulation.
 * @param {Date|string} date - JavaScript Date object or 'YYYY-MM-DD' string
 * @param {number} days - Number of days to add
 * @returns {string} New date string in 'YYYY-MM-DD' format
 */
export const addDays = (date, days) => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  const newDate = new Date(dateObj);
  newDate.setDate(newDate.getDate() + days);
  return formatDate(newDate);
};

/**
 * Get a list of dates for the current week (Monday to Sunday)
 * Formats dates for backend-friendly entries.
 * @returns {string[]} Array of date strings in 'YYYY-MM-DD' format
 */
export const getCurrentWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Adjust to Monday
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(formatDate(addDays(startOfWeek, i)));
  }
  return weekDates;
};

/**
 * Convert a JavaScript Date object into a user-friendly string
 * Provides frontend-friendly output while maintaining backend compatibility.
 * @param {Date|string} date - JavaScript Date object or 'YYYY-MM-DD' string
 * @returns {string} User-friendly formatted date string
 */
export const formatToReadableDate = (date) => {
  const dateObj = typeof date === "string" ? parseDate(date) : date;
  const options = { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Get a relative time description for a given date
 * Useful for frontend displays and backend metadata.
 * @param {Date|string} date - JavaScript Date object or 'YYYY-MM-DD' string
 * @returns {string} Relative time description
 */
export const getRelativeTime = (date) => {
  const today = new Date();
  const targetDate = typeof date === "string" ? parseDate(date) : date;

  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 7) return "This Week";
  if (diffDays > 7) return "Next Week";
  if (diffDays < 0 && diffDays >= -7) return "Last Week";
  return formatToReadableDate(targetDate);
};

/**
 * Backend-safe export of all utility functions
 */
export default {
  getTodayDate,
  formatDate,
  parseDate,
  getDayOfWeek,
  isSameDay,
  addDays,
  getCurrentWeekDates,
  formatToReadableDate,
  getRelativeTime,
};
