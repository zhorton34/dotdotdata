import { data_set } from './data_set.ts';

/**
 * Fills a value in an object if it doesn't exist.
 *
 * @template T - The type of the target object. Defaults to a record with string keys and unknown values.
 * @param {T} target - The target object to fill.
 * @param {string} key - The key or path to fill.
 * @param {unknown} value - The value to fill with.
 * @returns {T} The modified target object.
 *
 * @example
 * ```ts
 * import { data_fill } from "@findhow/helpers";
 * 
 * // Basic usage
 * const obj = { a: { b: 1 } };
 * data_fill(obj, 'a.c', 2);
 * console.log(obj); // { a: { b: 1, c: 2 } }
 *
 * // Existing values are not overwritten
 * data_fill(obj, 'a.b', 3);
 * console.log(obj); // { a: { b: 1, c: 2 } }
 *
 * // Filling nested objects
 * const user = { name: 'John' };
 * data_fill(user, 'address.city', 'New York');
 * console.log(user); // { name: 'John', address: { city: 'New York' } }
 *
 * // Using with arrays
 * const arr = [{ name: 'Alice' }];
 * data_fill(arr, '0.age', 30);
 * data_fill(arr, '1.name', 'Bob');
 * console.log(arr); // [{ name: 'Alice', age: 30 }, { name: 'Bob' }]
 *
 * // Using wildcards
 * const users = [{ name: 'Alice' }, { name: 'Bob' }];
 * data_fill(users, '*.age', 25);
 * console.log(users); // [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }]
 *
 * // Handling non-object targets
 * console.log(data_fill('string', 'key', 'value')); // 'string'
 *
 * // Undefined values are not filled
 * const config = { debug: true };
 * data_fill(config, 'logLevel', undefined);
 * console.log(config); // { debug: true }
 * ```
 */
export function data_fill<T = Record<string, unknown>>(
  target: T,
  key: string,
  value: unknown,
): T {
  if (typeof target !== 'object' || target === null) {
    return target; // Return the original value for non-object targets
  }

  // Don't fill undefined values
  if (value === undefined) {
    return target;
  }

  // Use data_set with overwrite set to false
  return data_set(target, key, value, false) as T;
}
