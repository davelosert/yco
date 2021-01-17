
const fs = require('fs');
const path = require('path');
const { setupTestEnvironment } = require('../../helpers/setupTestEnvironment');
const { withoutIndentSpaces } = require('../../helpers/withoutIndentSpaces');
const { assertThat, is, truthy, containsString, equalTo, promiseThat, rejected, hasProperty } = require('hamjest');

const { readFile, stat } = fs.promises;

suite('yco create-configs', () => {
  const createTestDir = async () => {
    const { tempDir, executeYco } = await setupTestEnvironment({
      insertFiles: [
        path.join(__dirname, '..', '..', 'fixtures', 'createConfigs', '.skhdrc')
      ],
      configSourcePath: path.join(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    const ycoSkhdConfPath = path.resolve(tempDir, '.config', 'yabai', 'yco.skhd.conf');

    return { testDir: tempDir, ycoSkhdConfPath, executeYco };
  };


  test('creates ~/.config/yabai/yco.skhd.conf', async () => {
    const { executeYco, ycoSkhdConfPath } = await createTestDir();

    await executeYco('create-configs');

    const fileState = await stat(ycoSkhdConfPath);
    assertThat(fileState.isFile(), is(truthy()));
  });

  test('writes info about file generation as comment to ~/.confg/yabai/yco.skhd.conf', async () => {
    const { executeYco, ycoSkhdConfPath } = await createTestDir();

    await executeYco('create-configs');

    const ycoSkhdConfContent = await readFile(ycoSkhdConfPath, 'utf-8');

    assertThat(
      ycoSkhdConfContent,
      containsString('# This file was automatically generated by "yco create-configs". Changes will be overwritten.')
    );
  });

  test('inserts ".load ~/.config/yabai/yco.skhd.conf" statement in ~/.skhdrc', async () => {
    const { testDir, executeYco, ycoSkhdConfPath } = await createTestDir();

    await executeYco('create-configs');

    const skhdRcContent = await readFile(path.resolve(testDir, '.skhdrc'), 'utf-8');

    assertThat(
      skhdRcContent,
      containsString(`.load "${ycoSkhdConfPath}"`)
    );
  });

  test('creates load statement only once on subsequent runs', async () => {
    const { testDir, executeYco, ycoSkhdConfPath } = await createTestDir();

    await executeYco('create-configs');
    await executeYco('create-configs');

    const skhdRcContent = await readFile(path.resolve(testDir, '.skhdrc'), 'utf-8');

    const expectedStatement = `.load "${ycoSkhdConfPath}"`;
    const occurences = [...skhdRcContent.matchAll(expectedStatement)].length;

    assertThat(
      occurences,
      is(equalTo(1))
    );
  });

  suite('with config: "layouts"', () => {
    test('creates a layout mod in skhd.conf with hotkeys for all defined layouts.', async () => {
      const { executeYco, ycoSkhdConfPath } = await createTestDir();

      await executeYco('create-configs');

      const ycoSkhdConfContent = await readFile(ycoSkhdConfPath, 'utf-8');

      assertThat(
        ycoSkhdConfContent,
        containsString(withoutIndentSpaces(`
          :: layoutMode @
          alt - s ; layoutMode
          layoutMode < m : yco apply-layout --name monitor | skhd -k "escape"
          layoutMode < l : yco apply-layout --name laptop | skhd -k "escape"
          layoutMode < p : yco apply-layout --name pairing | skhd -k "escape"
          layoutMode < escape ; default
        `))
      );
    });
  });

  suite('with config: switchFocus', () => {
    test('creates switchFocus entries in yco.skhd.conf for all defined apps.', async () => {
      const { executeYco, ycoSkhdConfPath } = await createTestDir();

      await executeYco('create-configs');

      const ycoSkhdConfContent = await readFile(ycoSkhdConfPath, 'utf-8');

      assertThat(
        ycoSkhdConfContent,
        containsString(withoutIndentSpaces(`
          cmd - 1 : yco-switch-focus "Code"
          cmd - 2 : yco-switch-focus "Firefox"
          cmd - 3 : yco-switch-focus "iTerm2"
      `))
      );
    });
  });


  suite('with "--debug"', () => {
    test.only('only prints what files would be written without actually writing them.', async () => {
      const { executeYco, ycoSkhdConfPath, testDir } = await createTestDir();

      const { output } = await executeYco('create-configs --debug');

      await promiseThat(stat(ycoSkhdConfPath), is(rejected(hasProperty('code', 'ENOENT'))));

      assertThat(
        withoutIndentSpaces(output),
        is(equalTo(withoutIndentSpaces(`
          ────────────────────────────────────────────────────────────────────────────────
          ▻ The following actions would be taken:
          ────────────────────────────────────────────────────────────────────────────────
          ∙ Create directory "${testDir}/.config/yabai"
          ────────────────────────────────────────────────────────────────────────────────
          ∙ Create file "${ycoSkhdConfPath}" with content:
          # This file was automatically generated by "yco create-configs". Changes will be overwritten.
          # LAYOUT MODS
          :: layoutMode @
          alt - s ; layoutMode
          layoutMode < m : yco apply-layout --name monitor | skhd -k "escape"
          layoutMode < l : yco apply-layout --name laptop | skhd -k "escape"
          layoutMode < p : yco apply-layout --name pairing | skhd -k "escape"
          layoutMode < escape ; default
          # SWITCH FOCUS CONFIGS
          cmd - 1 : yco-switch-focus "Code"
          cmd - 2 : yco-switch-focus "Firefox"
          cmd - 3 : yco-switch-focus "iTerm2"
          ────────────────────────────────────────────────────────────────────────────────
          ∙ Append to file "${testDir}/.skhdrc":
          .load "${ycoSkhdConfPath}"
          ────────────────────────────────────────────────────────────────────────────────
        `))
        )
      );

    });
  });
});
