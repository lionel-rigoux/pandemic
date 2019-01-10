---
layout: content
title: Scaffolding
permalink: /scaffolding/
---

Scaffolding allows you to create a set of files and folders that can serve as a starting point for a new project. Scaffolding is a good way to enforce structural consistency across projects. It can also help you save a lot of time by avoiding repeated copy/pasting from previous projects in the initial setup.

```bash
pandemic scaffold <scaffoldName>
```

Pandemic includes by default one scaffold, `manuscript` so you can try right away:


```bash
pandemic scaffold manuscript
```

# Managing scaffolds

A scaffold is simply a folder containing all the arborescence of files to be copied when calling the pandemic scaffold command. Scaffolding will simply copy all the files from the scaffold in the current directory.

- To see the available scaffolds:

```bash
pandemic resource list scaffolds
```

- Install a new scaffold

```bash
pandemic resource install scaffold [--as <scaffoldName>] <scaffoldURL>
```

Where scaffoldURL is any git repository. By default, the new scaffold name will be the same as the name of the repo. You can override this behavior and specify a custom name using `--as <scaffoldName>`.

- Note that if the remote repo is updated, you can update your local copy:

```bash
pandemic resource update scaffold <scaffoldName>
```

- You can also remove an unused scaffold:

```bash
pandemic resource remove scaffold <template>
```
