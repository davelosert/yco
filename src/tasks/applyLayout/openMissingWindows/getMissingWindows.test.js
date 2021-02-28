const { describe } = require('riteway');
const { getMissingWindows } = require('./getMissingWindows');

describe('getUnopenWindows(yabaiWindows: YabaiWindow[], requiredWindows: string[]): RequiredWindows[]', async assert => {
  const unRequiredWindow = { id: 1, app: 'Test', display: 1, space: 1 };
  const requiredWindow = { id: 1, app: 'Required App', display: 1, space: 1 };

  assert({
    given: 'no configured windows',
    should: 'return an empty array',
    actual: getMissingWindows(
      [],
      []
    ),
    expected: []
  });

  assert({
    given: 'all required windows already exist',
    should: 'return empty array',
    actual: getMissingWindows(
      [unRequiredWindow, requiredWindow],
      ['Required App']
    ),
    expected: []
  });


  assert({
    given: '1 window of an app required which does not exist in yabaiWindows',
    should: 'return the app with a required count of 1',
    actual: getMissingWindows(
      [unRequiredWindow],
      ['Required App']
    ),
    expected: [{
      app: 'Required App',
      times: 1
    }]
  });

  assert({
    given: '2 windows required for app but only 1 is opened',
    should: 'return the app with a required count of 1',
    actual: getMissingWindows(
      [requiredWindow],
      ['Required App', 'Required App']
    ),
    expected: [{
      app: 'Required App',
      times: 1
    }]
  });

  assert({
    given: '1 required apps is missing three windows',
    should: 'return apps with a required count of 3',
    actual: getMissingWindows(
      [],
      ['Required App 1', 'Required App 1', 'Required App 1']
    ),
    expected: [
      { app: 'Required App 1', times: 3 }
    ]
  });

  assert({
    given: '2 required apps are missing once',
    should: 'return both apps with a required count of 1',
    actual: getMissingWindows(
      [],
      ['Required App 1', 'Required App 2']
    ),
    expected: [
      { app: 'Required App 1', times: 1 },
      { app: 'Required App 2', times: 1 }
    ]
  });

  assert({
    given: 'more windows of an app are opened than requird',
    should: 'not return that window as missing',
    actual: getMissingWindows(
      [requiredWindow, requiredWindow],
      ['Required App']
    ),
    expected: []
  });
});
