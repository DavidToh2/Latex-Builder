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
