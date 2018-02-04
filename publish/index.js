const fs = require('fs')
const pandoc = require('./pandoc.js')
const shell = require('shelljs')

module.exports = (args, options, logger) => {
  const localPath = process.cwd()
  const source = `${localPath}/${args.source}`

  // check that the source file exists
  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
    process.exit(1)
  }

  // check that pandoc is there
  if (!shell.which('pandoc')) {
    logger.error('*** Please install pandoc to use this script')
    process.exit(1)
  }

  // extract source directory and filename
  var sourceFilename = source.substr(source.lastIndexOf('/') + 1)
  var sourceDir = source.substr(0, source.lastIndexOf('/') + 1)

  // create target directory
  var targetDir = `${sourceDir}/public`
  fs.existsSync(targetDir) || fs.mkdirSync(targetDir)

  // build target filename
  var targetFilename = sourceFilename.substring(0, sourceFilename.lastIndexOf('.'))

  // ensure images and dependencies are found
  process.chdir(sourceDir)
  // the following would be better but need pandoc > v2.1.1
  // pandocCmd += ` --resource-path=${sourceDir}`

  try {
    pandoc(logger, {
      source: sourceFilename,
      target: targetFilename,
      recipe: options.to || 'default',
      format: options.format
    })
  } catch (err) {
    logger.error(err.message)
  }
}
