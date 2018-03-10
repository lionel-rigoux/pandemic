const fs = require('fs');
const fsTools = require('./fs-tools.js');
const path = require('path');
const config = require('../config.js');

const formatMap = {
  pdf: ['.tex', '.latex', '.xelatex'],
  docx: ['.doc', '.docx'],
  html: ['.html']
};

function loadDefault (format) {
  const recipeFilePath = path.join(
    __dirname,
    '..',
    '_defaults',
    `recipe.${format}.json`
  );

  let recipe = {
    name: '_defaults',
    format
  };

  if (fs.existsSync(recipeFilePath)) {
    recipe = Object.assign(
      {},
      recipe,
      JSON.parse(fs.readFileSync(recipeFilePath, 'utf8'))
    );
  }
  return recipe;
}

function loadInstructions ({ recipe, format }) {
  // ---------------------------------------------------------------------------
  // no info provided. Fall back to default pdf
  // ---------------------------------------------------------------------------
  if (!recipe && !format) {
    return loadDefault('pdf');
  }

  // ---------------------------------------------------------------------------
  // Fall back to default recipe for given format
  // ---------------------------------------------------------------------------
  if (!recipe && format) {
    return loadDefault(format);
  }

  // ---------------------------------------------------------------------------
  // best case scenario
  // ---------------------------------------------------------------------------
  if (recipe && format) {
    // resolve recipe paths
    const recipePath = path.join(config.RECIPES_PATH, recipe);
    const recipeFilePath = path.join(recipePath, `recipe.${format}.json`);

    // start with default
    const recipeJson = loadDefault(format);
    recipeJson.name = recipe;
    recipeJson.format = format;

    // if found, return recipe
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    if (fs.existsSync(recipeFilePath)) {
      const recipeFile = JSON.parse(fs.readFileSync(recipeFilePath, 'utf8'));
      return Object.assign(recipeJson, recipeFile);
      // no recipe file, but the format can help guess the template
      // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    }
    // see if we can find a file that look like a template for the given format
    const candidates = fsTools
      .listFiles(recipePath, { type: 'file' })
      .filter(file => formatMap[format].includes(path.extname(file)));

      // if no ambiguity, use candidate as template
    if (candidates.length === 1) {
      [recipeJson.template] = candidates;
      return recipeJson;

      // could not infer which template to use
    }
    throw new Error(`Could not find recipe.${format}.json and could not guess template.`);

    // end else exist(recipe.format.json)
  } // end if format & recipe

  // ---------------------------------------------------------------------------
  // recipe folder given but format has to be inferred
  // ---------------------------------------------------------------------------
  if (recipe && !format) {
    // resolve path
    const recipePath = path.join(config.RECIPES_PATH, recipe);

    // check if no recipe file can be found, just in case
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    const recipeFiles = fsTools.listFiles(recipePath, {
      type: 'file',
      filter: /^recipe\.(.*)\.json$/
    });

    // found intended format, call again with proper argument
    if (recipeFiles.length === 1) {
      const [, recipeFormat] = recipeFiles[0].match(/recipe\.(.*)\.json/);
      return loadInstructions(recipe, recipeFormat);

      // multiple recipes available, too ambiguous
    } else if (recipeFiles.length > 1) {
      throw new Error('Multiple formats found for this recipe. Please specify format.');
    }

    // no recipe available, try to guess from folder content
    const candidates = [];
    Object.keys(formatMap).forEach((fmt) => {
      fsTools.listFiles(recipePath, { type: 'file' }).forEach((file) => {
        if (formatMap[fmt].includes(path.extname(file))) {
          candidates.push({
            format: fmt,
            template: file
          });
        }
      });
    });
    if (candidates.length === 1) {
      // we have a unique winner
      const defaultRecipe = loadDefault(candidates[0].format);
      const recipeJson = Object.assign(defaultRecipe, candidates[0]);
      recipeJson.name = recipe;
      return recipeJson;
    }
    // too complicated, give up
    throw new Error('Can not decide how to use this recipe! Please provide a recipe.<format>.json file.');
  } // end if recipe & !format

  return undefined;
}

module.exports = loadInstructions;
