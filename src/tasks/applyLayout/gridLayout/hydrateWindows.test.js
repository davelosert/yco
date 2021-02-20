const { describe } = require('riteway');
const { hydrateWindows } = require('./hydrateWindows');
const { NODE_TYPES } = require('./WindowTree');

describe('hydrateWindows()', async assert => {

  assert({
    given: 'one window to match',
    should: 'put that window into the nodetree',
    actual: hydrateWindows(
      [{ app: 'test', id: 1 }],
      [{ display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test' } }]
    ),
    expected: {
      layoutPlan: [{ display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test', id: 1 } }],
      remainingWindows: []
    }
  });

  assert({
    given: 'two windows of same app on two spaces',
    should: 'put both windows into tree only once',
    actual: hydrateWindows(
      [
        { app: 'test', id: 1 },
        { app: 'test', id: 2 }
      ],
      [
        { display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test' } },
        { display: 1, space: 2, windowTree: { type: NODE_TYPES.WINDOW, app: 'test' } }
      ]
    ),
    expected: {
      layoutPlan: [
        { display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'test', id: 1 } },
        { display: 1, space: 2, windowTree: { type: NODE_TYPES.WINDOW, app: 'test', id: 2 } }
      ],
      remainingWindows: []
    }
  });

  assert({
    given: 'two windows of same app on the same space',
    should: 'put both windows into tree only once',
    actual: hydrateWindows(
      [
        { app: 'test', id: 1 },
        { app: 'test', id: 2 }
      ],
      [{
        display: 1,
        space: 1,
        windowTree: {
          windows: [
            { type: NODE_TYPES.WINDOW, app: 'test' },
            { type: NODE_TYPES.WINDOW, app: 'test' }
          ]
        }
      }]
    ),
    expected: {
      layoutPlan: [{
        display: 1,
        space: 1,
        windowTree: {
          windows: [
            { type: NODE_TYPES.WINDOW, app: 'test', id: 1 },
            { type: NODE_TYPES.WINDOW, app: 'test', id: 2 }
          ]
        }
      }],
      remainingWindows: []
    },
  });

  assert({
    given: 'a layoutPlan where not all given yabaiWindows exist',
    should: 'return the delta as remainingWindows',
    actual: hydrateWindows(
      [{ app: 'Planned', id: 1 }, { app: 'Unplanned 1', id: 2 }, { app: 'Unplanned 3', id: 3 }],
      [{ display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'Planned' } }]
    ),
    expected: {
      layoutPlan: [{ display: 1, space: 1, windowTree: { type: NODE_TYPES.WINDOW, app: 'Planned', id: 1 } }],
      remainingWindows: [{ app: 'Unplanned 1', id: 2 }, { app: 'Unplanned 3', id: 3 }]
    }
  });
});
