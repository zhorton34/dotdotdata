/**
 * Represents a function that returns a value of type T.
 */
type ValueFunction<T> = () => T;

/**
 * Returns the value if it's not a function, otherwise calls the function and returns its result.
 *
 * @param value - The value or function to evaluate.
 * @returns {T} The value or the result of calling the function.
 *
 * @example
 * ```ts
 * import { value } from "@findhow/helpers";
 * 
 * value(5); // 5
 * value(() => 10); // 10
 * ```
 */
export function value<T>(value: T | ValueFunction<T>): T {
  return typeof value === 'function' ? (value as ValueFunction<T>)() : value;
}
