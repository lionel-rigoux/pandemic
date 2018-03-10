const publish = require('./lib/publish.js');

module.exports = {
  publish,
  publishAsync: args => new Promise((resolve, reject) => {
    try {
      publish(args);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  })
};
