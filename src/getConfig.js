import path from 'path';
import { promises } from 'fs';

const homeDir = process.env.HOME;
export const defaultConfigPath = path.join(homeDir, '.config', 'yabai', 'yco.config.json');

export const getConfig = async ({ configPath = defaultConfigPath }) => {
  const rawConfig = await promises.readFile(configPath);
  return JSON.parse(rawConfig);
};
