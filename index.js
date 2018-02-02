#!/usr/bin/env node

/* Load dependencies */
/* ========================================================================== */
// CLI framework
const prog = require('caporal')
// actions associated with respective commands
const scaffold = require('./scaffold');

/* Program description */
/* ========================================================================== */
prog
  .version('0.0.1')
  .description('Academic writing without stress.')
//  .logger(logger)

/* Program actions */
/* ========================================================================== */
prog
  .command('scaffold', 'Create file tree according to the template')
  .argument('<template>', 'Template to use (project | manuscript)')
  .option('--override', 'Write over existing files')
  .action(scaffold);

prog
  .command('publish', 'Compile a manuscript using pandoc')

/* Put everithing to action */
/* ========================================================================== */
prog.parse(process.argv);
