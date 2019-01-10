---
layout: content
title: Install
permalink: /install/
---

Pandemic comes in different versions which can be installed independently.
Whichever solution you chose, you will need to have [Pandoc](https://github.com/jgm/pandoc/releases) (v2.1.1 or above) and [LaTeX](https://www.latex-project.org/get/) installed on your system.

**Command line tool**

The pandemic Command Line Interface can be installed via the [Node Package Manager](https://www.npmjs.com/get-npm):

```sh
# install Pandemic for command line use
npm install --global pandemic
```

**Atom plugin**

Alternatively, you can use Pandemic directly in [Atom](https://atom.io/) using the dedicated [Pandemic plugin](https://atom.io/packages/pandemic). Install the plugin from the Atom preference pane, or use the Atom Package Manager:

```sh
# install Pandemic for Atom
apm install pandemic
```

You don't have to install the Pandemic CLI to use the Atom package. However, you cannot (yet) install new recipes or scaffolds via Atom: to do so, you will have to do it by hand or through the CLI.
