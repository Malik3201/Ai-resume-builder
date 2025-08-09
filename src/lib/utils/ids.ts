/**
 * Simple ID generation utility
 * Provides unique identifiers for resume components
 */

/**
 * Generates a unique ID with optional prefix
 * @param {string} [prefix='id'] - Prefix for the generated ID
 * @returns {string} Generated unique ID
 */
export const uid = (prefix = 'id') => prefix + '_' + Math.random().toString(36).slice(2, 10);
