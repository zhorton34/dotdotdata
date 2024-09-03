import { transform } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('transform function', async (t) => {
  await t.step('should transform a non-blank value', () => {
    const result = transform(5, (x) => x * 2);
    assertEquals(result, 10);
  });

  await t.step('should return null for null input', () => {
    const result = transform(null, (x: number) => x * 2);
    assertEquals(result, null);
  });

  await t.step('should return null for undefined input', () => {
    const result = transform(undefined, (x: number) => x * 2);
    assertEquals(result, null);
  });

  await t.step('should use static default value for null input', () => {
    const result = transform(null, (x: number) => x * 2, 0);
    assertEquals(result, 0);
  });

  await t.step('should use function default value for undefined input', () => {
    const result = transform(undefined, (x: number) => x * 2, () => 1);
    assertEquals(result, 1);
  });

  await t.step('should transform a string', () => {
    const result = transform('hello', (s) => s.toUpperCase());
    assertEquals(result, 'HELLO');
  });

  await t.step('should handle empty string as non-blank', () => {
    const result = transform('', (s) => s + 'world');
    assertEquals(result, 'world');
  });

  await t.step('should handle array input', () => {
    const result = transform([1, 2, 3], (arr) => arr.map((x) => x * 2));
    assertEquals(result, [2, 4, 6]);
  });

  await t.step('should handle object input', () => {
    const result = transform({ a: 1 }, (obj) => ({ ...obj, b: 2 }));
    assertEquals(result, { a: 1, b: 2 });
  });
});
