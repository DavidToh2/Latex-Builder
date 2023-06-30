import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DatabaseView from '@/views/DatabaseView.vue'
import BuildView from '@/views/BuildView.vue'
import ContributeView from '@/views/ContributeView.vue'
import DriveView from '@/views/DocumentView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			components: {
				left: HomeView,
				right: LoginView
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
		},
		{
			path: '/drive',
			name: 'drive',
			components: {
				left: DriveView,
				right: BuildView
			}
		}
	]
})

import { isAuth, authGetUserInfo } from '@/post/postAuth'
import { useUserStore } from '@/stores/userStore'

router.beforeEach(async (to, from) => {

	const userStore = useUserStore()
	if (await isAuth()) {
		console.log("User authenticated")
		userStore.setAuthStatus(true)
		if (!userStore.getUserDataStatus()) {
			const d = await authGetUserInfo()
			userStore.setUserData(d)
		}
	} else {
		console.log("User not authenticated")
		userStore.setAuthStatus(false)
	}
	return true
})

export default router
