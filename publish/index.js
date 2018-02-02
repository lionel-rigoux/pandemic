const fs = require('fs')

module.exports = (args, options, logger) => {


  const localPath = process.cwd()
  const sourceFile = `${localPath}/${args.source}`

  if (!fs.existsSync(sourceFile)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
    logger.info(`Are you sure you are in the right folder?`)
  }

  logger.info('Functionality not yet ready!')

}
