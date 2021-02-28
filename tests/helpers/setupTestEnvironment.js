const { executeYco } = require('./executeYco');
const fs = require('fs');
const { isolated } = require('isolated');
const path = require('path');

const { mkdir, copyFile, readFile, writeFile } = fs.promises;

const yabaiFakeBin = () => path.resolve(__dirname, 'yabaiFakeBin.sh');
const openFakeBin = () => path.resolve(__dirname, 'openFakeBin.sh');

exports.setupTestEnvironment = async ({ configSourcePath, defaultTarget = false, insertFiles = [] }) => {

  const tempDir = await isolated({ files: insertFiles });
  const configTargetPath = defaultTarget ? path.join(tempDir, '.config', 'yabai') : tempDir;

  await mkdir(configTargetPath, { recursive: true });
  await copyFile(configSourcePath, path.resolve(configTargetPath, 'yco.config.json'));
  await copyFile(yabaiFakeBin(), path.resolve(tempDir, 'yabai'));
  await copyFile(openFakeBin(), path.resolve(tempDir, 'open'));

  const preconfigfuredExecuteYco = async (cmd, mockYabaiResults) => {
    const options = {
      env: {
        PATH: `${tempDir}:${process.env.PATH}`,
        HOME: tempDir
      }
    };

    if (mockYabaiResults) {
      options.env.QUERY_SPACES_RESULT = JSON.stringify(mockYabaiResults.spacesResult);

      if (!Array.isArray(mockYabaiResults.windowsResult[0])) {
        // Insert it twice as it will be called both, by the "openMissingWindows" and by "apply-layout"
        mockYabaiResults.windowsResult = [
          mockYabaiResults.windowsResult,
          mockYabaiResults.windowsResult
        ];
      }

      await Promise.all(
        mockYabaiResults.windowsResult.map((windowResult, index) => {
          return writeFile(path.resolve(tempDir, `yabaiWindowResult${index}.json`), JSON.stringify(windowResult), 'utf-8');
        }));
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

  const getOpenLogs = async () => {
    try {
      const rawData = await readFile(path.resolve(tempDir, 'open_calls.log'), 'utf-8');
      return rawData.split('\n').filter(val => val !== '');
    } catch (err) {
      return [];
    }

  };

  return {
    executeYco: preconfigfuredExecuteYco,
    tempDir,
    configTargetPath,
    getYabaiLogs,
    getOpenLogs
  };
};
