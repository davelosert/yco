const { flatten } = require('ramda');

const buildWindowTreeCommands = (rootNode) => {
  const [firstNode, ...siblings] = rootNode.windows;
  const firstWindow = getMostLeftWindow(firstNode);
  const childNodes = [];
  if (firstNode.type === 'treeNode') {
    childNodes.push(firstNode);
  }

  const direction = rootNode.split === 'vertical' ? 'east' : 'south';
  const siblingContext = siblings.reduce((context, currentNode) => {
    const currentWindow = getMostLeftWindow(currentNode);

    if (currentNode.type === 'treeNode') {
      childNodes.push(currentNode);
    }

    return {
      commands: [
        ...context.commands,
        `yabai -m window ${context.previousNode.id} --insert ${direction}`,
        `yabai -m window ${currentWindow.id} --warp ${context.previousNode.id}`
      ],
      previousNode: currentWindow
    };

  }, { commands: [], previousNode: firstWindow });
  let commands = siblingContext.commands;


  if (childNodes.length > 0) {
    const subCommands = flatten(childNodes.map(subTree => buildWindowTreeCommands(subTree)));
    commands = [
      ...commands,
      ...subCommands
    ];
  }

  return commands;
};


function getMostLeftWindow(node) {
  if (node.type === 'window') {
    return node;
  }

  return getMostLeftWindow(node.windows[0]);
}

exports.buildWindowTreeCommands = buildWindowTreeCommands;
