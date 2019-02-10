#!/usr/bin/env node

// this script download external dependencies provided as precompiled binaries

const path = require('path');
const download = require('download');

// get pandoc binaries
// -------------------------------------------------------

const pandocBaseUrl =
  'https://github.com/jgm/pandoc/releases/download/2.5/';

let pandocFile;
let pandocFilter = file => true;
let pandocMap = file => file;

switch (process.platform) {
  case 'darwin':
    pandocFile = 'pandoc-2.5-macOS.zip';
    pandocFilter = file => path.dirname(file.path) === 'pandoc-2.5/bin';
    pandocMap = (file) => {
      file.path = path.basename(file.path);
      return file;
    };
    break;
  case 'linux':
    pandocFile = 'pandoc-2.5-linux.tar.gz';
    pandocFilter = file => path.dirname(file.path) === 'pandoc-2.5/bin';
    pandocMap = (file) => {
      file.path = path.basename(file.path);
      return file;
    };
    break;
  case 'win32':
    pandocFile = 'pandoc-2.5-windows-x86_64.zip';
    pandocFilter = file => path.extname(file.path) === '.exe';
    break;
  default:
}

download(
  pandocBaseUrl + pandocFile,
  'bin/pandoc',
  {
    extract: true,
    filter: pandocFilter,
    map: pandocMap
  }
);

// get crossref binaries
// -------------------------------------------------------

const crossrefBaseUrl =
  'https://github.com/lierdakil/pandoc-crossref/releases/download/v0.3.4.0a/';

let crossrefFile;
let crossrefFilter = file => true;
let crossrefMap = file => file;

switch (process.platform) {
  case 'darwin':
    crossrefFile = 'osx-ghc86-pandoc25.tar.gz';
    crossrefFilter = file => path.extname(file.path) !== '.1';
    break;
  case 'linux':
    crossrefFile = 'linux-ghc84-pandoc25-static.tar.gz';
    break;
  case 'win32':
    crossrefFile = 'windows-x86_64-pandoc_2.5.zip';
    break;
  default:
}

download(
  crossrefBaseUrl + crossrefFile,
  'bin/crossref',
  {
    extract: true,
    filter: crossrefFilter,
    map: crossrefMap
  }
);
