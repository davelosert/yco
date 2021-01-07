const path = require('path');
const { promises } = require('fs');

const getDefaultConf = () => {
  const homeDir = process.env.HOME;
  return path.join(homeDir, '.config', 'yabai', 'yco.config.json');
};

exports.getConfig = async ({ configPath = getDefaultConf() }) => {
  const rawConfig = await promises.readFile(configPath);
  return {
    path: configPath,
    content: JSON.parse(rawConfig)
  };
};
