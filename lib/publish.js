const fs = require('fs-extra');
const yamlFront = require('yaml-front-matter');
const shell = require('shelljs');
const path = require('path');
const config = require('../config.js');
const loadInstructions = require('./load-instructions.js');
const getYamlOptions = require('./getYamlOptions.js');

const recipesFolder = path.join(config.RESOURCES_PATH, 'recipes');

function compileDocument ({ source, recipe, format }) {
  // check that source exists
  if (!fs.existsSync(source)) {
    throw new Error(`*** Could not find the source file ${source}.`);
  }

  // create target directory if necessary
  const targetDir = path.join(
    path.dirname(source),
    config.TARGET_PATH
  );
  fs.ensureDirSync(targetDir);

  // if no options provided, check yaml header
  const yamlOptions = getYamlOptions(source);

  // load recipe
  const instructions = loadInstructions({
    recipe: recipe || yamlOptions.recipe,
    format: format || yamlOptions.format
  });

  const recipeFolder = instructions.name === '_defaults'
    ? path.join(__dirname, '..', '_defaults')
    : path.join(config.RECIPES_PATH, instructions.name);

  /* PANDOC OPTIONS */
  let pandocCmd = 'pandoc ';

  // source file
  pandocCmd += source;

  // target file
  const target = path.join(
    targetDir,
    `${path.basename(source, '.md')}.${instructions.format}`
  );
  pandocCmd += ` -o ${target}`;

  // include source directory in search path (allow relative path to images)
  pandocCmd += ` --resource-path=.${path.delimiter}${path.dirname(source)}`;

  // check for bibliography: front-matter > default bib > none
  const frontMatter = yamlFront.loadFront(fs.readFileSync(source));
  if (frontMatter.bibliography) {
    pandocCmd += ` --bibliography=${path.resolve(path.dirname(source), frontMatter.bibliography)}`;
  } else if (fs.existsSync('bibliography.bib')) {
    // if no custom bib file specified, look for default if it's there
    pandocCmd += ` --bibliography=${path.join(path.dirname(source), 'bibliography.bib')}`;
  }

  // use template if needed
  if (instructions.template) {
    pandocCmd += ` --template=${path.join(
      recipesFolder,
      instructions.name,
      instructions.template
    )}`;
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
  if (instructions.filters) {
    instructions.filters.forEach((filter) => {
      pandocCmd += ` --filter=${filter}`;
    });
  }

  // engine
  if (instructions.template && path.extname(instructions.template) === '.xelatex') {
    pandocCmd += ' --pdf-engine=xelatex';
  }

  // start conversion
  shell.cd(recipeFolder);
  const status = shell.exec(pandocCmd);
  if (status.code !== 0) {
    throw new Error(status.stderr);
  }
}

module.exports = compileDocument;
