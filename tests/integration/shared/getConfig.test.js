const assert = require('assert');
const { clone } = require('ramda');
const { getConfig } = require('../../../src/shared/getConfig');
const homeConfig = require('../../fixtures/getConfig/.config/yabai/yco.config.json');
const configFromPath = require('../../fixtures/getConfig/exampleConfig.json');
const path = require('path');


suite('getConfig()', () => {
  let originalEnv;

  setup(() => {
    originalEnv = clone(process.env);
  });

  teardown(() => {
    process.env = originalEnv;
  });

  test('loads config from given path', async () => {
    const { content } = await getConfig({
      configPath: `${__dirname}/../../fixtures/getConfig/exampleConfig.json`
    });

    assert.deepStrictEqual(content, configFromPath);
  });

  test('defaults to read from "$HOME/.config/yabai/yco.config.json" if no config is given', async () => {
    process.env.HOME = path.join(__dirname, '..', '..', 'fixtures', 'getConfig');
    const { content } = await getConfig({});

    assert.deepStrictEqual(content, homeConfig);
  });


});
