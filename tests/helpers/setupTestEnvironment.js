const { executeYco } = require('./executeYco');
const fs = require('fs');
const { isolated } = require('isolated');
const path = require('path');

const { mkdir, copyFile, readFile } = fs.promises;

const yabaiFakeBin = () => path.resolve(__dirname, 'yabaiFakeBin.sh');

exports.setupTestEnvironment = async ({ configSourcePath, defaultTarget = false, insertFiles = [] }) => {

  const tempDir = await isolated({
    files: insertFiles
  });

  const configTargetPath = defaultTarget ? path.join(tempDir, '.config', 'yabai') : tempDir;

  await mkdir(configTargetPath, { recursive: true });
  await copyFile(configSourcePath, path.resolve(configTargetPath, 'yco.config.json'));
  await copyFile(yabaiFakeBin(), path.resolve(tempDir, 'yabai'));

  const preconfigfuredExecuteYco = async (cmd, mockYabaiResults) => {
    const options = {
      env: {
        PATH: `${tempDir}:${process.env.PATH}`,
        HOME: tempDir,
      }
    };

    if (mockYabaiResults) {
      options.env.QUERY_SPACES_RESULT = JSON.stringify(mockYabaiResults.spacesResult);
      options.env.QUERY_WINDOWS_RESULT = JSON.stringify(mockYabaiResults.windowsResult);
    }

    return await executeYco({ cmd, options });
  };

  const getYabaiLogs = async () => {
    try {
      const rawData = await readFile(path.resolve(tempDir, 'yabai_calls.log'), 'utf-8');
      return rawData.split('\n').filter(val => val !== '');
    } catch (err) {
      return [];
    }
  };

  return {
    executeYco: preconfigfuredExecuteYco,
    tempDir,
    configTargetPath,
    getYabaiLogs
  };
};
