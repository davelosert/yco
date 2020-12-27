
import assert from 'assert';
import { clone } from 'ramda';
import { createSkhdConfig } from '../../../src/tasks/createSkhdConfig';
import fs from 'fs';
import { isolated } from 'isolated';
import path from 'path';

const { readFile, stat } = fs.promises;

suite('task: applyLayout()', () => {
  let originalEnv;
  let testDir;

  setup(async () => {
    originalEnv = clone(process.env);
    testDir = await isolated({
      files: path.join(__dirname, '..', '..', 'fixtures', 'createSkhdConfig', 'firstRun', '.skhdrc')
    });

    process.env.HOME = testDir;
  });

  teardown(() => {
    process.env = originalEnv;
  });

  test('creates ~/.config/yabai.yco.skhd.conf', async () => {
    await createSkhdConfig({
      ycoConfig: {}
    });

    const expectedPath = path.resolve(testDir, '.config', 'yabai', 'yco.skhd.conf');
    const fileState = await stat(expectedPath);

    assert.ok(fileState.isFile());
  });

  test('inserts ".load ~/.config/yabai/yco.skhd.conf" statement in ~/.skhdrc', async () => {
    await createSkhdConfig({
      ycoConfig: {}
    });

    const fileContent = await readFile(path.resolve(testDir, '.skhdrc'), 'utf-8');

    const expectedPath = path.resolve(testDir, '.config', 'yabai', 'yco.skhd.conf');
    const expectedStatement = `.load ${expectedPath}`;
    assert.ok(fileContent.includes(expectedStatement), `SKHD Config did not contain .load statement
      File-Content:
      ${fileContent}

      Expected Statement:
      ${expectedStatement}
    `);
  });

});
