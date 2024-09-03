import { throw_if } from '../mod.ts';
import { assertThrows } from 'jsr:@std/assert@1';

Deno.test('throw_if function', async (t) => {
  await t.step('should throw an error when condition is true', () => {
    assertThrows(
      () => {
        throw_if(true, Error, 'Error message');
      },
      Error,
      'Error message',
    );
  });

  await t.step('should not throw an error when condition is false', () => {
    throw_if(false, Error, 'Error message');
  });

  await t.step('should throw a custom error', () => {
    class CustomError extends Error {}
    assertThrows(
      () => {
        throw_if(true, CustomError, 'Custom error message');
      },
      CustomError,
      'Custom error message',
    );
  });
});
