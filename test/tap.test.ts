import { tap } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('tap function', async (t) => {
  await t.step('should pass the value to the callback', () => {
    let tappedValue;
    const result = tap(5, (value) => {
      tappedValue = value;
    });
    assertEquals(tappedValue, 5);
    assertEquals(result, 5);
  });

  await t.step('should return the original value', () => {
    const result = tap(5, (value) => value * 2);
    assertEquals(result, 5);
  });

  await t.step('should work with objects', () => {
    const obj: { name: string; age?: number } = { name: 'John' };
    let tappedObj;
    const result = tap(obj, (value) => {
      tappedObj = value;
      value.age = 30;
    });
    assertEquals(tappedObj, { name: 'John', age: 30 });
    assertEquals(result, { name: 'John', age: 30 });
  });

  await t.step('should work with arrays', () => {
    const arr = [1, 2, 3];
    let tappedArr;
    const result = tap(arr, (value) => {
      tappedArr = value;
      value.push(4);
    });
    assertEquals(tappedArr, [1, 2, 3, 4]);
    assertEquals(result, [1, 2, 3, 4]);
  });
});
