
const path = require('path');
const { setupTestEnvironment } = require('../../helpers/setupTestEnvironment');
const { assertThat, containsString, is, equalTo } = require('hamjest');


suite('yco validate-config', () => {
  test('validates the config at the default path (~/.config/yabai/yco.config.json) and outputs a success message.', async () => {
    const { executeYco, targetPath } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'validateConfig', 'valid.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('validate-config');

    assertThat(output, containsString(`Config at ${targetPath}/yco.config.json is valid!`));
  });

  test('reports every error of an invalid config and exits with error code 1.', async () => {
    const { executeYco, targetPath } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'validateConfig', 'invalid.yco.config.json'),
      defaultTarget: true
    });

    const { output, exitCode } = await executeYco('validate-config');

    assertThat(output, containsString(`Config at ${targetPath}/yco.config.json is invalid!`));
    assertThat(output, containsString('ADDTIONAL PROPERTY should NOT have additional properties'));
    assertThat(output, containsString('ENUM should be equal to one of the allowed values'));
    assertThat(exitCode, is(equalTo(1)));
  });

  suite('--config', () => {
    test('uses config from given path for validation.', async () => {
      const { executeYco, tempDir } = await setupTestEnvironment({
        configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'validateConfig', 'valid.yco.config.json')
      });

      const { output } = await executeYco(`validate-config --config ${tempDir}/yco.config.json`);

      assertThat(output, containsString(`Config at ${tempDir}/yco.config.json is valid!`));
    });
  });
});
