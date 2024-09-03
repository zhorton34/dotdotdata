import { optional } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('optional function', async (t) => {
  await t.step('should return null for undefined input', () => {
    const result = optional(undefined);
    assertEquals(result, null);
  });

  await t.step('should return null for null input', () => {
    const result = optional(null);
    assertEquals(result, null);
  });

  await t.step('should return the object for non-null input', () => {
    const obj = { name: 'John' };
    const result = optional(obj);
    assertEquals(result, obj);
  });

  await t.step('should allow accessing properties on non-null objects', () => {
    const obj = { name: 'John', age: 30 };
    const result = optional(obj)?.name;
    assertEquals(result, 'John');
  });

  await t.step('should return undefined when calling non-existent methods', () => {
    const obj: { getName: () => string; getAge?: () => number } = { getName: () => 'John' };
    const result = optional(obj)?.getAge?.();
    assertEquals(result, undefined);
  });

  await t.step('should allow method calls on non-null objects', () => {
    const obj = { getName: () => 'John' };
    const result = optional(obj)?.getName();
    assertEquals(result, 'John');
  });

  await t.step('should return undefined when calling non-existent methods', () => {
    const obj: { getName: () => string; getAge?: () => number } = { getName: () => 'John' };
    const result = optional(obj)?.getAge?.();
    assertEquals(result, undefined);
  });
});
