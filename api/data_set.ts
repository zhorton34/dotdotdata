/**
 * Set an item on an array or object using dot notation.
 *
 * @param {Object|Array} obj - The object or array to set the value on
 * @param {string|Array} key - The key to set
 * @param {*} value - The value to set
 * @param {boolean} overwrite - Whether to overwrite existing values (default: true)
 * @returns {Object|Array} The modified object or array
 *
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Setting a simple value
 * const obj = {};
 * data_set(obj, 'name', 'John');
 * console.log(obj); // { name: 'John' }
 * ```
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Setting a nested value using dot notation
 * const user = { profile: {} };
 * data_set(user, 'profile.age', 30);
 * console.log(user); // { profile: { age: 30 } }
 * ```
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Using array notation
 * const arr = [];
 * data_set(arr, '0', 'First');
 * console.log(arr); // ['First']
 * ```
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Using wildcard to set values in an array
 * const users = [{ name: 'John' }, { name: 'Jane' }];
 * data_set(users, '*.age', 25);
 * console.log(users); // [{ name: 'John', age: 25 }, { name: 'Jane', age: 25 }]
 * ```
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Not overwriting existing values
 * const config = { debug: true };
 * data_set(config, 'debug', false, false);
 * console.log(config); // { debug: true }
 * ```
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Creating nested structures
 * const deep = {};
 * data_set(deep, 'very.deep.nested.property', 'value');
 * console.log(deep); // { very: { deep: { nested: { property: 'value' } } } }
 * ```
 * @example
 * ```ts
 * import { data_set } from "@findhow/helpers";
 *
 * // Using an array of keys
 * const obj = {};
 * data_set(obj, ['user', 'name'], 'Alice');
 * console.log(obj); // { user: { name: 'Alice' } }
 * ```
 */
export function data_set(
  obj: any,
  key: string | string[],
  value: any,
  overwrite: boolean = true,
): any {
  if (typeof obj !== 'object' || obj === null) {
    return value; // Return the value directly for non-object inputs
  }

  // Handle empty string key
  if (key === '' || (Array.isArray(key) && key.length === 0)) {
    if (overwrite || Object.keys(obj).length === 0) {
      return value;
    }
    return obj;
  }

  const segments = Array.isArray(key) ? key : key.split('.');
  let segment: string | number = segments[0];

  if (segments.length === 1) {
    if (overwrite || !(segment in obj)) {
      obj[segment] = value;
    }
    return obj;
  }

  if (segment === '*' && Array.isArray(obj)) {
    obj.forEach((item) => {
      data_set(item, segments.slice(1), value, overwrite);
    });
  } else {
    // Check if the segment is a numeric string and the object is an array
    if (Array.isArray(obj) && /^\d+$/.test(segment)) {
      segment = parseInt(segment, 10);
    }

    if (!(segment in obj) || typeof obj[segment] !== 'object') {
      // If the next segment is numeric, initialize as an array, otherwise as an object
      obj[segment] = /^\d+$/.test(segments[1]) ? [] : {};
    }
    data_set(obj[segment], segments.slice(1), value, overwrite);
  }

  return obj;
}
