const { describe } = require('riteway');
const { hydrateWindows } = require('./hydrateWindows');
const { NODE_TYPES } = require('./WindowTree');

describe.only('hydrateWindows()', async assert => {

  assert({
    given: 'one window to match',
    should: 'put that window into the nodetree',
    actual: hydrateWindows(
      [{ display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test' } }],
      [{ app: 'test', id: 1 }]
    ),
    expected:
      [{ display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test', id: 1 } }]
  });

  assert({
    given: 'two windows of same app on two spaces',
    should: 'put both windows into tree only once',
    actual: hydrateWindows(
      [
        { display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test' } },
        { display: 1, space: 2, windowTree: { type: NODE_TYPES.WINDOW, app: 'test' } }
      ],
      [
        { app: 'test', id: 1 },
        { app: 'test', id: 2 }
      ]
    ),
    expected:
      [
        { display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test', id: 1 } },
        { display: 1, space: 2, windowTree: { type: NODE_TYPES.WINDOW, app: 'test', id: 2 } }
      ]
  });

  assert({
    given: 'two windows of same app on the same space',
    should: 'put both windows into tree only once',
    actual: hydrateWindows(
      [{
        display: 1,
        space: 1,
        windowTree: {
          windows: [
            { type: NODE_TYPES.WINDOW, app: 'test' },
            { type: NODE_TYPES.WINDOW, app: 'test' }
          ]
        }
      }],
      [
        { app: 'test', id: 1 },
        { app: 'test', id: 2 }
      ]
    ),
    expected:
      [{
        display: 1,
        space: 1,
        windowTree: {
          windows: [
            { type: NODE_TYPES.WINDOW, app: 'test', id: 1 },
            { type: NODE_TYPES.WINDOW, app: 'test', id: 2 }
          ]
        }
      }],
  });
});
