
const assert = require('assert');
const fs = require('fs');
const { executeYco } = require('../../helpers/executeYco');
const { isolated } = require('isolated');
const path = require('path');
const { assertThat, containsString, is, equalTo } = require('hamjest');

const { mkdir, copyFile } = fs.promises;

suite('yco validate-config', () => {
  test('validates the config at default path (~/.config/yabai/yco.config.json) and outputs success.', async () => {
    const tempDir = await isolated();
    const yabaiPath = path.join(tempDir, '.config', 'yabai');
    await mkdir(yabaiPath, { recursive: true });
    await copyFile(
      path.resolve(__dirname, '..', '..', 'fixtures', 'validateConfig', 'valid.yco.config.json'),
      path.resolve(yabaiPath, 'yco.config.json')
    );

    const { output } = await executeYco({
      cmd: 'validate-config',
      options: {
        env: {
          HOME: tempDir
        }
      }
    });

    assertThat(output, containsString(`Config at ${yabaiPath}/yco.config.json is valid!`));
  });

  test('repots invalid configs and exits with error code 1', async () => {
    const tempDir = await isolated();
    const yabaiPath = path.join(tempDir, '.config', 'yabai');
    await mkdir(yabaiPath, { recursive: true });
    await copyFile(
      path.resolve(__dirname, '..', '..', 'fixtures', 'validateConfig', 'invalid.yco.config.json'),
      path.resolve(yabaiPath, 'yco.config.json')
    );

    const { output, exitCode } = await executeYco({
      cmd: 'validate-config',
      options: {
        env: {
          HOME: tempDir
        }
      }
    });

    assertThat(output, containsString(`Config at ${yabaiPath}/yco.config.json is invalid!`));
    assertThat(output, containsString('ADDTIONAL PROPERTY should NOT have additional properties'));
    assertThat(output, containsString('ENUM should be equal to one of the allowed values'));
    assertThat(exitCode, is(equalTo(1)));
  });
});
