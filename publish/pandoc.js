const fs = require('fs')
const yamlFront = require('yaml-front-matter')
const shell = require('shelljs')
const {getRecipes, getRecipeFormats} = require('../lib/list-recipes.js')
const path = require('path')

function parseRecipe (logger, options) {
  let recipeFolder = path.join(__dirname, 'recipes', options.recipe)

  if (options.recipe !== 'default' && !fs.existsSync(recipeFolder)) {
    logger.error(`The recipe "${options.recipe}" is not installed. Available recipes: \n`)
    getRecipes().forEach(r => {
      logger.info(`  - ${r.name}`)
    })
    logger.info('\n')
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

      var recipeFormats = getRecipeFormats(options.recipe)

      if (recipeFormats) {
        logger.info(`\n Available format(s) for this recipe: ${recipeFormats}`)
      } else {
        logger.info('No instructions could be found for this recipe...')
        // TODO: try default recipe with best candidate as template in the folder
      }
      logger.info('\n')
      process.exit(1)
    }
  }

  return require(recipeFile)
}

function compileDocument (logger, options) {
  /* PANDOC OPTIONS */
  let pandocCmd = `pandoc ${options.source} -o ./public/${options.target}.${options.format}`

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

  // add pandoc options
  if (recipe.options) {
    if (typeof recipe.options === 'string') {
      pandocCmd += ' ' + recipe.options
    } else {
      pandocCmd += ' ' + recipe.options.join(' ')
    }
  }

  // use template if needed
  if (recipe.template) {
    pandocCmd += ` --template=${path.join(__dirname, 'recipes', options.recipe, recipe.template)}`
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
