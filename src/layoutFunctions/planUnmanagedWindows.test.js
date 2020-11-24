import { describe } from 'riteway';
import { getUnmanagedStrategy } from './planUnmanagedWindows';

const desiredLayout = [
  [['Managed App']]
];

const unmanagedWindow = { app: 'Unmanaged', space: 1, display: 1 };
const unmanagedWindow2 = { app: 'Unmanaged', space: 2, display: 1 };
const unmanagedWindow3 = { app: 'Unmanaged', space: 3, display: 1 };

describe('planUnmanagedWindows() - allInOneSpace', async assert => {
  const planAllInOneSpace = getUnmanagedStrategy('allInOneSpace');
  assert({
    given: 'no unmanaged windows',
    should: 'return the displayLayout untouched',
    actual: planAllInOneSpace({ desiredLayout, unmanagedWindows: [] }),
    expected: desiredLayout
  });

  assert({
    given: 'one unmanaged window',
    should: 'return new space on first display with unmanged window',
    actual: planAllInOneSpace({ desiredLayout, unmanagedWindows: [unmanagedWindow] }),
    expected: [[['Managed App'], [unmanagedWindow]]]
  });

  assert({
    given: 'three unmanaged windows',
    should: 'return all of them in a new space on first display',
    actual: planAllInOneSpace({ desiredLayout, unmanagedWindows: [unmanagedWindow, unmanagedWindow2, unmanagedWindow3] }),
    expected: [[['Managed App'], [unmanagedWindow, unmanagedWindow2, unmanagedWindow3]]]
  });
});

describe('planUnmanagedWindows() - allInOwnSpace', async assert => {
  const planAllInOwnSpace = getUnmanagedStrategy('allInOwnSpace');

  assert({
    given: 'no unmanaged windows',
    should: 'return the displayLayout untouched',
    actual: planAllInOwnSpace({ desiredLayout, unmanagedWindows: [] }),
    expected: desiredLayout
  });

  assert({
    given: 'one unmanaged window',
    should: 'return new space on first display with unmanagd window',
    actual: planAllInOwnSpace({ desiredLayout, unmanagedWindows: [unmanagedWindow] }),
    expected: [[['Managed App'], [unmanagedWindow]]]
  });

  assert({
    given: 'three unmanaged windows',
    should: 'return each in their own space on first display',
    actual: planAllInOwnSpace({ desiredLayout, unmanagedWindows: [unmanagedWindow, unmanagedWindow2, unmanagedWindow3] }),
    expected: [[['Managed App'], [ unmanagedWindow ], [ unmanagedWindow2 ], [ unmanagedWindow3 ]]]
  });
});

describe('planUnmanagtedWindows() - leaveUntouched', async assert => {
  const leaveUntouched = getUnmanagedStrategy('leaveUntouched');
  const unmanagedSecondScreen = {
    ...unmanagedWindow,
    display: 2
  };

  assert({
    given: 'no unmanaged windows',
    should: 'return the displayLayout untouched',
    actual: leaveUntouched({ desiredLayout, unmanagedWindows: [] }),
    expected: desiredLayout
  });

  assert({
    given: 'one unmanaged window on second space while managed only on first',
    should: 'create second space in layout',
    actual: leaveUntouched({ desiredLayout, unmanagedWindows: [unmanagedWindow2] }),
    expected: [[['Managed App'], [unmanagedWindow2]]]
  });

  assert({
    given: 'two unmanaged windows on second space while managed only on first',
    should: 'create second space with both unmanaged windows',
    actual: leaveUntouched({ desiredLayout, unmanagedWindows: [{ ...unmanagedWindow2 }, { ...unmanagedWindow2 }] }),
    expected: [[['Managed App'], [{ ...unmanagedWindow2 }, { ...unmanagedWindow2 }]]]
  });

  assert({
    given: 'one unmanaged window on third display while managed only on first',
    should: 'create empty second and unmanaged third space',
    actual: leaveUntouched({ desiredLayout, unmanagedWindows: [unmanagedWindow3] }),
    expected: [[['Managed App'], [], [unmanagedWindow3]]]
  });

  assert({
    given: 'one unmanaged window on second display while managed only on first',
    should: 'create second display in plan and add unmanaged window',
    actual: leaveUntouched({ desiredLayout, unmanagedWindows: [unmanagedSecondScreen] }),
    expected: [[['Managed App']], [[unmanagedSecondScreen]]]
  });

  assert({
    given: 'unmanaged window on same space where managed window',
    should: 'merge managed and unmanaged on space',
    actual: leaveUntouched({ desiredLayout, unmanagedWindows: [unmanagedWindow] }),
    expected: [[['Managed App', unmanagedWindow]]]
  });
});
