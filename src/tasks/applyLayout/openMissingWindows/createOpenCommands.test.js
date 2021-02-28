const { createOpenCommands } = require('./createOpenCommands');
const { describe } = require('riteway');


describe('createOpenCommands(missingWindows: MissingWindows[]): Commands[]', async assert => {
  assert({
    given: 'no missing windows',
    should: 'return an empty array',
    actual: createOpenCommands([]),
    expected: []
  });

  assert({
    given: 'one missing window',
    should: 'return an open command for the app with flags "-a" to open the app without giving the absolute path, "-n" to open a new tab and "-g" to not focus the window',
    actual: createOpenCommands([{ app: 'CustomApp', times: 1 }]),
    expected: [
      'open -n -g -a "CustomApp"'
    ]
  });

  assert({
    given: 'two missing window of the same app',
    should: 'return two open commands',
    actual: createOpenCommands([{ app: 'CustomApp', times: 2 }]),
    expected: [
      'open -n -g -a "CustomApp"',
      'open -n -g -a "CustomApp"'
    ]
  });

  assert({
    given: 'two missing window of the two apps',
    should: 'returns two open commands for both apps',
    actual: createOpenCommands([{ app: 'CustomApp', times: 1 }, { app: 'CustomApp 2', times: 1 }]),
    expected: [
      'open -n -g -a "CustomApp"',
      'open -n -g -a "CustomApp 2"'
    ]
  });
});
