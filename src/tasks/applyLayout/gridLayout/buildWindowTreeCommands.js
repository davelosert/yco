const { generateInsertCommand, generateWarpCommand } = require('../../../shared/yabaiCommands');

const buildWindowTreeCommands = (parentNode) => {
  let { commands, childNodes } = handleSiblings(parentNode);

  if (childNodes.length > 0) {
    const childCommands = childNodes.flatMap(subTree => buildWindowTreeCommands(subTree));
    commands = [
      ...commands,
      ...childCommands
    ];
  }

  return commands;
};

function handleSiblings(parentNode) {
  const childNodes = [];
  const insertDirection = parentNode.split === 'vertical' ? 'east' : 'south';

  const { commands } = parentNode.windows.reduce((context, currentNode) => {
    if (currentNode.type === 'treeNode') {
      childNodes.push(currentNode);
    }

    const sourceWindow = getMostLeftWindow(currentNode);
    if (isFirstIteration(context)) {
      return {
        commands: [],
        previousWindow: sourceWindow
      };
    }


    return {
      commands: [
        ...context.commands,
        generateInsertCommand(context.previousWindow.id, insertDirection),
        generateWarpCommand(sourceWindow.id, context.previousWindow.id)
      ],
      previousWindow: sourceWindow
    };

  }, { commands: [], previousWindow: null });
  return {
    commands,
    childNodes
  };
}

function isFirstIteration(context) {
  return !context.previousWindow;
}

function getMostLeftWindow(node) {
  if (node.type === 'window') {
    return node;
  }

  return getMostLeftWindow(node.windows[0]);
}

exports.buildWindowTreeCommands = buildWindowTreeCommands;
