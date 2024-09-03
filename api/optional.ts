/**
 * Provides a way to access properties or call methods on an object that might be null or undefined.
 *
 * @template T - The type of the input value.
 * @param {T | null | undefined} value - The value to wrap.
 * @returns {Proxy} A proxy object that allows safe property access and method calls.
 *
 * @example
 * ```ts
 * import { optional } from "@findhow/helpers";
 * 
 * const user = { name: 'John', getAge: () => 30 };
 * console.log(optional(user).name); // 'John'
 * console.log(optional(user).getAge()); // 30
 * console.log(optional(user).nonExistent); // undefined
 * console.log(optional(null).anything); // undefined
 * console.log(optional(undefined).method?()); // undefined
 * ```
 */
export function optional<T>(value: T | null | undefined): T | null {
  if (value === null || value === undefined) {
    return null;
  }

  return value;
}
