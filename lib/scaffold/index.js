/* scaffolding:
Copy a file tree from one of the package templates to current directory
 */

const fs = require('fs')
const shell = require('shelljs')
const ncp = require('ncp').ncp

module.exports = (args, options, logger) => {

  // get source and target folders
  const templateRoot = `${__dirname}/../../templates/scaffold/`
  const templatePath = `${templateRoot}/${args.template}`
  const localPath = process.cwd()

  // optional destructive copying
  const override = options.override || false

  // check if the template exists or give some help
  if (!fs.existsSync(templatePath)) {
    logger.error(`*** The requested template "${args.template}" wasn't found.`)
    logger.info('\n Available templates: ')
    fs.readdirSync(templateRoot)
      .filter(file => !(/^\./g).test(file)) // ignore invisible
      .forEach(file => {
        logger.info(`  - ${file}`)
      })
      logger.info('\n')
    process.exit(1)
  }

  // start copy
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

  // confirm success
  logger.info('The files have been copied!');

};
