import assert from 'assert';
import { clone } from 'ramda';
import { getConfig } from '../../src/getConfig';
import homeConfig from '../fixtures/getConfig/.config/yabai/yco.config.json';
import path from 'path';


suite('getConfig.js', () => {
  let originalEnv;

  setup(() => {
    originalEnv = clone(process.env);
  });

  teardown(() => {
    process.env = originalEnv;
  });

  test('defaults to read from "$HOME/.config/yabai/yco.config.json"', async () => {
    process.env.HOME = path.join(__dirname, '..', 'fixtures', 'getConfig');
    const actual = await getConfig({});

    assert.deepStrictEqual(actual, homeConfig);
  });
});
