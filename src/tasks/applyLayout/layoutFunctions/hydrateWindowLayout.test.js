const { describe } = require('riteway');
const { getUnmanagedWindows, hydrateWindowLayout } = require('./hydrateWindowLayout');

describe('hydrateWindowLayout()', async assert => {
  const testApp = { id: 1, app: 'TestApp', display: 1, space: 1 };

  assert({
    given: 'window title exists',
    should: 'insert window object into plan',
    actual: hydrateWindowLayout({ plannedWindowSetup: [[['TestApp']]], actualWindows: [{ ...testApp }] }),
    expected: [[[{ ...testApp }]]],
  });

  assert({
    given: 'window does not exist',
    should: 'return empty array',
    actual: hydrateWindowLayout({ plannedWindowSetup: [[['NonExisting']]], actualWindows: [{ ...testApp }] }),
    expected: [[[]]]
  });

  assert({
    given: 'planned window exists twice',
    should: 'insert both windows at right position',
    actual: hydrateWindowLayout({ plannedWindowSetup: [[['TestApp']]], actualWindows: [{ ...testApp }, { ...testApp }] }),
    expected: [[[{ ...testApp }, { ...testApp }]]]
  });

  assert({
    given: 'windows on second display',
    should: 'insert them in the second array',
    actual: hydrateWindowLayout({ plannedWindowSetup: [[['App1']], [['TestApp']]], actualWindows: [{ ...testApp }] }),
    expected: [[[]], [[{ ...testApp }]]]
  });
});


describe('getUnmanagedWindows()', async assert => {
  const managedApp = { id: 1, app: 'Managed', display: 1, space: 1 };
  const unmanagedApp = { id: 2, app: 'Unmanaged', display: 1, space: 1 };

  assert({
    given: 'no unmanaged window',
    should: 'return empty array',
    actual: getUnmanagedWindows({ hydratedWindowLayout: [[[{ ...managedApp }]]], actualWindows: [{ ...managedApp }] }),
    expected: []
  });

  assert({
    given: 'an unmanaged window',
    should: 'return that window',
    actual: getUnmanagedWindows({ hydratedWindowLayout: [[[managedApp]]], actualWindows: [managedApp, unmanagedApp] }),
    expected: [unmanagedApp]
  });
});
