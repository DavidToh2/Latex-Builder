# Introduction

This document serves to describe how the documentation subsite is set up using **Vitepress**.

- [Introduction](#introduction)
- [Vitepress](#vitepress)
- [Site Config](#site-config)
- [Theme Customisation](#theme-customisation)
  - [Layouts](#layouts)
  - [Components](#components)

# Vitepress

Vitepress is a static site generator with a default theme purpose-built for documentation sites. Site pages are written in Markdown, and converted to HTML using `markdown-it`. Routing is done by file hierarchy. Its default theme also provides us with nice-looking stylings.

We'll store everything in `/vue-frontend/docs`.

- The root file is `index.md`, and site directories are stored in folders. For us, these are the folders `development`, `production`, `server` and `vue-frontend`.
- All config files are stored in `.vitepress`, including the very important `config.mts` which contains Vitepress' global settings.
- Theme customisations can be stored in `.vitepress/theme`.
- When the dev server is running, cache files are stored in `.vitepress/cache`.
- The site will be built to `.vitepress/dist`.te will be built to `.vitepress/dist`.

# Site Config



We'll need to transfer our documentation folders over to `vue-frontend`, then format the folders and filenames in the correct manner 

# Theme Customisation

## Layouts

## Components
