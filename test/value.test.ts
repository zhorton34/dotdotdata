import { value } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('value function', async (t) => {
  await t.step("should return a number if it's not a function", () => {
    assertEquals(value(5), 5);
  });

  await t.step("should return a string if it's not a function", () => {
    assertEquals(value('hello'), 'hello');
  });

  await t.step("should return a boolean if it's not a function", () => {
    assertEquals(value(true), true);
  });

  await t.step("should return null if it's not a function", () => {
    assertEquals(value(null), null);
  });

  await t.step("should return undefined if it's not a function", () => {
    assertEquals(value(undefined), undefined);
  });

  await t.step("should call the function and return its result if it's a function", () => {
    const func = () => 10;
    assertEquals(value(func), 10);
  });

  await t.step('should work with arrow functions', () => {
    assertEquals(value(() => 'arrow'), 'arrow');
  });

  await t.step('should work with async functions', async () => {
    const asyncFunc = async () => 'async result';
    assertEquals(await value(asyncFunc), 'async result');
  });

  await t.step('should handle nested functions', () => {
    const nestedFunc = () => () => 'nested';
    assertEquals(value(nestedFunc)(), 'nested');
  });

  await t.step('should work with object methods', () => {
    const obj = {
      method: () => 'object method',
    };
    assertEquals(value(obj.method), 'object method');
  });
});
