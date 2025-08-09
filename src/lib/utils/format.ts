/**
 * Formatting utilities for resume templates
 * Provides consistent date formatting and text joining functions
 */

/**
 * Format a date range for display
 * @param {string} [start] - Start date (e.g., "Jan 2020")
 * @param {string} [end] - End date (e.g., "Dec 2023" or "Present")
 * @returns {string} Formatted date range
 */
export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return '';
  if (!start) return end || '';
  if (!end) return start;
  
  // Handle "Present" case
  const endDisplay = end.toLowerCase() === 'present' ? 'Present' : end;
  
  return `${start} – ${endDisplay}`;
}

/**
 * Join non-empty values with a separator
 * @param {string[]} values - Array of string values
 * @param {string} [separator=' • '] - Separator to use between values
 * @returns {string} Joined string with only truthy values
 */
export function joinNonEmpty(values: string[], separator: string = ' • '): string {
  return values.filter(Boolean).join(separator);
}

/**
 * Format a contact line from header fields
 * @param {Object} fields - Header block fields
 * @returns {string} Formatted contact information
 */
export function formatContactLine(fields: Record<string, any>): string {
  const contactParts = [
    fields.email,
    fields.phone,
    fields.linkedin,
    fields.location,
  ];
  
  return joinNonEmpty(contactParts);
}

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Title case text
 */
export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
