import { blank } from './blank.ts';

/**
 * Checks if a value is not blank or empty.
 *
 * @param value - The value to check.
 * @returns {boolean} True if the value is not blank, false otherwise.
 *
 * @example
 * ```ts
 * import { filled } from "@findhow/helpers";
 * 
 * filled(null); // false
 * filled(""); // false
 * filled(0); // true
 * filled([1, 2, 3]); // true
 * ```
 */
export function filled(value: unknown): boolean {
  return !blank(value);
}
