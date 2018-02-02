const fs = require('fs')
const shell = require('shelljs')

module.exports = (args, options, logger) => {
  const localPath = process.cwd()
  const source = `${localPath}/${args.source}`

  // check that the source file exists
  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`)
  }

  // check that pandoc is there
  if (!shell.which('pandoc')) {
    logger.error('*** Please install pandoc to use this script')
  }

  // extract source directory and filename
  var sourceFilename = source.substr(source.lastIndexOf('/') + 1)
  var sourceDir = source.substr(0, source.lastIndexOf('/') + 1)

  // move to source directory to ease path dependencies
  process.chdir(sourceDir)

  // create target directory
  var targetDir = `${sourceDir}/public`
  fs.existsSync(targetDir) || fs.mkdirSync(targetDir)

  // build target filename
  var targetFilename = sourceFilename.substring(0, sourceFilename.lastIndexOf('.'))

  // start conversion
  logger.info('Processing...')
  var pandocCmd = `pandoc ./${sourceFilename} -o ./public/${targetFilename}.${options.format}`
  var status = shell.exec(pandocCmd)
  if (status.code !== 0) {
    logger.error(status.stderr)
  }
  logger.info('Done!')
}
