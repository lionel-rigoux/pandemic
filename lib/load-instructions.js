const fs = require('fs');
const fsTools = require('./fs-tools.js');
const path = require('path');
const config = require('../config.js');

// define acceptable template formats for each target extension
const formatMap = {
  tex: ['.tex', '.latex', '.xelatex'],
  latex: ['.tex', '.latex', '.xelatex'],
  pdf: ['.tex', '.latex', '.xelatex'],
  docx: ['.doc', '.docx'],
  html: ['.html']
};

// extract compound formats: prefix.ext
function splitFormat (format) {
  const prefix = format.split('.');
  const ext = prefix.pop();
  return { prefix, ext };
}

// 'empty' recipe instruction
function emptyInstructions (name, format) {
  return { name, format };
}

// default recipe instruction
function defaultInstructions (name, format) {
  // start with empty instructions
  let instructions = emptyInstructions('_default', format);

  // check if a default recipe exists for the target extension
  const recipeFilePath = path.join(
    __dirname,
    '..',
    '_defaults',
    `recipe.${splitFormat(format).ext}.json`
  );
  if (fs.existsSync(recipeFilePath)) {
    instructions = Object.assign(
      instructions,
      JSON.parse(fs.readFileSync(recipeFilePath, 'utf8'))
    );
  }
  // return default
  return instructions;
}

//
function isTemplate (file, format) {
  const { prefix, ext } = splitFormat(format);
  return formatMap[ext]
    .map(e => '.' + prefix + e)
    .some(e => file.endsWith(e));
}

function loadInstructions ({ recipe, format }) {
  // ---------------------------------------------------------------------------
  // no info provided. Fall back to default pdf
  // ---------------------------------------------------------------------------
  if (!recipe && !format) {
    return defaultInstructions('pdf');
  }

  // ---------------------------------------------------------------------------
  // Fall back to default recipe for given format
  // ---------------------------------------------------------------------------
  if (!recipe && format) {
    return defaultInstructions(format);
  }

  // ---------------------------------------------------------------------------
  // fully defined case
  // ---------------------------------------------------------------------------
  if (recipe && format) {
    // start from minimal instructions
    const instructions = emptyInstructions(recipe, format);

    // look if instructions are given in the recipe
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    // resolve recipe path and look for instructions
    const recipePath = path.join(config.RECIPES_PATH, recipe);
    const instructionsPath = path.join(recipePath, `recipe.${format}.json`);

    // if instructions are found, return them
    if (fs.existsSync(instructionsPath)) {
      try {
        return Object.assign(
          instructions,
          JSON.parse(fs.readFileSync(instructionsPath, 'utf8'))
        );
      } catch (err) {
        throw new Error(`Invalid recipe. Check that ${instructionsPath} contains correctly defined JSON.`);
      }
    }

    // no instructions provided, but the format can help guess the template
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    // see if we can find a file that look like a template for the given format
    const candidates = fsTools
      .listFiles(
        recipePath,
        {
          type: 'file',
          filter: file => isTemplate(file, format)
        }
      );

    // if no ambiguity, use candidate as template
    if (candidates.length === 1) {
      [instructions.template] = candidates;
      return instructions;
    }

    // no instructions and no template could be guessed
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

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
    const instructionsPathList = fsTools.listFiles(recipePath, {
      type: 'file',
      filter: /^recipe\.(.*)\.json$/.test
    });

    // found intended format, call again with proper argument
    if (instructionsPathList.length === 1) {
      return loadInstructions({
        recipe,
        format: instructionsPathList[0].match(/recipe\.(.*)\.json/)[1]
      });

      // multiple recipes available, too ambiguous
    } else if (instructionsPathList.length > 1) {
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
      const defaultRecipe = defaultInstructions(candidates[0].format);
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
