import { defineConfig } from 'vitepress'
import sb from '../docs-hierarchy.json'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Documentation for Latex Builder",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: false,

    sidebar: sb,
    outline: {
      level: [1, 6]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPHome\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/CustomHome.vue', import.meta.url)
          )
        }
      ]
    }
  }
})
