const wait = async ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  wait
};
