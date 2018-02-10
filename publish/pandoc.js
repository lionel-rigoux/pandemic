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

  const recipeFolder = recipe.name === '_defaults' ?
    path.join(__dirname,'..','_defaults')
    : path.join(config.RECIPES_PATH,recipe.name)

  /* PANDOC OPTIONS */
  let pandocCmd = 'pandoc '

  // source file
  pandocCmd += options.source

  // target file
  const target = path.join(
    options.targetDir,
    path.basename(options.source,'.md') + '.' + recipe.format
  )
  pandocCmd += ` -o ${target}`

  // include source directory in search path (allow relative path to images)
  pandocCmd += ' --resource-path=.'+path.delimiter+path.dirname(options.source)

  // check for bibliography: front-matter > default bib > none
  let frontMatter = yamlFront.loadFront(fs.readFileSync(options.source))
  if (frontMatter.bibliography) {
    pandocCmd += ` --bibliography=${path.resolve(path.dirname(options.source),frontMatter.bibliography)}`
  } else {
    // if no custom bib file specified, look for default if it's there
    if (fs.existsSync(`bibliography.bib`)) {
      pandocCmd += ` --bibliography=${path.join(path.dirname(options.source),'bibliography.bib')}`
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

  shell.cd(recipeFolder)
  let status = shell.exec(pandocCmd)
  if (status.code !== 0) {
    logger.error(status.stderr)
  }
  logger.info('Done!')
}

module.exports = compileDocument
