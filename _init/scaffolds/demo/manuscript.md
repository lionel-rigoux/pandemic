---
title: 'A Pandemic document'
author: 'John Doe'
---

# Introduction

Pandemic is a software that helps you publish high quality documents. With a clear separation between content and style, you can focus on the content and change the output style and format in a blink.

## Figures

![**The Pandemic logo**](figures/pandemic.jpg){#fig:pandemic-logo width=100%}

See figure @fig:pandemic-logo.

## Citations

You can cite an article described in `bibliography.bib` simply by referencing the citekey, for example a wonderful book about the theory of evolution [@darwin1859].

## Equations

You can write equations between `$$` `$$` and using the LaTeX syntax.

$$ \beta = 3 $${#eq:beta-definition}

See equation @eq:beta-definition.

## Mustache

Values between $\{\{$  $\}\}$ will be replaced by the content of the `results.json` file.

There was an effect ($\beta$ = {{ experiment_1.beta }}, p-value = {{ experiment_1.p-value }} ).

# References

<!-- the list of references will automatically be inserted here -->
