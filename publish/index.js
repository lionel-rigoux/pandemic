const fs = require('fs')
const shell = require('shelljs')
const yamlFront = require('yaml-front-matter')

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
  // process.chdir(sourceDir)

  // create target directory
  var targetDir = `${sourceDir}/public`
  fs.existsSync(targetDir) || fs.mkdirSync(targetDir)

  // build target filename
  var targetFilename = sourceFilename.substring(0, sourceFilename.lastIndexOf('.'))

  /* PANDOC OPTIONS */
  var pandocCmd = `pandoc ${source} -o ${sourceDir}/public/${targetFilename}.${options.format}`

  // check for bibliography: front-matter > default bib > none
  var frontMatter = yamlFront.loadFront(fs.readFileSync(source))
  if (!frontMatter.bibliography) {
    // if no custom bib file specified, look for default if it's there
    if (fs.existsSync(`${sourceDir}/bibliography.bib`)) {
      pandocCmd += ` --bibliography=${sourceDir}/bibliography.bib`
    }
  }

  // start conversion
  logger.info('Processing...')
  var status = shell.exec(pandocCmd)
  if (status.code !== 0) {
    logger.error(status.stderr)
  }
  logger.info('Done!')
}
