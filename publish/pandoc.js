const fs = require('fs')
const yamlFront = require('yaml-front-matter')
const shell = require('shelljs')

function parseRecipe (logger, options) {
  let recipeFolder = `${__dirname}/recipes/${options.recipe}`

  if (!fs.existsSync(recipeFolder)) {
    logger.error(`The recipe "${options.recipe}" is not installed. Available recipes: \n`)

    fs.readdirSync(`${__dirname}/recipes/`)
      .filter(file => !(/^\./g).test(file)) // ignore invisible
      .forEach(file => {
        logger.info(`  - ${file}`)
      })
    logger.info('\n')
    process.exit(1)
  }

  let recipeFile = `${recipeFolder}/recipe.${options.format}.json`

  if (!fs.existsSync(recipeFile)) {
    if (options.recipe === 'default') {
      // fallback to pandoc default
      return {}
    } else {
      // inform user about available formats
      logger.error(`The format ${options.format} is not available for recipe "${options.recipe}"`)

      var recipeFormats = fs.readdirSync(recipeFolder)
        .reduce((fList, file) => {
          let format = file.match(/^recipe\.(.+)\.json$/)
          if (format) {
            return fList + format[1] + ' '
          } else {
            return fList
          }
        }, '')

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
