# pandemic
CLI tool for the smart scientist

## Install

```
npm install -g  git+ssh://git@github.sf.mpg.de:lrigoux/pandemic.git
```

> Note that you need to have a proper ssh authorization to login to github.sf.mpg.de for this to work

## Usage

## Basics

```
# Find a cosy place
cd my-new-project

# Create boilerplate, eg. for a new paper:
pandemic scaffold manuscript

# Convert to publication ready document
pandemic publish

# Get some info to go further
pandemic help
pandemic help <command>
```

## Recipes

You can try to install templates directly from user contributed repos.
Pandemic will look for `recipe.<format>.json` instruction file, but will otherwise try to guess which files can serve as a template.

```
pandemic resource install recipe --as eisvogel https://github.com/Wandmalfarbe/pandoc-latex-template
```

You can then compile your manuscript using:

```
pandemic publish --to eisvogel
```


## Mindset

Less is more:
- content, only the content, is stored in the project
- all the templates and processing scripts are manage by pandemic, out of sight

Convention over configuration:
- scaffolding creates a canonical structure
- publishing relies on this structure to keep configuration to the strict minimum

Agile:
- easy to update with npm
- customizable with homemade templates


## Roadmap

- [x] propose publishing templates
- [x] include pandoc filters in the publishing pipeline
- [x] possibility to add custom scaffolds and publishing recipes from git
- [ ] extract the logic so pandemic could be used as a module and not only as a CLI.
- [ ] add pandoc binaries as dependencies (like in [pandoc-bin](https://github.com/toshgoodson/pandoc-bin))
- [ ] option to extract images
- [ ] provide tools to process revisions and suggestions (diff display, selective merge, etc.), maybe, one day

## Requirements

### Node & npm

The best way to do this is to use [nvm](https://github.com/creationix/nvm).

**TL;DR:**

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source ~/.bashrc
nvm install v8.9.4
```

### pandoc

Go to the [Pandoc website](https://github.com/jgm/pandoc/releases), download the installer for your system, run the installer.

> Future versions of Pandemic will include pandoc binaries to avoid compatibility issues.

You will also need to install the following pandoc filters

- [pandoc-fignos](https://github.com/tomduck/pandoc-fignos)
- [pandoc-eqnos](https://github.com/tomduck/pandoc-eqnos)
- [pandoc-tablenos](https://github.com/tomduck/pandoc-tablenos)

### LaTeX

This is needed to compile documents to pdf. See [here](https://www.latex-project.org/get/) to get the binaries.

### git

Well, I hope you already have this one installed!

## Copyright
Dr. Lionel Rigoux, lionel.rigoux@sf.mpg.de (C) 2017 Max Planck Institute for Metabolism Research, Cologne
