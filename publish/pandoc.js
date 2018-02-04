const fs = require('fs')
const yamlFront = require('yaml-front-matter')
const shell = require('shelljs')

function parseRecipe (logger, options) {
  let recipeFolder = `${__dirname}/recipes/${options.recipe}`

  if (!fs.existsSync(recipeFolder)) {
    throw Error(`Could not not find recipe "${options.recipe}"`)
  }

  let recipeFile = `${recipeFolder}/recipe.${options.format}.json`

  if (!fs.existsSync(recipeFile)) {
    if (options.recipe === 'default') {
      // fallback to pandoc default
      return {}
    } else {
      throw Error(`Recipe "${options.recipe}" does not handle ${options.format} format.`)
      // TODO: try default recipe with best candidate as template in the folder
    }
  }

  return JSON.parse(fs.readFileSync(recipeFile))
}

function compileDocument (logger, options) {
  /* PANDOC OPTIONS */
  var pandocCmd = `pandoc ${options.source} -o ./public/${options.target}.${options.format}`

  // check for bibliography: front-matter > default bib > none
  var frontMatter = yamlFront.loadFront(fs.readFileSync(options.source))
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
    pandocCmd += ` ${recipe.options}`
  }

  // use template if needed
  if (recipe.template) {
    pandocCmd += ` --template=${__dirname}/recipes/${options.recipe}/${recipe.template}`
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
