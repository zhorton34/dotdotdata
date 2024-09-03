import { retry } from '../mod.ts';
import { assertEquals, assertRejects } from 'jsr:@std/assert@1';

Deno.test('retry function', async (t) => {
  await t.step('should execute the callback successfully on first try', async () => {
    let attempts = 0;
    const result = await retry(() => {
      attempts++;
      return 'success';
    }, 3);
    assertEquals(result, 'success');
    assertEquals(attempts, 1);
  });

  await t.step('should retry until success', async () => {
    let attempts = 0;
    const result = await retry(() => {
      attempts++;
      if (attempts < 3) throw new Error('Fail');
      return 'success';
    }, 3);
    assertEquals(result, 'success');
    assertEquals(attempts, 3);
  });

  await t.step('should throw an error if max attempts are reached', async () => {
    let attempts = 0;
    await assertRejects(
      async () => {
        await retry(() => {
          attempts++;
          throw new Error('Fail');
        }, 3);
      },
      Error,
      'Fail',
    );
    assertEquals(attempts, 3);
  });

  await t.step('should wait between retries', async () => {
    let attempts = 0;
    const start = Date.now();
    await assertRejects(
      async () => {
        await retry(
          () => {
            attempts++;
            throw new Error('Fail');
          },
          3,
          100,
        );
      },
      Error,
      'Fail',
    );
    const duration = Date.now() - start;
    assertEquals(attempts, 3);
    assertEquals(duration >= 200, true);
  });
});
