/**
 * Remove an item from an array or object using "dot" notation.
 *
 * @template T - The type of the target object.
 * @param {T} target - The target object or array.
 * @param {string} key - The key to remove using "dot" notation.
 * @returns {T} The modified target.
 *
 * @example
 * ```ts
 * import { data_forget } from "@findhow/helpers";
 * 
 * const obj = { products: { desk: { price: 100 } } };
 * data_forget(obj, 'products.desk.price');
 * console.log(obj); // { products: { desk: {} } }
 * ```
 *
 * @example
 * ```ts
 * import { data_forget } from "@findhow/helpers";
 * const arr = [1, 2, 3, 4, 5];
 * data_forget(arr, '2');
 * console.log(arr); // [1, 2, 4, 5]
 * ```
 */
export function data_forget<T>(target: T, key: string): T {
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  const keys = key.split('.');
  let current: any = target;

  for (let i = 0; i < keys.length - 1; i++) {
    if (keys[i] === '*' && Array.isArray(current)) {
      current.forEach((item) => data_forget(item, keys.slice(i + 1).join('.')));
      return target;
    }
    if (current[keys[i]] === undefined) {
      return target;
    }
    current = current[keys[i]];
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey === '*' && Array.isArray(current)) {
    current.forEach((item) => {
      for (const prop in item) {
        delete item[prop];
      }
    });
  } else if (Array.isArray(current)) {
    const index = parseInt(lastKey, 10);
    if (!isNaN(index)) {
      current.splice(index, 1);
    }
  } else if (typeof current === 'object') {
    delete current[lastKey];
  }

  return target;
}
