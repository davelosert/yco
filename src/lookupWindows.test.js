import { describe } from 'riteway';
import { lookupWindows } from './lookupWindows';

describe('lookupWindows()', async assert => {
  const testApp = { id: 1, title: "TestApp", display: 1, space: 1 };

  assert({
    given: 'window title exists',
    should: 'insert window object into plan',
    actual: lookupWindows({ plannedWindowSetup: [["TestApp"]], actualWindows: [{ ...testApp }] }),
    expected: [[{ ...testApp }]],
  });

  assert({
    given: 'window does not exist',
    should: 'return empty array',
    actual: lookupWindows({plannedWindowSetup: [["NonExisting"]], actualWindows: [{... testApp }]}),
    expected: [[]]
  });

  assert({
    given: 'planned window exists twice',
    should: 'insert both windows at right position',
    actual: lookupWindows({plannedWindowSetup: [["TestApp"]], actualWindows: [{...testApp }, {...testApp}]}),
    expected: [[{...testApp}, {...testApp}]]
  });

  assert({
    given: 'windows on second display',
    should: 'insert them in the second array',
    actual: lookupWindows({plannedWindowSetup: [["App1"], ["TestApp"]], actualWindows: [{ ...testApp}]}),
    expected: [[], [{...testApp}]]
  });
});
