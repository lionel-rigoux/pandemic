#!/usr/bin/env node

/* Load dependencies */
/* ========================================================================== */
// CLI framework
const prog = require('caporal');
// actions associated with respective commands
const scaffold = require('./scaffold');
const publish = require('./publish');
const manage = require('./manage');
const init = require('./init.js');

/* Program description */
/* ========================================================================== */
const { version } = require('./package.json');

prog
  .version(version)
  .description('Academic writing without stress.');

/* Program actions */
/* ========================================================================== */
prog
  .command('scaffold', 'Create file tree according to the template')
  .argument('<template>', 'Template to use (project | manuscript)')
  .option('--override', 'Write over existing files')
  .action(scaffold);

prog
  .command('publish', 'Compile a manuscript using pandoc')
  .argument(
    '[sources...]', 'Source .md file(s)',
    sources => sources.every(source => /\.md$/.test(source))
  )
  .option('--to <recipe>', 'Template to use for compiling')
  .option('-f, --format <ext>', 'Destination format extension')
  .option('-v, --verbose', 'Print details of compilation')
  .action(publish);

manage();

// create resource foldesr if needed
init(prog.logger());

/* Put everithing to action */
/* ========================================================================== */
prog.parse(process.argv);
