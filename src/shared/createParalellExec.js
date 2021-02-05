exports.createParallelExec = (cmdExec) => async commands => {
  return Promise.all(commands.map(cmdExec));
};
