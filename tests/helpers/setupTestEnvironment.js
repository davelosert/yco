const { executeYco } = require('./executeYco');
const fs = require('fs');
const { isolated } = require('isolated');
const path = require('path');

const { mkdir, copyFile, readFile } = fs.promises;

const yabaiFakeBin = () => path.resolve(__dirname, 'yabaiFakeBin.sh');

exports.setupTestEnvironment = async ({ configSourcePath, defaultTarget = false }) => {
  const tempDir = await isolated();

  const targetPath = defaultTarget ? path.join(tempDir, '.config', 'yabai') : tempDir;

  await mkdir(targetPath, { recursive: true });
  await copyFile(configSourcePath, path.resolve(targetPath, 'yco.config.json'));
  await copyFile(yabaiFakeBin(), path.resolve(tempDir, 'yabai'));

  const preconfigfuredExecuteYco = async (cmd, yabaiResults) => {
    const options = {
      env: {
        PATH: `${tempDir}:${process.env.PATH}`,
        HOME: tempDir,
      }
    };

    if (yabaiResults) {
      options.env.QUERY_SPACES_RESULT = JSON.stringify(yabaiResults.spacesResult);
      options.env.QUERY_WINDOWS_RESULT = JSON.stringify(yabaiResults.windowsResult);
    }

    return await executeYco({ cmd, options });
  };

  const getYabaiLogs = async () => {
    const rawData = await readFile(path.resolve(tempDir, 'yabai_calls.log'), 'utf-8');
    return rawData.split('\n').filter(val => val !== '');
  };

  return {
    executeYco: preconfigfuredExecuteYco,
    tempDir,
    targetPath,
    getYabaiLogs
  };
};
