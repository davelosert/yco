const { createSkhdMode } = require('./createSkhdMode');
const { mapObjIndexed, pipe, values } = require('ramda');


const convertLayoutsToSkhdEntries = pipe(
  mapObjIndexed((layoutConfig, layoutName) => ({
    triggerKey: layoutConfig.triggerKey,
    actions: [`yco apply-layout --name ${layoutName}`]
  })),
  values
);

exports.getSkhdEntries = ({ ycoConfig }) => {
  let entries = [];

  if (ycoConfig.layouts) {
    const layoutModeEntries = createSkhdMode({
      name: 'layoutMode',
      triggerKey: ycoConfig.layoutModeTriggerKey,
      entries: convertLayoutsToSkhdEntries(ycoConfig.layouts)
    });

    entries = [
      ...entries,
      ...layoutModeEntries
    ];
  }

  return entries.join('\n');
};
