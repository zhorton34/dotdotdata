import { throw_unless } from '../mod.ts';
import { assertThrows } from 'jsr:@std/assert@1';

Deno.test('throw_unless function', async (t) => {
  await t.step('should throw an error when condition is false', () => {
    assertThrows(
      () => {
        throw_unless(false, Error, 'Error message');
      },
      Error,
      'Error message',
    );
  });

  await t.step('should not throw an error when condition is true', () => {
    throw_unless(true, Error, 'Error message');
  });

  await t.step('should throw a custom error', () => {
    class CustomError extends Error {}
    assertThrows(
      () => {
        throw_unless(false, CustomError, 'Custom error message');
      },
      CustomError,
      'Custom error message',
    );
  });
});
