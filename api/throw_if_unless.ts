/**
 * Throws an exception if the given condition is true.
 *
 * @param condition - The condition to check.
 * @param exception - The exception to throw.
 * @param message - The error message.
 * @throws The specified exception if the condition is true.
 *
 * @example
 * ```ts
 * import { throw_if } from "@findhow/helpers";
 *    
 * throw_if(x > 100, Error, "Value exceeds maximum");
 * ```
 */
export function throw_if(
  condition: boolean,
  exception: new (message: string) => Error,
  message: string,
): void {
  if (condition) {
    throw new exception(message);
  }
}

/**
 * Throws an exception unless the given condition is true.
 *
 * @param condition - The condition to check.
 * @param exception - The exception to throw.
 * @param message - The error message.
 * @throws The specified exception if the condition is false.
 *
 * @example
 * ```ts  
 * import { throw_unless } from "@findhow/helpers";
 * 
 * throw_unless(x > 0, Error, "Value must be positive");
 * ```
 */
export function throw_unless(
  condition: boolean,
  exception: new (message: string) => Error,
  message: string,
): void {
  if (!condition) {
    throw new exception(message);
  }
}
