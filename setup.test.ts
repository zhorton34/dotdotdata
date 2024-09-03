import * as helpers from './mod.ts';
import { assert } from 'jsr:@std/assert@1';
import { dirname, fromFileUrl, join } from 'jsr:@std/path@0.214';

// Get the current file's directory
const currentDir = dirname(fromFileUrl(import.meta.url) + '/helpers/');

// Navigate to the package root (assuming test folder is directly under the package root)
const packageRoot = dirname(currentDir);

const tests = [...Object.keys(helpers)].map((name) => `./${name}.test.ts`);

for (const test of tests) {
  Deno.test('All Helper functions should have test cases', async () => {
    const testPath = join(packageRoot, 'test', test);
    console.log(testPath);
    const fileInfo = await Deno.stat(testPath);

    assert(fileInfo.isFile, `${test} should be a file`);
  });
}
