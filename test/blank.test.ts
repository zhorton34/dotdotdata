import { blank } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('blank function', async (t) => {
  await t.step('should return true for undefined', () => {
    assertEquals(blank(undefined), true);
  });

  await t.step('should return true for null', () => {
    assertEquals(blank(null), true);
  });

  await t.step('should return true for empty string', () => {
    assertEquals(blank(''), true);
  });

  await t.step('should return true for string with only whitespace', () => {
    assertEquals(blank('   '), true);
  });

  await t.step('should return true for empty array', () => {
    assertEquals(blank([]), true);
  });

  await t.step('should return true for empty object', () => {
    assertEquals(blank({}), true);
  });

  await t.step('should return false for 0', () => {
    assertEquals(blank(0), false);
  });

  await t.step('should return false for false', () => {
    assertEquals(blank(false), false);
  });

  await t.step('should return false for true', () => {
    assertEquals(blank(true), false);
  });

  await t.step('should return false for non-empty string', () => {
    assertEquals(blank('hello'), false);
  });

  await t.step('should return false for non-empty array', () => {
    assertEquals(blank([1, 2, 3]), false);
  });

  await t.step('should return false for non-empty object', () => {
    assertEquals(blank({ key: 'value' }), false);
  });

  await t.step('should return false for function', () => {
    assertEquals(blank(() => {}), false);
  });

  await t.step('should return false for number other than 0', () => {
    assertEquals(blank(42), false);
  });
});
