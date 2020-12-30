exports.createYabaiAdapter = (cmdExec) => ({
  query: async (cmd) => {
    const cmdResult = await cmdExec(cmd);
    return JSON.parse(cmdResult);
  },
  apply: async (cmds) => {
    for (const command of cmds) {
      try {
        await cmdExec(command);
      } catch (error) {
        console.error(`Error with command [${command}]: `, error);
        throw error;
      }
    }
  }
});
