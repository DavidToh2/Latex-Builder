import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DatabaseView from '@/views/DatabaseView.vue'
import BuildView from '@/views/BuildView.vue'
import ContributeView from '@/views/ContributeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        left: HomeView,
        right: DatabaseView
      }
    },
    {
      path: '/build',
      name: 'build',
      components: {
        left: DatabaseView,
        right: BuildView
      }
    },
    {
      path: '/contribute',
      name: 'contribute',
      components: {
        left: DatabaseView,
        right: ContributeView
      }
    }
  ]
})

export default router
