import { filled } from './filled.ts';

/**
 * Transform the given value if it is not blank.
 *
 * @param value - The value to transform.
 * @param callback - The callback to transform the value.
 * @param defaultValue - The default value to return if the value is blank.
 * @returns The transformed value, or the default value if the value is blank.
 *
 * @example
 * ```ts
 * import { transform } from "@findhow/helpers";
 *     
 * // Basic usage
 * const result1 = transform("hello", (str) => str.toUpperCase());
 * console.log(result1); // "HELLO"
 *```
 *
 * @example
 * ```ts
 * import { transform } from "@findhow/helpers";
 * 
 * // Using with a blank value
 * const result2 = transform("", (str) => str.toUpperCase());
 * console.log(result2); // null
 *```
 *
 * @example
 * ```ts
 * import { transform } from "@findhow/helpers";
 * 
 * // Using with a default value
 * const result3 = transform("", (str) => str.toUpperCase(), "DEFAULT");
 * console.log(result3); // "DEFAULT"
 *```
 *
 * @example
 * ```ts
 * import { transform } from "@findhow/helpers";
 * 
 * // Using with a default value function
 * const result4 = transform("", (str) => str.toUpperCase(), () => "COMPUTED DEFAULT");
 * console.log(result4); // "COMPUTED DEFAULT"
 *```
 * @example
 * ```ts
 * import { transform } from "@findhow/helpers";
 * 
 * // Transforming numbers
 * const result5 = transform(5, (num) => num * 2);
 * console.log(result5); // 10
 *```
 */
export function transform<T, U>(
  value: T,
  callback: (value: NonNullable<T>) => U,
  defaultValue?: U | (() => U),
): U | null {
  if (filled(value) || value === '') {
    return callback(value as NonNullable<T>);
  }

  if (typeof defaultValue === 'function') {
    return (defaultValue as () => U)();
  }

  return defaultValue ?? null;
}
