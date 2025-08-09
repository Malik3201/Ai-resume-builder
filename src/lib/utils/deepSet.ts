/**
 * Deep object path setter utility
 * Safely sets nested object properties using dot notation
 */

/**
 * Sets a value at a nested object path, creating intermediate objects as needed
 * @param {Object} obj - Target object to modify
 * @param {string} path - Dot-separated path (e.g., 'a.b.c')
 * @param {any} value - Value to set
 * @returns {Object} The modified object (mutated in place)
 */
export function deepSet(obj, path, value) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('deepSet: target must be an object');
  }

  if (typeof path !== 'string') {
    throw new Error('deepSet: path must be a string');
  }

  const keys = path.split('.');
  let current = obj;

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    // Create nested object if it doesn't exist or isn't an object
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    
    current = current[key];
  }

  // Set the final value
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}
