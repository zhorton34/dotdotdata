/**
 * Attempts to execute a callback until it succeeds or the maximum attempt count is reached.
 *
 * @param callback - The function to execute.
 * @param times - The maximum number of attempts.
 * @param sleepMilliseconds - The number of milliseconds to wait between attempts.
 * @returns A promise that resolves with the callback's return value.
 * @throws The last error encountered if all attempts fail.
 *
 * @example
 * ```ts
 * import { retry } from "@findhow/helpers";
 * 
 * const result = await retry(async () => {
 *   // Some operation that might fail
 *   return await someAsyncOperation();
 * }, 3, 1000);
 * ```
 */
export async function retry<T>(
  callback: () => Promise<T> | T,
  times: number,
  sleepMilliseconds: number = 0,
): Promise<T> {
  let attempts = 0;
  let lastError: unknown;

  while (attempts < times) {
    try {
      return await callback();
    } catch (error) {
      lastError = error;
      attempts++;

      if (attempts < times && sleepMilliseconds > 0) {
        await new Promise((resolve) => setTimeout(resolve, sleepMilliseconds));
      }
    }
  }

  throw lastError;
}
