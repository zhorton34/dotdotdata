import { data_forget } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('data_forget function', async (t) => {
  await t.step('should remove a simple key from an object', () => {
    const obj: { name: string; age?: number } = { name: 'John', age: 30 };
    data_forget(obj, 'age');
    assertEquals(obj, { name: 'John' });
  });

  await t.step('should remove a nested key from an object', () => {
    const obj: { user: { name: string; profile: { age?: number } } } = {
      user: { name: 'John', profile: { age: 30 } },
    };
    data_forget(obj, 'user.profile.age');
    assertEquals(obj, { user: { name: 'John', profile: {} } });
  });

  await t.step('should handle empty string key', () => {
    const obj: { '': string; a: number } = { '': 'empty', a: 1 };
    data_forget(obj, '');
    assertEquals(obj, { a: 1 } as { a: number });
  });

  await t.step('should handle wildcard notation', () => {
    const obj: { users: Array<{ id: number; name?: string }> } = {
      users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
    };
    data_forget(obj, 'users.*.name');
    assertEquals(obj, { users: [{ id: 1 }, { id: 2 }] });
  });

  await t.step('should remove an item from an array', () => {
    const arr = [1, 2, 3, 4, 5];
    data_forget(arr, '2');
    assertEquals(arr, [1, 2, 4, 5]);
  });

  await t.step('should handle non-existent keys', () => {
    const obj = { a: 1, b: 2 };
    data_forget(obj, 'c');
    assertEquals(obj, { a: 1, b: 2 });
  });

  await t.step('should handle non-existent nested keys', () => {
    const obj = { a: { b: 2 } };
    data_forget(obj, 'a.c.d');
    assertEquals(obj, { a: { b: 2 } });
  });

  await t.step('should handle non-object targets', () => {
    const str = 'hello';
    const result = data_forget(str, 'length');
    assertEquals(result, 'hello');
  });

  await t.step('should handle null target', () => {
    const result = data_forget(null, 'any.key');
    assertEquals(result, null);
  });

  await t.step('should remove nested array item', () => {
    const obj = { users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] };
    data_forget(obj, 'users.1');
    assertEquals(obj, { users: [{ id: 1, name: 'John' }] });
  });
});
