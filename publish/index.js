const publish = require('../lib/publish.js');
const fsTools = require('../lib/fs-tools.js');
const path = require('path');

module.exports = (args, options, logger) => {
  let sourceList = args.sources;

  // if no list of files specified, find all markdown in the current folder
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

  // loop over files to compile
  const pms = sourceList.map((sourceFile) => {
    // get full path to file
    const source = path.resolve(process.cwd(), sourceFile);
    // call compiler and collect Promise
    return publish({
      source,
      recipe: options.to,
      format: options.format,
      logger: options.verbose ? logger.error : undefined
    });
  });

  // wait for all files to be compiled and display feedback
  Promise.all(pms)
    .catch((err) => {
      logger.error(`*** ${err.message}`);
      process.exit(1);
    })
    .then((result) => {
      process.exit(0);
    });
};
