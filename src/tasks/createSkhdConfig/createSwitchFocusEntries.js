exports.createSwitchFocusEntries = ({ switchFocusConfigs }) =>
  switchFocusConfigs.map(config => `${config.triggerKey} : yco-switch-focus "${config.app}"`);
