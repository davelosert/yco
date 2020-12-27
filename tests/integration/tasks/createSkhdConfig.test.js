
import assert from 'assert';
import { clone } from 'ramda';
import { createSkhdConfig } from '../../../src/tasks/createSkhdConfig';
import fs from 'fs';
import { isolated } from 'isolated';
import path from 'path';

const { readFile, stat } = fs.promises;

const withoutIndentSpaces = multilineString => multilineString.replace(/^\s*/g, '').replace(/(\n\s*)/g, '\n');

suite('task: createSkhdConfig()', () => {
  let originalEnv;
  let testDir;
  let ycoSkhdConfPath;

  setup(async () => {
    originalEnv = clone(process.env);
    testDir = await isolated({
      files: path.join(__dirname, '..', '..', 'fixtures', 'createSkhdConfig', 'firstRun', '.skhdrc')
    });

    ycoSkhdConfPath = path.resolve(testDir, '.config', 'yabai', 'yco.skhd.conf');
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

    const expectedStatement = `.load ${ycoSkhdConfPath}`;
    assert.ok(fileContent.includes(expectedStatement), withoutIndentSpaces(`
      SKHD Config did not contain .load statement

      File-Content:
      ${fileContent}

      Expected Statement:
      ${expectedStatement}
    `));
  });

  test('creates layout mod in skhd.conf', async () => {
    const ycoConfig = {
      layoutModeTriggerKey: 'alt - s',
      layouts: {
        layout1: { triggerKey: '1' },
        layout2: { triggerKey: '2' }
      }
    };

    await createSkhdConfig({
      ycoConfig
    });

    const expectedConf = withoutIndentSpaces(`
      :: layoutMode @
      alt - s ; layoutMode
      layoutMode < 1 : nyc apply-layout --name layout1 | skhd -k "escape"
      layoutMode < 2 : nyc apply-layout --name layout2 | skhd -k "escape"
      layoutMode < escape ; default`);

    const ycoSkhdConfContent = await readFile(ycoSkhdConfPath);

    assert.ok(ycoSkhdConfContent.includes(expectedConf), withoutIndentSpaces(`
      yco.skhd.conf did not contain layout mod config.

      yco.skhd.conf:
      ${ycoSkhdConfContent}

      expected conf:
      ${expectedConf}
    `));

  });

});
