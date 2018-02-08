const fs = require('fs')
const yamlFront = require('yaml-front-matter')
const shell = require('shelljs')
const resources = require('../lib/resources-tools.js')
const path = require('path')
const help = require('../lib/help.js')
const config = require('../config.js')
const loadRecipe = require('./load-recipe.js')

const recipesFolder = path.join(config.RESOURCES_PATH, 'recipes')

function compileDocument(logger, options) {
  // load recipe
  let recipe = loadRecipe(options.recipe, options.format)
  logger.debug('Using recipe: ')
  logger.debug(recipe)
  logger.debug('')

  /* PANDOC OPTIONS */
  let pandocCmd = 'pandoc '

  // source file
  pandocCmd += options.source

  // target file
  pandocCmd +=
    ' -o ' + path.join(config.TARGET_PATH, `${options.target}.${recipe.format}`)

  // include source and template directory in search path
  if (recipe.name !== 'default') {
    pandocCmd += ` --resource-path=.:${path.join(recipesFolder, recipe.name)}/`
  }

  // check for bibliography: front-matter > default bib > none
  let frontMatter = yamlFront.loadFront(fs.readFileSync(options.source))
  if (!frontMatter.bibliography) {
    // if no custom bib file specified, look for default if it's there
    if (fs.existsSync(`bibliography.bib`)) {
      pandocCmd += ` --bibliography=bibliography.bib`
    }
  }

  // use template if needed
  if (recipe.template) {
    pandocCmd += ` --template=${path.join(
      recipesFolder,
      recipe.name,
      recipe.template
    )}`
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
  logger.debug(`Calling: \n ${pandocCmd}\n`)
  logger.info('Processing...')

  var status = shell.exec(pandocCmd)
  if (status.code !== 0) {
    logger.error(status.stderr)
  }
  logger.info('Done!')
}

module.exports = compileDocument
