#!/usr/bin/env node

/* Load dependencies */
/* ========================================================================== */
// CLI framework
const prog = require('caporal')
// actions associated with respective commands
const scaffold = require('./scaffold')
const publish = require('./publish')

/* Program description */
/* ========================================================================== */
const version = require('./package.json').version
prog
  .version(version)
  .description('Academic writing without stress.')

/* Program actions */
/* ========================================================================== */
prog
  .command('scaffold', 'Create file tree according to the template')
  .argument('<template>', 'Template to use (project | manuscript)')
  .option('--override', 'Write over existing files')
  .action(scaffold)

prog
  .command('publish', 'Compile a manuscript using pandoc')
  .argument('[source]', 'Source file', /\.md$/, 'manuscript.md')
  .option('-f, --format <docx|pdf>', 'Destination format', /^pdf|docx|html$/, 'pdf')
  .option('--to <recipe>', 'template to use for compiling')
  .action(publish)

/* Put everithing to action */
/* ========================================================================== */
prog.parse(process.argv)
