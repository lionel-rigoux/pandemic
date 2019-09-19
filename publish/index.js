const publish = require('../lib/publish.js');
const fsTools = require('../lib/fs-tools.js');
const path = require('path');

module.exports = (args, options, logger) => {
  // if no source file specified, look for all markdowns in the current folder
  let sourceList = args.sources;
  if (!sourceList.length) {
    sourceList = fsTools
      .listFiles(
        process.cwd(),
        {
          type: 'file',
          filter: fileName => /\.md$/.test(fileName)
        }
      );
  }

  // check that the source file exists
  const source = path.resolve(process.cwd(), sourceList[0]);

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
