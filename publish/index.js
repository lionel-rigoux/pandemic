const fs = require('fs')

module.exports = (args, options, logger) => {
  const localPath = process.cwd()
  const source = `${localPath}/${args.source}`

  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
  }

  var sourceFile = source.substr(source.lastIndexOf('/') + 1)
  var sourceDir = source.substr(0, source.lastIndexOf('/') + 1)

  process.chdir(sourceDir)
  logger.info('Moving to ' + process.cwd())

  logger.info('Functionality not yet ready!')
}
