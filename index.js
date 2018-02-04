#!/usr/bin/env node

/* Load dependencies */
/* ========================================================================== */
// CLI framework
const prog = require('caporal')
const fs = require('fs')
// actions associated with respective commands
const scaffold = require('./scaffold')
const publish = require('./publish')

/* Program description */
/* ========================================================================== */
const version = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf8')).version
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
  .option('-f, --format <docx|pdf>', 'Destination format', /^pdf|docx$/, 'pdf')
  .action(publish)

/* Put everithing to action */
/* ========================================================================== */
prog.parse(process.argv)
