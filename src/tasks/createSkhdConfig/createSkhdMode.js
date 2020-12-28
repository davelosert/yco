const modeExitKey = 'escape';

export const createSkhdMode = ({
  name,
  triggerKey,
  entries
}) => {
  const modeDeclaration = `:: ${name} @`;
  const modeTrigger = `${triggerKey} ; ${name}`;
  const modeEntries = entries.map(entry =>
    `${name} < ${entry.triggerKey} : ${entry.actions.join(' | ')} | skhd -k "${modeExitKey}"`
  );
  const modeExit = `${name} < escape ; default`;

  return [
    modeDeclaration,
    modeTrigger,
    ...modeEntries,
    modeExit
  ];
};
