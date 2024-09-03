import { data_set } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('data_set function', async (t) => {
  await t.step('sets a simple value on an object', () => {
    const obj = {};
    data_set(obj, 'name', 'John');
    assertEquals(obj, { name: 'John' });
  });

  await t.step('sets a nested value using dot notation', () => {
    const obj = { user: {} };
    data_set(obj, 'user.name', 'John');
    assertEquals(obj, { user: { name: 'John' } });
  });

  await t.step('sets a value in an array using numeric index', () => {
    const arr: string[] = [];
    data_set(arr, '0', 'First');
    assertEquals(arr, ['First']);
  });

  await t.step('sets a value using an array of keys', () => {
    const obj = {};
    data_set(obj, ['user', 'name'], 'John');
    assertEquals(obj, { user: { name: 'John' } });
  });

  await t.step('handles wildcard paths', () => {
    const obj = { users: [{ name: 'John' }, { name: 'Jane' }] };
    data_set(obj, 'users.*.age', 30);
    assertEquals(obj, {
      users: [{ name: 'John', age: 30 }, { name: 'Jane', age: 30 }] as Array<
        { name: string; age?: number }
      >,
    });
  });

  await t.step('does not overwrite existing values when overwrite is false', () => {
    const obj = { user: { name: 'John' } };
    data_set(obj, 'user.name', 'Jane', false);
    assertEquals(obj, { user: { name: 'John' } });
  });

  await t.step("creates nested objects when they don't exist", () => {
    const obj = {};
    data_set(obj, 'user.profile.age', 30);
    assertEquals(obj, { user: { profile: { age: 30 } } });
  });

  await t.step('handles empty keys (root overwrite)', () => {
    const obj = { existing: 'value' };
    const result = data_set(obj, '', 'new value');
    assertEquals(result, 'new value');
    assertEquals(obj, { existing: 'value' }); // The original object should remain unchanged
  });

  await t.step('handles empty objects', () => {
    const obj = data_set({}, 'key', 'value');
    assertEquals(obj, { key: 'value' });
  });

  await t.step('handles undefined values correctly', () => {
    const obj: { user: undefined | { name: string } } = { user: undefined };
    data_set(obj, 'user.name', 'John');
    assertEquals(obj, { user: { name: 'John' } });
  });

  await t.step('handles complex nested arrays', () => {
    const obj = { users: [{ name: 'John' }, { name: 'Jane' }] };
    data_set(obj, 'users.1.profile.age', 30);
    assertEquals(obj, { users: [{ name: 'John' }, { name: 'Jane', profile: { age: 30 } }] });
  });

  await t.step('handles multiple wildcards', () => {
    const obj: { users: Array<{ posts: Array<{ title: string; comments?: unknown[] }> }> } = {
      users: [{ posts: [{ title: 'Post 1' }, { title: 'Post 2' }] }],
    };
    data_set(obj, 'users.*.posts.*.comments', []);
    assertEquals(obj, {
      users: [{
        posts: [
          { title: 'Post 1', comments: [] },
          { title: 'Post 2', comments: [] },
        ],
      }],
    });
  });

  await t.step('preserves array length when using wildcards', () => {
    const obj: { users: Array<{ name: string; active?: boolean }> } = {
      users: [{ name: 'John' }, { name: 'Jane' }],
    };
    data_set(obj, 'users.*.active', true);
    assertEquals(obj.users.length, 2);
    assertEquals(obj, { users: [{ name: 'John', active: true }, { name: 'Jane', active: true }] });
  });

  await t.step('handles non-object/non-array root values', () => {
    let value = 'test';
    data_set(value, 'key', 'newValue');
    assertEquals(value, 'test'); // Should not modify non-object/non-array values
  });

  await t.step('creates arrays for numeric keys', () => {
    const obj = {};
    data_set(obj, 'users.0.name', 'John');
    assertEquals(obj, { users: [{ name: 'John' }] });
  });

  await t.step('overwrites entire value when targeting root', () => {
    let obj: { existing: string } | { new: string } = { existing: 'value' };
    obj = data_set(obj, '', { new: 'structure' }) as { new: string };
    assertEquals(obj, { new: 'structure' });
  });
});
