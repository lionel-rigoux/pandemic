const fs = require('fs');
const fsTools = require('./fs-tools.js');
const path = require('path');
const config = require('../config.js');

// define acceptable template formats for each target extension
const formatMap = {
  pdf: ['.tex', '.latex', '.xelatex'],
  tex: ['.tex', '.latex', '.xelatex'],
  latex: ['.tex', '.latex', '.xelatex'],
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
function defaultInstructions (format) {
  // start with empty instructions
  let instructions = emptyInstructions('_defaults', format);

  // extend with the default recipe, if it exists for the target extension
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
  return instructions;
}

// test if a given file could serve as a template for the format
function isTemplate (file, format) {
  const { prefix, ext } = splitFormat(format);
  return formatMap[ext]
    .map(e => (prefix.length ? '.' : '') + prefix + e)
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
          filter: file => isTemplate(file, splitFormat(format).ext)
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

    // check if single instruction can be found in the recipe
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    const instructionsPathList = fsTools.listFiles(recipePath, {
      type: 'file',
      filter: fileName => /^recipe\.(.*)\.json$/.test(fileName)
    });

    // found intended format, call again with proper argument
    if (instructionsPathList.length === 1) {
      return loadInstructions({
        recipe,
        format: instructionsPathList[0].match(/recipe\.(.*)\.json/)[1]
      });

    // multiple instructions available, too ambiguous
    } else if (instructionsPathList.length > 1) {
      throw new Error('Multiple formats found for this recipe. Please specify format.');
    }

    // no instructions available, try to guess from folder content
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    // find formats that have exactly one candidate template
    const candidates = fsTools.listFiles(
      recipePath,
      {
        type: 'file'
      }
    );

    // take the first guess as the target format
    /*
    Note that we proceed even if more than one format is found in order to
    default .tex templates to .pdf output
    */
    const [possibleFormat] = Object.keys(formatMap).filter(fmt =>
      candidates.filter(file => isTemplate(file, fmt)).length === 1
    );

    // if found a candidate, try again with best guess
    if (possibleFormat) {
      return loadInstructions({ recipe, format: possibleFormat });
    }

    // too complicated, give up
    // '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    throw new Error('Can not decide how to use this recipe! Please provide a recipe.<format>.json file.');
  } // end if recipe & !format
}

module.exports = loadInstructions;
