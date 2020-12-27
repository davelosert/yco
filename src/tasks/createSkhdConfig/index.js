import path from 'path';
import { promises } from 'fs';
import { getSkhdEntries } from './getSkhdEntries';

const { appendFile, writeFile, mkdir } = promises;

const ycoConfName = 'yco.skhd.conf';

export const createSkhdConfig = async ({ ycoConfig }) => {
  const ycoSkhdConfPath = path.resolve(process.env.HOME, '.config', 'yabai');
  await mkdir(ycoSkhdConfPath, { recursive: true });

  const skhdCommands = getSkhdEntries({ ycoConfig });

  const ycoSkhdConfFile = path.resolve(ycoSkhdConfPath, ycoConfName);
  await writeFile(ycoSkhdConfFile, skhdCommands, 'utf-8');

  const skhdConf = path.resolve(process.env.HOME, '.skhdrc');
  await appendFile(skhdConf, `.load ${ycoSkhdConfFile}`);
};
