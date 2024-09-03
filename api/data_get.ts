/**
 * Retrieves a value from a nested object or array using dot notation.
 *
 * @param target - The object or array to retrieve the value from.
 * @param path - The path to the value, either as a string with dot notation or an array of keys.
 * @param fallback - Optional fallback value or function to return if the path doesn't exist.
 * @returns {T | undefined} The value at the specified path, the fallback value, or undefined.
 *
 * @example
 * ```ts
 * import { data_get } from "@findhow/helpers";
 * 
 * const obj = { a: { b: { c: 1 } }, d: [1, 2, 3] };
 * data_get(obj, 'a.b.c'); // 1
 * data_get(obj, 'd.1'); // 2
 * data_get(obj, 'e.f', 'default'); // 'default'
 * data_get(obj, 'a.*.c'); // [1]
 *```
 
 * @example
 * ```ts
 * import { data_get } from "@findhow/helpers";
 *
 *  // Using array path
 * data_get(obj, ['a', 'b', 'c']); // 1
 *```
 * 
 * @example
 * ```ts
 * import { data_get } from "@findhow/helpers";
 * 
 * // Nested array access
 * const nestedObj = { users: [{ name: 'John', posts: [{ title: 'Hello' }] }] };
 * data_get(nestedObj, 'users.0.posts.0.title'); // 'Hello'
 *```
 * 
 * @example
 * ```ts
 * import { data_get } from "@findhow/helpers";
 * 
 * // Using wildcard with multiple matches
 * const multiObj = { x: [{ y: 1 }, { y: 2 }] };
 * data_get(multiObj, 'x.*.y'); // [1, 2]
 *```
 *
 * @example
 *```ts
 * import { data_get } from "@findhow/helpers";
 * 
 * // Using fallback function
 * data_get(obj, 'nonexistent.path', () => 'computed fallback'); // 'computed fallback'
 *```
 * @example
 * ```ts
 * import { data_get } from "@findhow/helpers";
 * 
 * 
 * // Invalid paths
 * data_get(obj, 'a.b.c.d'); // undefined
 * data_get(obj, 'a.b.c.d', 'fallback'); // 'fallback'
 * data_get(null, 'any.path'); // undefined
 * data_get(undefined, 'any.path'); // undefined
 * data_get({}, ''); // {}
 * ```
 */
export function data_get<T>(
  target: Record<string, any>,
  path: string | string[],
  fallback?: T | (() => T),
): T | undefined {
  if (path === '' || (Array.isArray(path) && path.length === 0)) {
    return target as T;
  }

  const segments = Array.isArray(path) ? path : path.split('.');

  if (segments.length === 0) {
    return target as T;
  }

  let current: any = target;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (segment === '*') {
      if (typeof current !== 'object' || current === null) {
        return typeof fallback === 'function'
          ? (fallback as () => T)()
          : fallback;
      }
      const output: any[] = [];
      for (const key in current) {
        const value = data_get(current[key], segments.slice(i + 1), fallback);
        if (value !== undefined) {
          output.push(value);
        }
      }
      return output.length > 0
        ? output as T
        : (typeof fallback === 'function' ? (fallback as () => T)() : fallback);
    }

    if (
      current === null || typeof current !== 'object' || !(segment in current)
    ) {
      return typeof fallback === 'function'
        ? (fallback as () => T)()
        : fallback;
    }

    current = current[segment];
  }

  return current as T;
}
