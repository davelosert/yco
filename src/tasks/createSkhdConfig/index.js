import path from 'path';
import { createFSAdapter } from '../../shared/createFSAdapter';
import { getSkhdEntries } from './getSkhdEntries';


const ycoConfName = 'yco.skhd.conf';

export const createSkhdConfig = async ({ ycoConfig, fs = createFSAdapter() }) => {
  const ycoSkhdConfPath = path.resolve(process.env.HOME, '.config', 'yabai');
  await fs.mkdir(ycoSkhdConfPath, { recursive: true });

  const skhdCommands = getSkhdEntries({ ycoConfig });

  const ycoSkhdConfFile = path.resolve(ycoSkhdConfPath, ycoConfName);
  await fs.writeFile(ycoSkhdConfFile, skhdCommands, 'utf-8');

  const skhdConf = path.resolve(process.env.HOME, '.skhdrc');
  const loadYcoConfStatement = `.load "${ycoSkhdConfFile}"`;
  const skhdConfContent = await fs.readFile(skhdConf, 'utf8');
  if (!skhdConfContent.includes(loadYcoConfStatement)) {
    await fs.appendFile(skhdConf, `.load "${ycoSkhdConfFile}"`, 'utf-8');
  }
};
