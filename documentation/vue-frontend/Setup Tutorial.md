# Introduction

This document is intended as a guide for people setting up Vue 3 for use as their front-end development framework.

- [Introduction](#introduction)
  - [What is Vue?](#what-is-vue)
- [Installation](#installation)
- [Project Structure](#project-structure)
  - [Top-level](#top-level)
  - [Views and the Vue Router](#views-and-the-vue-router)
  - [Single-file Component Structure](#single-file-component-structure)
  - [Child Components](#child-components)
- [Project Configuration](#project-configuration)
  - [Vite](#vite)
  - [Typescript](#typescript)
  - [Commands](#commands)
    - [Compile and Hot-Reload for Development](#compile-and-hot-reload-for-development)
    - [Type-Check, Compile and Minify for Production](#type-check-compile-and-minify-for-production)
    - [Lint with ESLint](#lint-with-eslint)

## What is Vue?

**Vue 3** is a Javascript framework for building user interfaces. Its main features are:
- **Single-file Components** which encapsulate logic (javascript), template (HTML) and style (CSS) in a single file;
- **Reactivity**, which allows for dynamic change of state across the entire DOM tree using dependency tracking.

The complete Vue guide can be found [here](https://vuejs.org/guide/essentials/application.html). We use the Composition API.

# Installation

We use **NodeJS**, a cross-platform runtime environment that can be used to create both server-side and frontend applications in Javascript.

1. Install Node
2. Install Vue
    - Execute `npm create vue@latest` to create a Vue project scaffold
    - Go through the options. Note that we use Typescript.

[Official installation tutorial](https://vuejs.org/guide/quick-start.html)

# Project Structure

## Top-level

Our entire webpage only has one HTML file - `index.html`, stored at the very top level of our project. This file contains the chunk of code
```html
    <body>
        <div id="app"></div>
        <script type="module" src="/src/main.ts"></script>
    </body>
```
which is where all the fun stuff begins.

The `main.ts` file is the top-level file of the entire project. In it, we must create our app, passing in our root component `App`, then mount it to the container DOM element:
```js
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.mount('#app')
```

## Views and the Vue Router

In Vue, every individual page is called a **View**, and these are stored under `/src/views`. 

The **Vue Router** allows us to map URLs to views using the `createRouter()` function, in `router.ts`:

```js
import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...
  ]
})
```

Each individual route must be formatted as shown below. Here, `username` is a parameter:

```js
// Route with single view
import HomeView from "./views/HomeView.vue"
import ProfileView from "./views/ProfileView.vue"
{ path: '/', name: 'root', component: HomeView }
{ path: '/profile/:username', name: 'profile', component: ProfileView}
```

We should then use `<RouterView />` in our component files to render the component corresponding to the current route. (This doesn't have to be in `App.vue`, though it must be somewhere.)

We can also provide multiple components to each path, although this requires all of them to be named. These are called **named views**:

```js
// Route with multiple views
{ path: '/menu', name: 'menu', 
  components: {
    default: Home, c1: LeftSidebar, Footer
  }
}
```

We would then need to add `name` attributes to each of our `RouterView` objects. At most one of them can be un-named, and it will be assigned to the `default` component.
```vue
<RouterView name="c1" />
<RouterView />
<RouterView name="Footer" />
```

We should use `<RouterLink />` objects in our component files to navigate between different routes. These can specify their target routes verbatim, or using their names:

```vue
<RouterLink :to="/">Home</RouterLink>
<RouterLink :to="{name: 'profile', params: {username: 'David'}}">
    Profile
</RouterLink>
```

Don't forget to actually mount the router onto your app in `main.ts`:
```js
import router from "./router"
app.use(router)
```

**Note that our app does not use routers at all as we use a two-sided screen design.**

[Official Vue Router Guide](https://router.vuejs.org/guide/)

## Single-file Component Structure

Every SFC file, or `.vue` file, has three parts to it:
```vue
<script setup lang="ts">
    Javascript logic goes here.
</script>
<template>
    The DOM template goes here.
</template>
<style>
    CSS goes here.
</style>
```

## Child Components

Our root component, `App.vue`, is where we control which pages are being displayed. Rather than use routes, we programmatically navigate between views. Views, as well as components, handle child components in the same way.

Child components can be used in parent components simply by importing them in the setup script, and using them as DOM objects in the template.

```vue
<script setup lang="ts">
  import Navbar from './components/Navbar.vue'
</script>
<template>
  <Navbar />
</template>
```

We can also manipulate them programmatically using the `<component>` object:

```vue
<script setup lang="ts">
  views = {HomeView, DocsView, AccountView} as {[id: string] : Component}
  currentView = ref("HomeView")
</script>
<template>
  <component :is="views[currentView]"></component>
</template>
```

# Project Configuration

All the official documentation can be found [here](https://vuejs.org/guide/quick-start.html).

## Vite

**Vite** is Vue's default build tool. The [Vite Configuration Reference](https://vitejs.dev/config/) can be found here.

For convenience, the default `vite.config.ts` file comes with a *path alias* which we may use to refer to the *source code root* in all our codefiles:

```
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
```

All environment variables may be stored in your conventional `.env` file, but must be prefixed with a `VITE_` in front of their names. These environment variables must then be accessed with `import.meta.env`. For example,
```
VITE_URL_PRODUCTION=https://server.towelet.app
```
can be accessed with `import.meta.env.VITE_URL_PRODUCTION`.

I believe these environment variables are baked into your program on build. Hence, they should be treated as public from the very beginning.

(Note that all string environment variables SHOULD NOT have quotation marks!!!)

## Typescript

**Typescript** is a strongly-typed version of Javascript. We use it in our project, and so the very first thing to do is to specify `lang="ts"` in all our `<script setup >` statements.

The `tsconfig.json` file is stored in the root directory of our Typescript project.

The *include* parameter specifies an array of filenames to be included in the project. (Note the presence of the `.vue` files.)

```json
"include": ["env.d.ts", "src/router.ts", "src/**/*", "src/**/*.vue"],
```

Under *compilerOptions*, we may also specify *path aliases*, relative to the `baseUrl`, that apply to all `import` statements:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
        "@/*": ["./src/*"]
    },
    "types": ["node"]
},
```
(Note that any path aliases have to be specified in both the Vite and TS config files, as detailed in [this link](https://dev.to/tilly/aliasing-in-vite-w-typescript-1lfo).)

The *types* parameter above is more complicated and I don't really get it either. [Full explanation here](https://stackoverflow.com/questions/39826848/typescript-2-0-types-field-in-tsconfig-json)

## Commands

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
