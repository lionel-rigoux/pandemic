const fs = require('fs');
const shell = require('shelljs');

module.exports = (args, options, logger) => {

  const templatePath = `${__dirname}/../../templates/scaffold/${args.template}`
  const localPath = process.cwd()

  const override = options.override || false

  if (fs.existsSync(templatePath)) {
    logger.info('Copying files…');
    shell.cp('-R', `${templatePath}/*`, localPath);
    logger.info('The files have been copied!');
  } else {
    logger.error(`The requested template "${args.template}" wasn't found.`)
    process.exit(1);
  }

};
