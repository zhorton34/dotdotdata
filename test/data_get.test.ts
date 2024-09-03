import { data_get } from '../mod.ts';
import { assertEquals, assertStrictEquals } from 'jsr:@std/assert@1';

Deno.test('data_get function', async (t) => {
  await t.step('should get nested data from an object', () => {
    const obj = {
      family: {
        members: {
          brother: { name: 'sam' },
        },
      },
    };
    assertEquals(data_get(obj, 'family.members.brother.name'), 'sam');
  });

  await t.step('should return undefined for non-existent nested property', () => {
    const obj = { a: { b: { c: 1 } } };
    assertEquals(data_get(obj, 'a.b.d'), undefined);
  });

  await t.step('should handle array access', () => {
    const obj = { users: [{ name: 'John' }, { name: 'Jane' }] };
    assertEquals(data_get(obj, 'users.1.name'), 'Jane');
  });

  await t.step('should return the fallback value for non-existent property', () => {
    const obj = { a: 1 };
    assertEquals(data_get(obj, 'b', 'default'), 'default');
  });

  await t.step('should handle null values', () => {
    const obj = { a: { b: null } };
    assertEquals(data_get(obj, 'a.b.c'), undefined);
  });

  await t.step('should handle undefined values', () => {
    const obj = { a: { b: undefined } };
    assertEquals(data_get(obj, 'a.b.c'), undefined);
  });

  await t.step('should work with array path', () => {
    const obj = { a: { b: { c: 1 } } };
    assertEquals(data_get(obj, ['a', 'b', 'c']), 1);
  });

  await t.step('should handle mixed object and array nesting', () => {
    const obj = { users: [{ posts: [{ title: 'Hello' }] }] };
    assertEquals(data_get(obj, 'users.0.posts.0.title'), 'Hello');
  });

  await t.step('should return undefined for out of bounds array access', () => {
    const obj = { users: [{ name: 'John' }] };
    assertEquals(data_get(obj, 'users.1.name'), undefined);
  });

  await t.step('should handle empty path', () => {
    const obj = { a: 1 };
    assertStrictEquals(data_get(obj, ''), obj);
  });

  await t.step('should handle wildcard', () => {
    const obj = {
      users: [
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' },
      ],
    };
    assertEquals(data_get(obj, 'users.*.name'), ['John', 'Jane']);
  });

  await t.step('should handle nested wildcards', () => {
    const obj = {
      users: [
        { name: 'John', posts: [{ title: 'Post 1' }, { title: 'Post 2' }] },
        { name: 'Jane', posts: [{ title: 'Post 3' }] },
      ],
    };
    assertEquals(data_get(obj, 'users.*.posts.*.title'), [['Post 1', 'Post 2'], ['Post 3']]);
  });

  await t.step('should handle object properties as array keys', () => {
    const obj = {
      users: {
        '123': { name: 'John' },
        '456': { name: 'Jane' },
      },
    };
    assertEquals(data_get(obj, 'users.123.name'), 'John');
  });

  await t.step('should handle numeric keys in path', () => {
    const obj = [{ name: 'John' }, { name: 'Jane' }];
    assertEquals(data_get(obj, '1.name'), 'Jane');
  });

  await t.step('should return fallback for non-existent wildcard path', () => {
    const obj = { users: [] };
    assertEquals(data_get(obj, 'users.*.name', 'Not Found'), 'Not Found');
  });
});
