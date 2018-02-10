# pandemic

> Simplified academic writing using pandoc.

Pandoc is a great tool for academic writing.
Pandemic is a suite of command line tools based on pandoc to help you automatize
 your writing pipeline so you can focus on the content:

- start a project in an eyeblink with your favourite boilerplate
- format and export your manuscript using a clean template
- manage and share templates with other users


## Install

```
npm install -g  pandemic
```

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

## Recipes and scaffolding templates

You can try to install templates (for scaffolding or for pandoc publishing) directly from user contributed repos.
Pandemic will look for `recipe.<format>.json` instruction file (see below), but will otherwise try to guess which files can serve as a template.

```
pandemic resource install recipe --as eisvogel https://github.com/Wandmalfarbe/pandoc-latex-template
```

You can then compile your manuscript using:

```
pandemic publish --to eisvogel
```

### Recipe instruction

You can override the default behavior of pandemic and explicitly defines how your template should be compiled.
You just have to include a file `recipe.<format>.json`, eg.:

`recipe.pdf.json`
```
{
  "template": "path/to/template.tex",
  "options": "-V aPandocVariable='value'",
  "filters": [
    "my-pandoc-filter",
  ]
}
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

## Roadmap

- [x] propose publishing templates
- [x] include pandoc filters in the publishing pipeline
- [x] possibility to add custom scaffolds and publishing recipes from git
- [ ] add possibility in recipes for pre and post publishing hooks
- [ ] automated image management to facilitate publication (extraction, reformating, isolated legends, etc)
- [ ] provide tools to process revisions and suggestions (diff display, selective merge, etc.)?
- [ ] add pandoc binaries as dependencies (like in [pandoc-bin](https://github.com/toshgoodson/pandoc-bin))

## Copyright
Lionel Rigoux, lionel.rigoux@gmail.com (C) 2018
