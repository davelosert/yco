
const assert = require('assert');
const { clone } = require('ramda');
const { createSkhdConfig } = require('../../../src/tasks/createSkhdConfig');
const fs = require('fs');
const { isolated } = require('isolated');
const path = require('path');

const { readFile, stat } = fs.promises;

const withoutIndentSpaces = multilineString => multilineString.replace(/^\s*/g, '').replace(/(\n\s*)/g, '\n');

suite('task: createSkhdConfig()', () => {
  let originalEnv;

  const createTestDirFromFixture = async (fixtureName) => {
    const testDir = await isolated({
      files: path.join(__dirname, '..', '..', 'fixtures', 'createSkhdConfig', fixtureName, '.skhdrc')
    });
    const ycoSkhdConfPath = path.resolve(testDir, '.config', 'yabai', 'yco.skhd.conf');
    process.env.HOME = testDir;

    return { testDir, ycoSkhdConfPath };
  };

  setup(async () => {
    originalEnv = clone(process.env);
  });

  teardown(() => {
    process.env = originalEnv;
  });

  test('creates ~/.config/yabai.yco.skhd.conf', async () => {
    const { testDir } = await createTestDirFromFixture('firstRun');

    await createSkhdConfig({
      ycoConfig: {}
    });

    const expectedPath = path.resolve(testDir, '.config', 'yabai', 'yco.skhd.conf');
    const fileState = await stat(expectedPath);

    assert.ok(fileState.isFile());
  });

  test('inserts ".load ~/.config/yabai/yco.skhd.conf" statement in ~/.skhdrc', async () => {
    const { testDir, ycoSkhdConfPath } = await createTestDirFromFixture('firstRun');

    await createSkhdConfig({
      ycoConfig: {}
    });

    const fileContent = await readFile(path.resolve(testDir, '.skhdrc'), 'utf-8');

    const expectedStatement = `.load "${ycoSkhdConfPath}"`;
    assert.ok(fileContent.includes(expectedStatement), withoutIndentSpaces(`
      SKHD Config did not contain .load statement

      File-Content:
      ${fileContent}

      Expected Statement:
      ${expectedStatement}
    `));
  });

  test('does not create .load statement if it was already created by a previous run', async () => {
    const { testDir, ycoSkhdConfPath } = await createTestDirFromFixture('firstRun');

    await createSkhdConfig({ ycoConfig: {} });
    await createSkhdConfig({ ycoConfig: {} });

    const fileContent = await readFile(path.resolve(testDir, '.skhdrc'), 'utf-8');
    const expectedStatement = `.load "${ycoSkhdConfPath}"`;
    const occurences = [...fileContent.matchAll(expectedStatement)].length;
    assert.deepStrictEqual(occurences, 1);
  });

  test('inserts ".load ~/.config/yabai/yco.skhd.conf" statement in ~/.skhdrc', async () => {
    const { testDir, ycoSkhdConfPath } = await createTestDirFromFixture('firstRun');

    await createSkhdConfig({
      ycoConfig: {}
    });

    const fileContent = await readFile(path.resolve(testDir, '.skhdrc'), 'utf-8');

    const expectedStatement = `.load "${ycoSkhdConfPath}"`;
    assert.ok(fileContent.includes(expectedStatement), withoutIndentSpaces(`
      SKHD Config did not contain .load statement

      File-Content:
      ${fileContent}

      Expected Statement:
      ${expectedStatement}
    `));
  });

  test('creates layout mod in skhd.conf', async () => {
    const { ycoSkhdConfPath } = await createTestDirFromFixture('firstRun');

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
      layoutMode < 1 : yco apply-layout --name layout1 | skhd -k "escape"
      layoutMode < 2 : yco apply-layout --name layout2 | skhd -k "escape"
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
