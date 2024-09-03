/**
 * Checks if a value is considered blank or empty.
 *
 * @param value - The value to check.
 * @returns {boolean} True if the value is blank, false otherwise.
 *
 * @example
 * ```ts
 * import { blank } from "@findhow/helpers";
 * 
 * blank(undefined); // true
 * blank(null); // true
 * blank(""); // true
 * blank([]); // true
 * blank({}); // true
 * blank(0); // false
 * blank(false); // false
 * ```
 */
export function blank(value: unknown): boolean {
  if (typeof value === 'undefined') {
    return true;
  }

  if (value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }

  // Handle numbers, booleans, and functions
  return false;
}
