const fs = require('fs')
const pandoc = require('./pandoc.js')
const shell = require('shelljs')
const path = require('path')
const config = require('../config.js')
const checkInstall = require('./check-install.js')

module.exports = (args, options, logger) => {

  // check that pandoc and co are there
  checkInstall(logger)

  // check that the source file exists
  const source = path.join(process.cwd(), args.source)

  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
    process.exit(1)
  }

  // extract source directory and filename
  let sourceFilename = path.basename(source)
  let sourceDir = path.dirname(source)

  // create target directory
  let targetDir = path.join(sourceDir, config.TARGET_PATH)
  fs.existsSync(targetDir) || fs.mkdirSync(targetDir)

  // build target filename
  var targetFilename = path.basename(source, '.md')

  // ensure images and dependencies are found
  process.chdir(sourceDir)

  try {
    pandoc(logger, {
      source: sourceFilename,
      target: targetFilename,
      recipe: options.to,
      format: options.format
    })
  } catch (err) {
    logger.error(err.message)
  }
}
