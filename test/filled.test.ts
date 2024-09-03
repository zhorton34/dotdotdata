import { filled } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('filled function', async (t) => {
  await t.step('should return false for null', () => {
    assertEquals(filled(null), false);
  });

  await t.step('should return false for undefined', () => {
    assertEquals(filled(undefined), false);
  });

  await t.step('should return false for empty string', () => {
    assertEquals(filled(''), false);
  });

  await t.step('should return false for string with only whitespace', () => {
    assertEquals(filled('   '), false);
  });

  await t.step('should return false for empty array', () => {
    assertEquals(filled([]), false);
  });

  await t.step('should return false for empty object', () => {
    assertEquals(filled({}), false);
  });

  await t.step('should return true for 0', () => {
    assertEquals(filled(0), true);
  });

  await t.step('should return true for false', () => {
    assertEquals(filled(false), true);
  });

  await t.step('should return true for true', () => {
    assertEquals(filled(true), true);
  });

  await t.step('should return true for non-empty string', () => {
    assertEquals(filled('hello'), true);
  });

  await t.step('should return true for non-empty array', () => {
    assertEquals(filled([1, 2, 3]), true);
  });

  await t.step('should return true for non-empty object', () => {
    assertEquals(filled({ key: 'value' }), true);
  });

  await t.step('should return true for function', () => {
    assertEquals(filled(() => {}), true);
  });

  await t.step('should return true for number other than 0', () => {
    assertEquals(filled(42), true);
  });
});
