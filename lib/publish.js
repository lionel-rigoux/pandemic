const fs = require('fs-extra');
const path = require('path');
const config = require('../config.js');
const loadInstructions = require('./load-instructions.js');
const getYamlOptions = require('./getYamlOptions.js');
const { execSync } = require('child_process');
const findUp = require('find-up');

const recipesFolder = path.join(config.RESOURCES_PATH, 'recipes');

function compileDocument ({ source, recipe, format }) {
  return new Promise((resolve, reject) => {
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

    // if no options provided, check yaml header
    const yamlOptions = getYamlOptions(source);

    // load recipe
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

    /* PANDOC OPTIONS */
    let pandocCmd = 'pandoc ';

    // target file
    const target = path.join(
      targetDir,
      `${path.basename(source, '.md')}.${instructions.format}`
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

    // use template if needed
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
    const defaultFilters = [
      'pandoc-fignos',
      'pandoc-eqnos',
      'pandoc-tablenos'
    ];
    (instructions.filters || defaultFilters).forEach((filter) => {
      pandocCmd += ` --filter=${filter}`;
    });

    // engine
    if (instructions.template && path.extname(instructions.template) === '.xelatex') {
      pandocCmd += ' --pdf-engine=xelatex';
    }

    // title, mandatory for html
    const pagetitle = yamlOptions.title || path.basename(source, '.md');
    pandocCmd += ` --metadata pagetitle="${pagetitle}"`;

    // conversion
    // read raw source document
    let output = fs.readFileSync(source);
    // chain preprocessing hooks and pandoc command
    const pipeline = instructions.prehooks || [];
    if (yamlOptions.pandemic.mustache && !pipeline.includes('pandemic-mustache')) {
      pipeline.push('pandemic-mustache');
    }
    pipeline.push(pandocCmd);
    // prepare env variable
    const env = Object.create(process.env);
    env.PANDOC_SOURCE_PATH = path.dirname(source);
    env.PANDOC_TARGET_PATH = path.dirname(target);

    // add cross-env to th path for cross pltform compatibility
    const binPath = path.join(
      findUp.sync(
        'node_modules',
        { cwd: __dirname }
      ),
      '.bin'
    );
    process.env.PATH += path.delimiter + binPath;
    // add python filters
    const vendorPath = findUp.sync('vendor', { cwd: __dirname });
    process.env.PATH += path.delimiter +
      vendorPath +
      path.delimiter +
      path.join(vendorPath, 'bin');
    process.env.PYTHONPATH =
      path.join(vendorPath, 'pandoc-eqnos') +
      path.delimiter +
      path.join(vendorPath, 'pandoc-fignos') +
      path.delimiter +
      path.join(vendorPath, 'pandoc-tablenos') +
      path.delimiter +
      path.join(vendorPath, 'pandocfilters') +
      path.delimiter +
      path.join(vendorPath, 'pandoc-xnos') +
      path.delimiter +
      path.join(vendorPath, 'psutils/psutils');
    // actually run the compiling pipeline
    try {
      // loop over scripts
      pipeline.forEach((processor) => {
        // run
        output = execSync(
          `cross-env ${processor}`,
          {
            cwd: recipeFolder,
            input: output,
            env
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
