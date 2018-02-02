const fs = require('fs')

module.exports = (args, options, logger) => {
  const localPath = process.cwd()
  const source = `${localPath}/${args.source}`

  // check that the source file exists
  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
  }

  // extract source directory and filename
  var sourceFilename = source.substr(source.lastIndexOf('/') + 1)
  var sourceDir = source.substr(0, source.lastIndexOf('/') + 1)

  // move to source directory to ease path dependencies
  process.chdir(sourceDir)
  logger.info('Moving to ' + process.cwd())

  // create target directory
  var targetDir = `${sourceDir}/public`
  fs.existsSync(targetDir) || fs.mkdirSync(targetDir)

  logger.info('Functionality not yet ready!')
}
