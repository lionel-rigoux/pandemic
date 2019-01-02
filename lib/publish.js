const fs = require('fs-extra');
const path = require('path');
const config = require('../config.js');
const loadInstructions = require('./load-instructions.js');
const getYamlOptions = require('./get-yaml-options.js');
const { spawnSync } = require('child_process');
const loadPublishingEnv = require('./load-publishing-env.js');

const recipesFolder = path.join(config.RESOURCES_PATH, 'recipes');

function compileDocument ({
  source,
  recipe,
  format,
  logger = () => {}
}) {
  return new Promise((resolve, reject) => {
    // Checks
    // =========================================================================

    // check that source exists
    logger(`source-file: ${source}`);
    if (!fs.existsSync(source)) {
      reject(new Error(`Could not find the source file ${source}.`));
    }
    const sourceDir = path.dirname(source);

    // create target directory if necessary
    const targetDir = path.join(
      path.dirname(source),
      config.TARGET_PATH
    );
    logger(`target-directory: ${targetDir}`);
    fs.ensureDirSync(targetDir);

    // Options and instructions
    // =========================================================================

    // if no options provided, check yaml header
    const yamlOptions = getYamlOptions(source);
    logger(`YAML-header: ${JSON.stringify(yamlOptions, null, 2)}`);

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
    logger(`recipe: ${recipe} (${format})`);
    logger(`instructions: ${JSON.stringify(instructions, null, 2)}`);

    const recipeFolder = instructions.name === '_defaults'
      ? path.join(__dirname, '..', '_defaults')
      : path.join(config.RECIPES_PATH, instructions.name);
    logger(`recipe-folder: ${recipeFolder}`);

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
    pandocCmd += ` --resource-path="${sourceDir}"`;

    // check for bibliography: front-matter > default bib > none
    const defaultBib = 'bibliography.bib';
    let bibliography;
    if (yamlOptions.bibliography) {
      // ensure it's an array
      bibliography = [].concat(yamlOptions.bibliography);
    } else if (fs.existsSync(path.resolve(sourceDir, defaultBib))) {
      bibliography = [defaultBib];
    } else {
      bibliography = [];
    }
    // add bibfiles to the pandoc command
    bibliography.forEach((bibFile) => {
      pandocCmd += ` --bibliography="${path.resolve(sourceDir, bibFile)}"`;
    });

    // use template
    if (instructions.template) {
      pandocCmd += ` --template="${path.join(
        recipeFolder,
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
    const defaultFilters = [
      'pandoc-fignos',
      'pandoc-eqnos',
      'pandoc-tablenos'
    ];
    const filters = instructions.filters || defaultFilters;
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
    pandocCmd += ` --metadata pagetitle="${pagetitle.replace(/"/g, '\\\"')}"`;
    logger(`pandoc-command: ${pandocCmd}`);

    // verbose for debugging
    pandocCmd += ` --verbose`;

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
    logger(`environment: ${JSON.stringify(publishingEnv, null, 2)}`);

    // start with reading the raw source document
    let output = fs.readFileSync(source);

    // for each processin step
    pipeline.forEach((processor) => {
      logger(`§§§ processing step §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n`);
      logger(`°°° command °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n`);
      logger(processor);

      // apply processor
      const child = spawnSync(
        'cross-env', processor.split(' '),
        {
          input: output,
          cwd: recipeFolder,
          env: publishingEnv,
          shell: true
        }
      );
      // set output as new input
      output = child.stdout;

      logger(`\n°°° logs °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n`);
      logger(child.stderr.toString('utf8'));
      logger(`°°° output °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n`);
      logger(output.toString('utf8'));

      if (child.status) {
        reject(new Error(`Failed to compile document when executing: \n ${processor} \n ${child.stderr.toString('utf8')}`));
      }
    });
    // all went well
    logger(`§§§ Done §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n`);
    resolve();
  });
}

module.exports = compileDocument;
