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
const checkInstall = require('./lib/check-install.js');

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
  .argument('[source]', 'Source file', /\.md$/, 'manuscript.md')
  .option('--to <recipe>', 'template to use for compiling')
  .option('-f, --format <ext>', 'Destination format extension', /^pdf|docx|html$/)
  .action(publish);

manage();

// check that pandoc and co are there
checkInstall(prog.logger());
// create resource foldesr if needed
init(prog.logger());

/* Put everithing to action */
/* ========================================================================== */
prog.parse(process.argv);
