const fs = require('fs')
const yamlFront = require('yaml-front-matter')
const shell = require('shelljs')
const resources = require('../lib/resources-tools.js')
const path = require('path')
const help = require('../lib/help.js')

function parseRecipe (logger, options) {
  let recipeFolder = path.join(__dirname, 'recipes', options.recipe)

  if (options.recipe !== 'default' && !fs.existsSync(recipeFolder)) {
    logger.error(`The recipe "${options.recipe}" is not installed.`)
    help.dispRecipes(logger)
    process.exit(1)
  }

  let recipeFile = path.join(recipeFolder, `recipe.${options.format}.json`)

  if (!fs.existsSync(recipeFile)) {
    if (options.recipe === 'default') {
      // fallback to pandoc default
      return {}
    } else {
      // inform user about available formats
      logger.error(`The format ${options.format} is not available for recipe "${options.recipe}"`)
      help.dispFormats(logger,options.recipe)
      process.exit(1)
    }
  }

  return require(recipeFile)
}

function compileDocument (logger, options) {
  /* PANDOC OPTIONS */
  let pandocCmd = 'pandoc '

  // source file
  pandocCmd += options.source

  // target file
  pandocCmd += ` -o ./public/${options.target}.${options.format}`
  
  // include source and template directory in search path
  pandocCmd += ` --resource-path=.:${path.join(__dirname, 'recipes', options.recipe)}/`

  // check for bibliography: front-matter > default bib > none
  let frontMatter = yamlFront.loadFront(fs.readFileSync(options.source))
  if (!frontMatter.bibliography) {
    // if no custom bib file specified, look for default if it's there
    if (fs.existsSync(`bibliography.bib`)) {
      pandocCmd += ` --bibliography=bibliography.bib`
    }
  }

  // parse recipe
  var recipe = parseRecipe(logger, options)

  // use template if needed
  if (recipe.template) {
    pandocCmd += ` --template=${path.join(__dirname, 'recipes', options.recipe, recipe.template)}`
  }

  // add pandoc options
  if (recipe.options) {
    if (typeof recipe.options === 'string') {
      pandocCmd += ' ' + recipe.options
    } else {
      pandocCmd += ' ' + recipe.options.join(' ')
    }
  }

  // use filters
  if (recipe.filters) {
    recipe.filters.forEach(filter => {
      pandocCmd += ` --filter=${filter}`
    })
  }

  // start conversion
  logger.info('Processing...')

  var status = shell.exec(pandocCmd)
  if (status.code !== 0) {
    logger.error(status.stderr)
  }
  logger.info('Done!')
}

module.exports = compileDocument
