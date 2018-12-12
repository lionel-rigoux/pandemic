const publish = require('../lib/publish.js');
const path = require('path');

module.exports = (args, options, logger) => {
  // check that the source file exists
  const source = path.resolve(process.cwd(), args.source);

  logger.info('Processing...');
  try {
    publish({
      source,
      recipe: options.to,
      format: options.format
    });
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
  logger.info('Done!');
  process.exit(0);
};
