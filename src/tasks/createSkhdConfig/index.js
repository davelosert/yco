import path from 'path';
import { promises } from 'fs';
import { getSkhdEntries } from './getSkhdEntries';

const { appendFile, mkdir, readFile, writeFile } = promises;

const ycoConfName = 'yco.skhd.conf';

export const createSkhdConfig = async ({ ycoConfig }) => {
  const ycoSkhdConfPath = path.resolve(process.env.HOME, '.config', 'yabai');
  await mkdir(ycoSkhdConfPath, { recursive: true });

  const skhdCommands = getSkhdEntries({ ycoConfig });

  const ycoSkhdConfFile = path.resolve(ycoSkhdConfPath, ycoConfName);
  await writeFile(ycoSkhdConfFile, skhdCommands, 'utf-8');

  const skhdConf = path.resolve(process.env.HOME, '.skhdrc');
  const loadYcoConfStatement = `.load ${ycoSkhdConfFile}`;
  const skhdConfContent = await readFile(skhdConf, 'utf8');
  if (!skhdConfContent.includes(loadYcoConfStatement)) {
    await appendFile(skhdConf, `.load ${ycoSkhdConfFile}`, 'utf-8');
  }
};
