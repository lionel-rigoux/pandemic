const publish = require('../lib/publish.js');
const path = require('path');

module.exports = (args, options, logger) => {
  // check that the source file exists
  const source = path.resolve(process.cwd(), args.source);

  publish({
    source,
    recipe: options.to,
    format: options.format,
    logger: options.verbose ? logger.error : undefined
  })
    .catch((err) => {
      logger.error(`*** ${err.message}`);
      process.exit(1);
    })
    .then((result) => {
      process.exit(0);
    });
};
