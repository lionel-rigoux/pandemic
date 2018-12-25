const fs = require('fs-extra');
const path = require('path');
const config = require('../config.js');
const loadInstructions = require('./load-instructions.js');
const getYamlOptions = require('./get-yaml-options.js');
const { execSync } = require('child_process');
const loadPublishingEnv = require('./load-publishing-env.js');

const recipesFolder = path.join(config.RESOURCES_PATH, 'recipes');

function compileDocument ({ source, recipe, format }) {
  return new Promise((resolve, reject) => {
    // Checks
    // =========================================================================

    // check that source exists
    if (!fs.existsSync(source)) {
      reject(new Error(`Could not find the source file ${source}.`));
    }

    // create target directory if necessary
    const targetDir = path.join(
      path.dirname(source),
      config.TARGET_PATH
    );
    fs.ensureDirSync(targetDir);

    // Options and instructions
    // =========================================================================

    // if no options provided, check yaml header
    const yamlOptions = getYamlOptions(source);

    // load recipe instructions
    let instructions;
    try {
      instructions = loadInstructions({
        recipe: recipe || yamlOptions.pandemic.recipe,
        format: format || yamlOptions.pandemic.format
      });
    } catch (err) {
      reject(err);
    }

    const recipeFolder = instructions.name === '_defaults'
      ? path.join(__dirname, '..', '_defaults')
      : path.join(config.RECIPES_PATH, instructions.name);

    // Build Pandoc command
    // =========================================================================

    // start from the beginning
    let pandocCmd = 'pandoc ';

    // target file
    const targetExt = instructions.format.split('.').pop();
    const target = path.join(
      targetDir,
      `${path.basename(source, '.md')}.${targetExt}`
    );
    pandocCmd += ` -o "${target}"`;

    // include source directory in search path (allow relative path to images)
    pandocCmd += ` --resource-path="${path.dirname(source)}"`;

    // check for bibliography: front-matter > default bib > none
    const bibliography = yamlOptions.bibliography || 'bibliography.bib';
    const bibliographyPath = path.resolve(path.dirname(source), bibliography);

    if (fs.existsSync(bibliographyPath)) {
      pandocCmd += ` --bibliography="${bibliographyPath}"`;
    }

    // use template
    if (instructions.template) {
      pandocCmd += ` --template="${path.join(
        recipesFolder,
        instructions.name,
        instructions.template
      )}"`;
    }

    // add pandoc options
    if (instructions.options) {
      if (typeof instructions.options === 'string') {
        pandocCmd += ` ${instructions.options}`;
      } else {
        pandocCmd += ` ${instructions.options.join(' ')}`;
      }
    }

    // use filters
    const filters = [
      'pandoc-fignos',
      'pandoc-eqnos',
      'pandoc-tablenos'
    ].concat(instructions.filters || []);
    filters.forEach((filter) => {
      pandocCmd += ` --filter=${filter}`;
    });

    // xelatex engine
    if (
      instructions.template &&
      path.extname(instructions.template) === '.xelatex'
    ) {
      pandocCmd += ' --pdf-engine=xelatex';
    }

    // title, mandatory for html
    const pagetitle = yamlOptions.title || path.basename(source, '.md');
    pandocCmd += ` --metadata pagetitle="${pagetitle}"`;

    // Prepare all the processing steps
    // =========================================================================

    // start with preprocessing
    const pipeline = instructions.prehooks || [];

    // add mustache if necessary
    if (
      yamlOptions.pandemic.mustache &&
      !pipeline.includes('pandemic-mustache')
    ) {
      pipeline.push('pandemic-mustache');
    }

    // finally, call to pandoc
    pipeline.push(pandocCmd);

    // Actually compile the document
    // =========================================================================

    // load python filters, binaries, and pass on path info to preprocessing
    const publishingEnv = loadPublishingEnv();
    publishingEnv.PANDOC_SOURCE_PATH = path.dirname(source);
    publishingEnv.PANDOC_TARGET_PATH = path.dirname(target);

    // start with reading the raw source document
    let output = fs.readFileSync(source);

    // chain processing steps
    try {
      pipeline.forEach((processor) => {
        output = execSync(
          `cross-env ${processor}`,
          {
            cwd: recipeFolder,
            input: output,
            env: publishingEnv
          }
        );
      });
    } catch (err) {
      reject(err);
    }
    // all went well
    resolve();
  });
}

module.exports = compileDocument;
