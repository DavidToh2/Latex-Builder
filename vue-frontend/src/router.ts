import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DatabaseView from '@/views/DatabaseView.vue'
import BuildView from '@/views/BuildView.vue'
import ContributeView from '@/views/ContributeView.vue'
import DriveView from '@/views/DocumentView.vue'
import AccountView from '@/views/AccountView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'root',
			components: {
			}
		}
	]
})

export default router
