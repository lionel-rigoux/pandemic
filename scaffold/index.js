/* scaffolding:
Copy a file tree from one of the package templates to current directory
 */

const fs = require('fs')
const ncp = require('ncp').ncp
const config = require('../config.js')
const path = require('path')

module.exports = (args, options, logger) => {
  // get source and target folders
  const templateRoot = path.join(config.RESOURCES_PATH,'templates')
  const templatePath = path.join(templateRoot, args.template)
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
      process.exit(1)
    }
  })

  // confirm success
  logger.info('The files have been copied!')
}
