const fs = require('fs')
const yamlFront = require('yaml-front-matter')
const shell = require('shelljs')
const resources = require('../lib/resources-tools.js')
const path = require('path')
const help = require('../lib/help.js')
const recipesFolder = path.join(__dirname, 'recipes')

function parseRecipe (logger, options) {

  if (!options.recipe) {
  /* if no info provided, fallback to default */
    return {
      name: 'default',
      format: options.format || 'pdf'
    }
    // TODO: load default recipes with minimal options (eg. filters)
  }

  // check if recipe exists
  if (!resources.getRecipes().includes(options.recipe)) {
    logger.error(`The recipe "${options.recipe}" is not installed.`)
    help.dispRecipes(logger)
    process.exit(1)
  }

  // find path to recipe folder
  let recipeFolder = path.join(recipesFolder, options.recipe)

  // resolve format
  let formats = resources.getRecipeFormats(options.recipe)

  // check if format exists
  if (options.format & !formats.includes(options.format)) {
      logger.error(`The format ${options.format} is not available for recipe "${options.recipe}"`)
      help.dispFormats(logger,options.recipe)
      process.exit(1)
  }

  // guess format if none provided
  if (!options.format) {
    if (formats.length===1) {
      options.format = formats[0]
    } else {
      // TODO: guess format from template extension
      logger.error(`The ${options.recipe} recipe has multiple associated formats (${formats.join(', ')})`)
      logger.info('Please specify a format using -f ext or --format ext.')
      process.exit(1)
    }
  }

  // find path to recipe file
  let recipeFile = path.join(recipeFolder, `recipe.${options.format}.json`)

  // return json
  let recipe = require(recipeFile)
  recipe.name = options.recipe
  recipe.format = options.format

  return recipe
}

function compileDocument (logger, options) {

  // parse recipe
  let recipe = parseRecipe(logger, options)

  /* PANDOC OPTIONS */
  let pandocCmd = 'pandoc '

  // source file
  pandocCmd += options.source

  // target file
  pandocCmd += ` -o ./public/${options.target}.${recipe.format}`

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
    pandocCmd += ` --template=${path.join(recipesFolder, recipe.name, recipe.template)}`
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
