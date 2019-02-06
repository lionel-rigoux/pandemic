const path = require('path');
const findUp = require('find-up');

module.exports = () => {
  // start from default
  // ---------------------------------------------------------------------------
  const env = Object.assign(process.env);

  // add cross-env to the path for cross platform compatibility
  // ---------------------------------------------------------------------------
  const nodeModulesPath = findUp.sync(
    'node_modules',
    { cwd: __dirname }
  );
  env.PATH += path.delimiter + path.join(nodeModulesPath, '.bin');

  // add python filters
  // ---------------------------------------------------------------------------
  // make python 'binaries' accessible
  const vendorPath = findUp.sync('vendor', { cwd: __dirname });
  env.PATH += path.delimiter +
    vendorPath +
    path.delimiter +
    path.join(vendorPath, 'bin');
  // make dependencies files accessible to internal python module loader
  env.PYTHONPATH =
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
    path.join(vendorPath, 'psutil');

  // return updated env
  // ---------------------------------------------------------------------------
  return env;
};
