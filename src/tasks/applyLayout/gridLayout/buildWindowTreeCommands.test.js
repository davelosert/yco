const { describe } = require('riteway');
const { buildWindowTreeCommands } = require('./buildWindowTreeCommands');

describe('createWindowCommands()', async assert => {
  const treeWithNoWindows = {
    type: 'treeNode',
    split: 'vertical',
    windows: []
  };

  assert({
    given: 'tree with no windows',
    should: 'return empty array',
    actual: buildWindowTreeCommands(treeWithNoWindows),
    expected: []
  });


  const simpleVerticalWindowTree = {
    type: 'treeNode',
    split: 'vertical',
    windows: [
      { type: 'window', id: 1 },
      { type: 'window', id: 2 }
    ]
  };

  assert({
    given: 'two vertically split windows',
    should: 'insert second window east of first',
    actual: buildWindowTreeCommands(simpleVerticalWindowTree),
    expected: [
      'yabai -m window 1 --insert east',
      'yabai -m window 2 --warp 1'
    ]
  });

  const simpleHorizontalWindowTree = {
    ...simpleVerticalWindowTree,
    split: 'horizontal'
  };

  assert({
    given: 'two horizontally split windows',
    should: 'insert second window south of first',
    actual: buildWindowTreeCommands(simpleHorizontalWindowTree),
    expected: [
      'yabai -m window 1 --insert south',
      'yabai -m window 2 --warp 1'
    ]
  });

  const threeColumnTree = {
    type: 'treeNode',
    split: 'vertical',
    windows: [
      { type: 'window', id: 1 },
      { type: 'window', id: 2 },
      { type: 'window', id: 3 }
    ]
  };

  assert({
    given: 'three vertically split windows',
    should: 'insert second window east of first and third east of second',
    actual: buildWindowTreeCommands(threeColumnTree),
    expected: [
      'yabai -m window 1 --insert east',
      'yabai -m window 2 --warp 1',
      'yabai -m window 2 --insert east',
      'yabai -m window 3 --warp 2'
    ]
  });


  const treeWithSubTreeOnFirstNode = {
    type: 'treeNode',
    split: 'vertical',
    windows: [
      {
        type: 'treeNode',
        split: 'horizontal',
        windows: [{ type: 'window', id: 1 }, { type: 'window', id: 2 }]
      },
      {
        type: 'window',
        id: 3
      }
    ]
  };

  assert({
    given: 'two vertical planes with an additional horzontal split on the left plane',
    should: 'split the vertical plane first and then the horizontal one in the left plane.',
    actual: buildWindowTreeCommands(treeWithSubTreeOnFirstNode),
    expected: [
      'yabai -m window 1 --insert east',
      'yabai -m window 3 --warp 1',
      'yabai -m window 1 --insert south',
      'yabai -m window 2 --warp 1'
    ]
  });


  const treeWithSubTreeOnSecondNode = {
    type: 'treeNode',
    split: 'vertical',
    windows: [
      {
        type: 'window',
        id: 1
      },
      {
        type: 'treeNode',
        split: 'horizontal',
        windows: [{ type: 'window', id: 2 }, { type: 'window', id: 3 }]
      },
    ]
  };

  assert({
    given: 'vertical windows with an additional horizontal split on the right plane',
    should: 'split vertical plane first, then insert the horizontal split in the right plane',
    actual: buildWindowTreeCommands(treeWithSubTreeOnSecondNode),
    expected: [
      'yabai -m window 1 --insert east',
      'yabai -m window 2 --warp 1',
      'yabai -m window 2 --insert south',
      'yabai -m window 3 --warp 2'
    ]
  });

  const treeWithDeepNestedSubTrees = {
    type: 'treeNode',
    split: 'vertical',
    id: 1,
    windows: [
      {
        type: 'treeNode',
        split: 'horizontal',
        id: 2,
        windows: [
          {
            type: 'treeNode',
            split: 'vertical',
            id: 3,
            windows: [{ type: 'window', id: 11 }, { type: 'window', id: 12 }]
          },
          { type: 'window', id: 13 }
        ]
      },
      {
        type: 'treeNode',
        split: 'horizontal',
        id: 4,
        windows: [
          { type: 'window', id: 21 },
          { type: 'treeNode', split: 'vertical', id: 5, windows: [{ type: 'window', id: 22 }, { type: 'window', id: 23 }] }
        ]
      },
      { type: 'window', id: 31 }
    ]
  };

  assert({
    given: 'a fractured setup with several subplains',
    should: 'alwas split the siblings first, then the children recursively.',
    actual: buildWindowTreeCommands(treeWithDeepNestedSubTrees),
    expected: [
      // Siblings
      'yabai -m window 11 --insert east',
      'yabai -m window 21 --warp 11',
      'yabai -m window 21 --insert east',
      'yabai -m window 31 --warp 21',

      // Children of left plane
      'yabai -m window 11 --insert south',
      'yabai -m window 13 --warp 11',
      'yabai -m window 11 --insert east',
      'yabai -m window 12 --warp 11',

      // Children oft middle plane
      'yabai -m window 21 --insert south',
      'yabai -m window 22 --warp 21',
      'yabai -m window 22 --insert east',
      'yabai -m window 23 --warp 22',

    ]
  });
});
