const R = require('ramda');
const { generateFocusDisplayCommand, generateCreateCommands } = require('../../../shared/yabaiCommands');

const createSpaces = (layoutPLan) => {
  return R.pipe(
    R.filter(space => space.action === 'create'),
    R.countBy(space => space.display),
    R.toPairs,
    R.chain(([display, creationCount]) => {
      return [
        generateFocusDisplayCommand(display),
        ...generateCreateCommands(creationCount)
      ];
    }),
  )(layoutPLan);
};

module.exports = {
  createSpaces
};
