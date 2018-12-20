const publish = require('../lib/publish.js');
const path = require('path');

module.exports = (args, options, logger) => {
  // check that the source file exists
  const source = path.resolve(process.cwd(), args.source);

  logger.info('Processing...');
  publish({
    source,
    recipe: options.to,
    format: options.format
  })
    .catch((err) => {
      logger.error(`Compilation failed:\n ${err.message}`);
      process.exit(1);
    })
    .then((result) => {
      logger.info('Done!');
      process.exit(0);
    });
};
