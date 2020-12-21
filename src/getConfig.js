import path from 'path';
import { promises } from 'fs';


const getDefaultConf = () => {
  const homeDir = process.env.HOME;
  return path.join(homeDir, '.config', 'yabai', 'yco.config.json');
};

export const getConfig = async ({ configPath = getDefaultConf() }) => {
  const rawConfig = await promises.readFile(configPath);
  return JSON.parse(rawConfig);
};
