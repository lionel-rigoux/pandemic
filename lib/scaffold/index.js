const fs = require('fs')
const shell = require('shelljs')
const ncp = require('ncp').ncp

module.exports = (args, options, logger) => {

  const templatePath = `${__dirname}/../../templates/scaffold/${args.template}`
  const localPath = process.cwd()

  const override = options.override || false

  if (fs.existsSync(templatePath)) {
    logger.info('Copying files...')

    var copyOptions = {
      clobber: override
    }
    ncp(templatePath, localPath, copyOptions, err => {
      if (err) {
        logger.error(`The files could not be copied (${err}).`)
        process.exit(1);
      }
    })
    logger.info('The files have been copied!');

  } else {
    logger.error(`The requested template "${args.template}" wasn't found.`)
    process.exit(1);
  }

};
