const fs = require('fs-extra')
const pandoc = require('./pandoc.js')
const path = require('path')
const config = require('../config.js')
const checkInstall = require('./check-install.js')

module.exports = (args, options, logger) => {
  // check that pandoc and co are there
  checkInstall(logger)

  // check that the source file exists
  const source = path.resolve(process.cwd(), args.source)

  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
    process.exit(1)
  }

  // create target directory if necessary
  const targetDir = path.join(
    path.dirname(source),
    config.TARGET_PATH
  )
  fs.ensureDirSync(targetDir)

  try {
    pandoc(logger, {
      source,
      targetDir,
      recipe: options.to,
      format: options.format
    })
  } catch (err) {
    logger.error(err.message)
  }
}
