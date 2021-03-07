
const { describe } = require('riteway');
const { filterIgnoredWindows } = require('./filterIgnoredWindows');

describe.only('filterIgnoredWindows()', async assert => {

  const yabaiWindows = [{ id: 1, app: 'AppName', title: 'TitleName' }];
  assert({
    given: 'no windows to filter',
    should: 'return the full array',
    actual: filterIgnoredWindows(
      yabaiWindows,
      []
    ),
    expected: yabaiWindows
  });

  assert({
    given: 'an ignored window by app',
    should: 'return the yabai array without that window',
    actual: filterIgnoredWindows(
      [
        { id: 1, app: 'FilterMe', title: 'TitleName ' },
        { id: 2, app: 'LeaveMe', title: 'TitleName ' },
      ],
      [{ app: 'FilterMe' }]
    ),
    expected: [
      { id: 2, app: 'LeaveMe', title: 'TitleName ' }
    ]
  });

  assert({
    given: 'an ignored window by app and title',
    should: 'only filter out exact matches',
    actual: filterIgnoredWindows([
      { id: 1, app: 'AppName', title: 'NonFilteredTitle' },
      { id: 2, app: 'AppName', title: 'FilteredTitle' },
      { id: 3, app: 'AppName', title: 'Another Title' }
    ],
      [{ app: 'AppName', title: 'FilteredTitle' }]
    ),
    expected: [
      { id: 1, app: 'AppName', title: 'NonFilteredTitle' },
      { id: 3, app: 'AppName', title: 'Another Title' }
    ]
  });

});
