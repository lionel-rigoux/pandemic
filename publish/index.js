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
    .then(result => logger.info('Done!'))
    .catch((err) => {
      logger.error(err.message);
      process.exit(1);
    })
};
