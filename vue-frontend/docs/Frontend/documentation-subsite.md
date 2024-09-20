# Introduction

This document serves to describe how the documentation subsite is set up.

- [Introduction](#introduction)
- [Vitepress](#vitepress)
- [Site Config](#site-config)
  - [Theme Customisation](#theme-customisation)
  - [Site Navigation](#site-navigation)
- [iframes and frame-ancestors](#iframes-and-frame-ancestors)
- [Commands](#commands)
  - [Compile and Hot-Reload for Development](#compile-and-hot-reload-for-development)
  - [Type-Check, Compile and Minify for Production](#type-check-compile-and-minify-for-production)

Note: other popular documentation static-site generators are: [Docusaurus](https://docusaurus.io/docs)

# Vitepress

Vitepress is a static site generator with a default theme purpose-built for documentation sites. Site pages are written in Markdown, and converted to HTML using `markdown-it`. **Routing is done by file hierarchy**. Its default theme also provides us with nice-looking stylings.

We'll store everything in `/vue-frontend/docs`.

- The root file is `index.md`, and site directories are stored in folders. For us, these are the folders `Development`, `Production`, `Server` and `Frontend`.
- All config files are stored in `.vitepress`, including the very important `config.mts` which contains Vitepress' global settings.
- Theme customisations can be stored in `.vitepress/theme`.
- When the dev server is running, cache files are stored in `.vitepress/cache`.
- The site will be built to `.vitepress/dist`.

# Site Config

We'll need to transfer our documentation folders over from `documentation` to `vue-frontend/docs`, then format the folders and filenames in the correct manner. This is implemented as a dev script; details can be found under the [Dev Scripts](../Development/dev-scripts.md) documentation.

The long and short of it is:
- Folders should be capitalised and consist of single words. The script will not touch them;
- File names should be capitalised and space-separated. The script will convert all file names to dash-delimited full lowercase.

Because the script does not process links within the files, so all links should be written in the final format (i.e. in the form `FolderName/file-name.md`.)

## Theme Customisation

Vitepress comes with a default theme and layout. We co-opt it for our individual documentation pages, but we don't want to use their flashy homepage, since our subsite is meant to be displayed as a "page" in our main site. Hence, we can define a `CustomHome.vue` component, then use it as our new homepage:

```js
// .vitepress/config.mts:
vite: {
  resolve: { alias: [{
          find: /^.*\/VPHome\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/CustomHome.vue', import.meta.url)
          )
    }]}
  }
```

We can also use custom CSS by modifying `index.ts` and simply importing our custom CSS file. This also allows us to override the inbuilt CSS definitions that come with the default theme, letting us customise the appearance of the default components:

```css
/* .vitepress/theme/custom.css: */
.vp-doc h1 .header-anchor {
    top: 24px;
}
```
## Site Navigation

The default VitePress doc-page layout has a navigation sidebar which we can use to navigate between pages. The sidebar accepts a JSON object that tells it what the site's hierarchy looks like. This is `docs-hierarchy.json` which we pass into the config file:

```js
import sb from 'docs-hierarchy.json'
themeConfig: {
  sidebar: sb,
  outline: {
    level: [1, 6]
  },
}
```

The JSON has to be formatted as such:

```json
[
  {"text": "HEADER-1",
  "items": [
    {"text": "SUBHEADER-1", "link": "LINK-1"},
    {"text": "SUBHEADER-2", "link": "LINK-2"}
  ]}, ...
]
```

The JSON file is programmatically generated using a dev script.

# iframes and frame-ancestors

The documentation subsite is embedded using an HTML `<iframe>` element within the main site's `DocsView.vue`. For the subsite to display properly, we need to set the following response header for the subsite to specify a list of parent URLS that can embed our subsite.
```http
Content-Security-Policy: frame-ancestors <sources>
```

Here, `<source>` should include `https://*.towelet.app/*` (since we want the subsite to be loadable from any derivation of the parent site).

To turn off subsite embedding, replace the stated URL with `none`.

(Note that there is also a `self` option to allow parent sites of the same origin. However, I don't think that is useful in this case since "same origin" refers to `docs.towelet.app`, i.e. doesn't apply to the root URL.)

A more detailed guide [here](https://content-security-policy.com/frame-ancestors/).

# Commands

Run all commands from `vue-frontend`.

## Compile and Hot-Reload for Development

```sh
npm run docs:dev
```

This runs the following command, which mounts the doc-site on `localhost:6174` and indicates that the root folder is `docs`:

```sh
vitepress dev --port 6174 docs
```

## Type-Check, Compile and Minify for Production

```sh
npm run docs:build
```