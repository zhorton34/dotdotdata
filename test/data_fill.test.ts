import { data_fill } from '../mod.ts';
import { assertEquals } from 'jsr:@std/assert@1';

Deno.test('data_fill function', async (t) => {
  await t.step(
    'should not set nested data on an object when attempting to fill a value at a location that already has a value',
    () => {
      const result = data_fill<{
        family: {
          members: {
            brother: { name: string };
          };
        };
      }>(
        {
          family: {
            members: {
              brother: { name: 'sam' },
            },
          },
        },
        'family.members.brother.name',
        'tim',
      );

      assertEquals(result, {
        family: {
          members: {
            brother: { name: 'sam' },
          },
        },
      });
    },
  );

  await t.step(
    'should fill nested data on an object if no value previously exists at the given location',
    () => {
      const result = data_fill<{
        family: {
          members: {
            brother: { name: string; email?: string };
          };
        };
      }>(
        {
          family: {
            members: {
              brother: { name: 'sam' },
            },
          },
        },
        'family.members.brother.email',
        'sam@gmail.com',
      );

      assertEquals(result, {
        family: {
          members: {
            brother: { name: 'sam', email: 'sam@gmail.com' },
          },
        },
      });
    },
  );

  await t.step('should fill a value in an empty object', () => {
    const result = data_fill<{ name?: string }>({}, 'name', 'John');
    assertEquals(result, { name: 'John' });
  });

  await t.step('should fill a nested value', () => {
    const result = data_fill<{ user?: { name?: string } }>({}, 'user.name', 'John');
    assertEquals(result, { user: { name: 'John' } });
  });

  await t.step('should fill an array value', () => {
    const result = data_fill<{ users?: Array<{ name?: string }> }>({}, 'users.0.name', 'John');
    assertEquals(result, { users: [{ name: 'John' }] });
  });

  await t.step('should fill using wildcard notation', () => {
    const obj: { users: Array<{ name?: string }> } = { users: [{}, {}] };
    const result = data_fill(obj, 'users.*.name', 'John');
    assertEquals(result, { users: [{ name: 'John' }, { name: 'John' }] });
  });

  await t.step('should not overwrite existing values', () => {
    const obj: { user: { name: string } } = { user: { name: 'John' } };
    const result = data_fill(obj, 'user.name', 'Jane');
    assertEquals(result, { user: { name: 'John' } });
  });

  await t.step('should fill multiple levels deep', () => {
    const result = data_fill<{ user?: { profile?: { details?: { age?: number } } } }>(
      {},
      'user.profile.details.age',
      30,
    );
    assertEquals(result, { user: { profile: { details: { age: 30 } } } });
  });

  await t.step('should work with non-string keys', () => {
    const obj: { [key: number]: { [key: number]: { [key: number]: string } } } = {
      1: { 2: { 3: 'value' } },
    };
    const result = data_fill(obj, '1.2.4', 'new value');
    assertEquals(result, { 1: { 2: { 3: 'value', 4: 'new value' } } });
  });

  await t.step('should return the original value for non-object targets', () => {
    const result = data_fill<string>('string', 'key', 'value');
    assertEquals(result, 'string');
  });

  await t.step('should fill a value in an array using a numeric string key', () => {
    const result = data_fill<{ users: Array<{ name?: string }> }>(
      { users: [] },
      'users.0.name',
      'John',
    );
    assertEquals(result, { users: [{ name: 'John' }] });
  });

  await t.step('should fill a value in a nested array', () => {
    const result = data_fill<{ users: Array<{ posts: Array<{ title?: string }> }> }>(
      { users: [{ posts: [] }] },
      'users.0.posts.0.title',
      'First Post',
    );
    assertEquals(result, { users: [{ posts: [{ title: 'First Post' }] }] });
  });

  await t.step('should fill with a null value', () => {
    const result = data_fill<{ user?: { name: string | null } }>({}, 'user.name', null);
    assertEquals(result, { user: { name: null } });
  });

  await t.step('should not fill with an undefined value', () => {
    const result = data_fill<{ user?: { name?: string } }>({}, 'user.name', undefined);
    assertEquals(result, {});
  });

  await t.step('should fill a value when the target is an array', () => {
    const result = data_fill<Array<{ name?: string }>>([{}], '0.name', 'John');
    assertEquals(result, [{ name: 'John' }]);
  });
});
