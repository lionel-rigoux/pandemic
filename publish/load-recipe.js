const fs = require('fs')
const fsTools = require('../lib/fs-tools.js')
const path = require('path')
const resources = require('../lib/resources-tools.js')
const config = require('../config.js')

const formatMap = {
  pdf: ['.tex', '.latex','.xelatex'],
  docx: ['.doc', '.docx'],
  html: ['.html']
}

function loadDefault(format) {
  let recipeFilePath = path.join(
    __dirname,
    '..',
    '_defaults',
    `recipe.${format}.json`
  )

  let recipe = {
    name: '_defaults',
    format: format
  }

  if (fs.existsSync(recipeFilePath)) {
   recipe = Object.assign({},
     recipe,
     require(recipeFilePath)
   )
  }
  return recipe
}

function loadRecipe(recipe, format) {
  // ---------------------------------------------------------------------------
  // no info provided. Fall back to default pdf
  // ---------------------------------------------------------------------------
  if (!recipe && !format) {
    return loadDefault('pdf')
  }

  // ---------------------------------------------------------------------------
  // Fall back to default recipe for given format
  // ---------------------------------------------------------------------------
  if (!recipe && format) {
    return loadDefault(format)
  }

  // ---------------------------------------------------------------------------
  // best case scenario
  // ---------------------------------------------------------------------------
  if (recipe && format) {
    // resolve recipe paths
    let recipePath = path.join(config.RECIPES_PATH, recipe)
    let recipeFilePath = path.join(recipePath, `recipe.${format}.json`)

    // start with default
    let recipeJson = loadDefault(format)
    recipeJson.name = recipe
    recipeJson.format = format


    // if found, return recipe
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    if (fs.existsSync(recipeFilePath)) {
      let recipeFile = require(recipeFilePath)
      return Object.assign({}, recipeJson, recipeFile)

      // no recipe file, but the format can help guess the template
      // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    } else {

      // see if we can find a file that look like a template for the given format
      let candidates = fsTools
        .listFiles(recipePath, {type: 'file'})
        .filter(file => {
          return formatMap[format].includes(path.extname(file))
        })

      // if no ambiguity, use candidate as template
      if (candidates.length === 1) {
        recipeJson.template = candidates[0]
        return recipeJson

        // could not infer which template to use
      } else {
        throw new Error(
          `Could not find recipe.${format}.json and could not guess template.`
        )
      }
    } // end else exist(recipe.format.json)
  } // end if format & recipe

  // ---------------------------------------------------------------------------
  // recipe folder given but format has to be inferred
  // ---------------------------------------------------------------------------
  if (recipe && !format) {
    // resolve path
    let recipePath = path.join(config.RECIPES_PATH, recipe)

    // check if no recipe file can be found, just in case
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    let recipeFiles = fsTools.listFiles(recipePath, {
      type: 'file',
      filter: /^recipe\.(.*)\.json$/
    })

    // found intended format, call again with proper argument
    if (recipeFiles.length === 1) {
      format = recipeFiles[0].match(/recipe\.(.*)\.json/)[1]
      return loadRecipe(recipe, format)

      // multiple recipes available, too ambiguous
    } else if (recipeFiles.length > 1) {
      throw new Error(
        'Multiple formats found for this recipe. Please specify format.'
      )
    }

    // no recipe available, try to guess from folder content
    let candidates = []
    Object.keys(formatMap).forEach(function(fmt) {
      fsTools.listFiles(recipePath, {type: 'file'}).forEach(file => {
        if (formatMap[fmt].includes(path.extname(file))) {
          candidates.push({
            format: fmt,
            template: file
          })
        }
      })
    })
    if (candidates.length === 1) {
      // we have a unique winner
      let defRecipe = loadDefault(candidates[0].format)
      let recipeJson = Object.assign({}, defRecipe, candidates[0])
      recipeJson.name = recipe
      return recipeJson
    } else {
      // too complicated, give up
      throw new Error(
        'Can not decide how to use this recipe! Please provide a recipe.<format>.json file.'
      )
    }
  } // end if recipe & !format
}

module.exports = loadRecipe
