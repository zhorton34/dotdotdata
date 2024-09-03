/**
 * Passes the value to the callback function and returns the original value.
 * This function is useful for performing side effects on a value without changing the value itself.
 *
 * @template T - The type of the value being tapped.
 * @param {T} value - The value to be passed to the callback function.
 * @param {(value: T) => void} callback - The function to be called with the value.
 * @returns {T} The original value, unchanged.
 *
 * @example
 * ```ts
 * import { tap } from "@findhow/helpers";
 * 
 * // Logging a value without changing it
 * const result = tap(5, (value) => console.log(`The value is ${value}`));
 * // Logs: "The value is 5"
 * // result is 5
 *```
 *
 * @example
 * ```ts
 * import { tap } from "@findhow/helpers";
 * 
 * // Modifying an object in place
 * const user = { name: "John" };
 * const result = tap(user, (obj) => obj.age = 30);
 * // user and result are both { name: "John", age: 30 }
 *```
 *
 * @example
 * ```ts
 * import { tap } from "@findhow/helpers";
 * 
 * // Using with method chaining
 * const numbers = [1, 2, 3, 4, 5];
 * const result = numbers
 *   .map(n => n * 2)
 *   .tap(arr => console.log(`Doubled array: ${arr}`))
 *   .filter(n => n > 5);
 * // Logs: "Doubled array: 2,4,6,8,10"
 * // result is [6, 8, 10]
 *```
 */
export function tap<T>(value: T, callback: (value: T) => void): T {
  callback(value);
  return value;
}
