// lib/dateUtils.js - Centralized date handling utilities

/**
 * Parse various date string formats into Date objects
 * Supports: ISO, DD/MM/YYYY, YYYY-MM-DD, timestamp
 * @param {string|number} dateString - The date string to parse
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export function parseDate(dateString) {
  if (!dateString) return null; 
  
  try {
    const s = String(dateString).trim();
    
    // Handle timestamp (numeric)
    if (/^\d+$/.test(s)) {
      const num = Number(s);
      return num < 1e12 ? new Date(num * 1000) : new Date(num);
    }
    
    // PRIORITY: Handle DD/MM/YYYY or DD-MM-YYYY format FIRST
    // This prevents native Date from misinterpreting as MM/DD/YYYY
    const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[T\s]+(\d{1,2}):(\d{2}))?$/);
    if (dmy) {
      const [, day, month, year, hour, minute] = dmy;
      return new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day), 
        parseInt(hour) || 0, 
        parseInt(minute) || 0
      );
    }
    
    // Handle YYYY/MM/DD or YYYY-MM-DD format (ISO-like)
    const ymd = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2}))?$/);
    if (ymd) {
      const [, year, month, day, hour, minute] = ymd;
      return new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day), 
        parseInt(hour) || 0, 
        parseInt(minute) || 0
      );
    }
    
    // Fallback: Try native Date parsing for ISO format
    const native = new Date(s);
    if (!isNaN(native.getTime())) return native;
    
    // Handle alternative formats (replace dots with hyphens)
    const alt = new Date(s.replace(/\./g, "-"));
    if (!isNaN(alt.getTime())) return alt;
    
  } catch (err) {
    console.warn("Date parse error:", err);
  }
  
  return null;
}

/**
 * Format a date to DD/MM/YYYY HH:MM format for display
 * @param {Date} date - The date to format
 * @param {number} hour - Hour component (optional, overrides date hour)
 * @returns {string} - Formatted date string
 */
export function formatDateTimeForDisplay(date, hour = null) {
  if (!date) return "";
  
  const d = new Date(date);
  if (hour !== null) {
    d.setHours(hour, 0, 0, 0);
  }
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  
  return `${day}/${month}/${year} ${hours}:00`;
}

/**
 * Format a date to ISO string (YYYY-MM-DD) for form inputs
 * @param {Date} date - The date to format
 * @returns {string} - ISO date string
 */
export function formatDateForInput(date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

/**
 * Format a date to ISO string with time for database storage
 * @param {Date} date - The date to format
 * @returns {string} - ISO string with timezone
 */
/**
 * Format a date to ISO string with time for database storage
 * IMPORTANT: This forces the output to look like IST time but stored as pseudo-UTC (+00:00)
 * Example: 9:00 AM IST -> "YYYY-MM-DDT09:00:00.000Z" (DB stores 09:00)
 * @param {Date} date - The date to format
 * @returns {string} - ISO string with timezone
 */
export function formatDateTimeForDB(date) {
  if (!date) return "";
  
  // Creates a new Date object that represents the same clock time in UTC
  // e.g., if local is 9:00 AM, this creates a UTC date of 9:00 AM
  const d = new Date(date);
  const userTimezoneOffset = d.getTimezoneOffset() * 60000; // Offset in ms
  
  // Add 5 hours 30 mins (IST offset) manually? 
  // No, the robust way for single-timezone app:
  // We want DB to store "Face Value".
  // So we take Local Time components and construct a UTC date with them.
  const utcDate = new Date(Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ));
  
  return utcDate.toISOString();
}

/**
 * Parse date string from sessionStorage (DD/MM/YYYY format)
 * @param {string} dateString - Date string from sessionStorage
 * @returns {Date|null} - Parsed Date object
 */
export function parseDateFromSessionStorage(dateString) {
  if (!dateString) return null;
  
  try {
    // Handle format: "DD/MM/YYYY HH:MM"
    const parts = dateString.split(" ");
    const datePart = parts[0]; // "DD/MM/YYYY"
    const timePart = parts[1]; // "HH:MM"
    
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart ? timePart.split(":") : [0, 0];
    
    return new Date(
      parseInt(year), 
      parseInt(month) - 1, 
      parseInt(day), 
      parseInt(hour), 
      parseInt(minute)
    );
  } catch (err) {
    console.warn("Session storage date parse error:", err);
    return null;
  }
}

/**
 * Parse DD/MM/YYYY format for booking raw datetime fields
 * This ensures consistent date interpretation across the application
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {Date|null} - Parsed Date object
 */
export function parseBookingRawDateTime(dateString) {
  if (!dateString) return null;
  
  try {
    // Handle format: "DD/MM/YYYY HH:MM"
    const parts = dateString.split(" ");
    const datePart = parts[0]; // "DD/MM/YYYY"
    const timePart = parts[1]; // "HH:MM"
    
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart ? timePart.split(":") : [0, 0];
    
    // Ensure we're interpreting DD/MM/YYYY format correctly
    const parsedDate = new Date(
      parseInt(year), 
      parseInt(month) - 1, // month is 0-indexed
      parseInt(day), 
      parseInt(hour), 
      parseInt(minute)
    );
    
    // Validate the parsed date
    if (isNaN(parsedDate.getTime())) {
      console.warn("Invalid booking raw date:", dateString);
      return null;
    }
    
    return parsedDate;
  } catch (err) {
    console.warn("Booking raw date parse error:", err, "Input:", dateString);
    return null;
  }
}

/**
 * Format date for URL parameters
 * @param {Date} date - The date to format
 * @param {number} hour - Hour component
 * @returns {string} - URL-safe date string
 */
export function formatDateForURL(date, hour) {
  if (!date) return "";
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return encodeURIComponent(formatDateTimeForDisplay(d));
}

/**
 * Validate date range (start should be before end)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} - True if valid range
 */
export function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  return new Date(startDate) < new Date(endDate);
}

/**
 * Get minimum date (today)
 * @returns {Date} - Today's date at 00:00
 */
export function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}