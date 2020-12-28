import { createSkhdMode } from './createSkhdMode';
import { mapObjIndexed, pipe, values } from 'ramda';


const convertLayoutsToSkhdEntries = pipe(
  mapObjIndexed((layoutConfig, layoutName) => ({
    triggerKey: layoutConfig.triggerKey,
    actions: [`yco apply-layout --name ${layoutName}`]
  })),
  values
);

export const getSkhdEntries = ({ ycoConfig }) => {
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
