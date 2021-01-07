const fs = require('fs');
const { isolated } = require('isolated');
const path = require('path');

const { mkdir, copyFile } = fs.promises;

exports.setupConfigEnv = async ({ configSourcePath, defaultTarget = false }) => {
  const tempDir = await isolated();

  const targetPath = defaultTarget ? path.join(tempDir, '.config', 'yabai') : tempDir;

  await mkdir(targetPath, { recursive: true });
  await copyFile(
    configSourcePath,
    path.resolve(targetPath, 'yco.config.json')
  );

  return {
    tempDir,
    targetPath
  };
};
