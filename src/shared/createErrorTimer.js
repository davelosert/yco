const createErrorTimer = (delay, error) => {
  let timeoutId;
  const promise = new Promise(resolve => {
    timeoutId = setTimeout(resolve, delay);
  }).then(() => {
    throw error;
  });

  return {
    promise,
    clear: () => clearTimeout(timeoutId)
  };
};

module.exports = {
  createErrorTimer
};
