<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Popup from './components/Common/Popup/Popup.vue'

import HomeView from '@/views/HomeView.vue'
import DocsView from '@/views/DocsView.vue'

import ContributeView from '@/views/ContributeView.vue'
import DatabaseView from '@/views/DatabaseView.vue'
import BuildView from '@/views/BuildView.vue'
import DocumentView from '@/views/DocumentView.vue'
import LatexView from '@/views/LatexView.vue'
import AccountView from '@/views/AccountView.vue'

import { ref, computed, onMounted } from 'vue'
import type { Component } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useQuestionStore } from './stores/questionStore'
import { authGetUserInfo, isAuth } from '@/post/postAuth';

import type { userData } from '@/types/UserTypes'
import type { UserError, ServerError } from '@/types/ErrorTypes'
import { formatErrorMessage } from '@/types/ErrorTypes'

const UserStore = useUserStore()
const QuestionStore = useQuestionStore()

const currentLeftView = computed<string>(() => {return UserStore.getViewName('left')})
const currentRightView = computed<string>(() => {return UserStore.getViewName('right')})
const workspaceDisplayMode = ref(0) // 0 = none, 1 = left, 2 = right, or 3 = both sides

const leftViews = ["HomeView", "DocsView"]
const centerViews = ["ContributeView", "DatabaseView", "BuildView", "DocumentView", "DriveView", "LatexView"]
const rightViews = ["AccountView"]
const allViews = leftViews.concat(centerViews, rightViews)

interface activeViewDict { [key : string] : boolean }
const activeViews = computed<activeViewDict>(() => {
	const d : activeViewDict = {}
	for (var key in allViews) {
		if (key == currentLeftView.value || key == currentRightView.value) {
			d[key] = true
		} else {
			d[key] = false
		}
	}
	return d
})
const views = {
	HomeView,
	DocsView,

	ContributeView,
	DatabaseView,
	BuildView,
	DocumentView,
	LatexView,

	AccountView
} as {[id: string] : Component}

onMounted(async() => {
	if (await isAuth()) {
		UserStore.setAuthStatus(true)
		await populateUserInfo()
	} else {
		UserStore.clearUserData()
		UserStore.setAuthStatus(false)
	}
	if (centerViews.includes(currentLeftView.value)) { workspaceDisplayMode.value++ }
	if (centerViews.includes(currentRightView.value)) { workspaceDisplayMode.value+= 2 }
})

async function populateUserInfo() {
    if (await isAuth()) {
        const responsejson = await authGetUserInfo()
        if (responsejson.status == -1) {
            // Error occured
            const error = responsejson.error as ServerError
            const errormsg = formatErrorMessage(error)
            console.log(errormsg)
        } else if (responsejson.status == 1) {
            // Failure
            const error = responsejson.body as UserError
            const errorMsg = error.cause
            console.log(errorMsg)
        } else if (responsejson.status == 0) {
			// Success
            console.log("Setting user data...")
            const ud = responsejson.body as userData
            UserStore.setAuthStatus(true)
            UserStore.setUserData(ud)
            return true
        }
    }
}

UserStore.$onAction(
	({name, store, args, after, onError}) => {
		if (name == 'displayView') {
			// When view changes, update the new view
			after(async (result) => {
				if (result) {
					const newView = UserStore.getNewView()
					updateView(newView)
				}
			})
		}
		if (name == 'clearUserData') {
			// On logout, reset all views
			after((result) => {
				console.log("Clearing all views:")
				QuestionStore.resetBuild()
				QuestionStore.resetContribute()
				QuestionStore.resetDatabase()
			})
		}
		if (name == 'queueUserDataUpdate') {
			// If something happens in other views that requires a user data update,
			// this function will be triggered.
			after(async (result) => {
				await populateUserInfo()
			})
		}
		if ((name == 'openPopup') || (name == 'openBigPopup') || (name == 'closePopup')) {
			// Popup management
			after((result) => {
				const [pSize, pHTML] = UserStore.getPopupStatus()
				popupHTML.value = pHTML as string
				popupSize.value = pSize as number
			})
		}
	}
)

function updateView(newView : string) {

	// console.log(`Previous display mode: ${workspaceDisplayMode.value}`)

	// Opening AccountView: always open on right side
	// Apply right-out-in transition
	if (rightViews.includes(newView)) {
		if (centerViews.includes(currentRightView.value)) {
			workspaceDisplayMode.value -= 2
		}
		transitionType.value = 'right-out-in'
		UserStore.setRightView(newView)
	}

	// Opening HomeView or DocsView: always open on left side
	// Apply left-out-in transition
	if (leftViews.includes(newView)) {
		if (centerViews.includes(currentLeftView.value)) {
			workspaceDisplayMode.value -= 1
		}
		transitionType.value = 'left-out-in'
		UserStore.setLeftView(newView)
	}

	// Opening workspace view.
	if (centerViews.includes(newView)) {

		// If right side currently displaying AccountView,
		// open workspace view on right side.
		// Apply right-out-in transition
		if (workspaceDisplayMode.value <= 1) {
			transitionType.value = 'right-out-in'

			// If left side displaying docs, keep that
			if (workspaceDisplayMode.value == 0) {
				UserStore.setRightView(newView)
			// If left side is also workspace, then just open workspace on both sides
			} else if (workspaceDisplayMode.value == 1) {
				const i = centerViews.indexOf(newView)
				if (i == 0) {
					UserStore.setRightView(centerViews[1])
					UserStore.setLeftView(centerViews[0])
				} else {
					UserStore.setRightView(centerViews[i])
					UserStore.setLeftView(centerViews[i-1])
				}
			}

			workspaceDisplayMode.value += 2
		}

		// If left side displaying docs, and right side displaying workspace:
		else if (workspaceDisplayMode.value == 2) {
			
			// Enter double display mode
			if (currentRightView.value == newView) {
				workspaceDisplayMode.value = 3
				const i = centerViews.indexOf(currentRightView.value)
				if (i == 0) {
					// Apply right scroll transition to both sides
					transitionType.value = 'right-scroll'
					UserStore.setLeftView(centerViews[0])
					UserStore.setRightView(centerViews[1])
				} else {
					// Apply left-out-in transition
					transitionType.value = 'left-out-in'
					UserStore.setLeftView(centerViews[i-1])
				}
			// Switch workspace viewport
			} else {
				const i = centerViews.indexOf(currentRightView.value)
				const j = centerViews.indexOf(newView)
				if (j < i) {
					transitionType.value = 'left-scroll'
				} else if (j > i) {
					transitionType.value = 'right-scroll'
				}
				UserStore.setRightView(newView)
			}
		}

		// In double display mode
		else if (workspaceDisplayMode.value == 3) {
			const i = centerViews.indexOf(currentLeftView.value)
			const j = centerViews.indexOf(newView)
			if (j < i) {
				// Apply left scroll transition
				transitionType.value = 'left-scroll'
				UserStore.setLeftView(centerViews[j])
				UserStore.setRightView(centerViews[j+1])
			} else if (j > i+1) {
				// Apply right scroll transition
				transitionType.value = 'right-scroll'
				UserStore.setLeftView(centerViews[j-1])
				UserStore.setRightView(centerViews[j])
			}
		}
	}

	// console.log(`Current display mode: ${workspaceDisplayMode.value}`)
}

const transitionType = ref('left-out-in')
// left-out-in, right-out-in, left-scroll, right-scroll
const transitionMode = computed<"default" | "out-in" | "in-out">(() => {
	if (transitionType.value == 'left-out-in' || transitionType.value == 'right-out-in') {
		return 'out-in'
	} else if (transitionType.value == 'left-scroll' || transitionType.value == 'right-scroll') {
		return 'default'
	} else {
		return 'default'
	}
})

const popupHTML = ref('')
const popupSize = ref(0)
function closePopup() {
	UserStore.closePopup()
}

</script>

<template>

	<Navbar class="navbar" :active-views="activeViews" @update-view="updateView"/>

	<div class="container-main no-scrollbar" id="container-left">
		<Transition :name="transitionType" :mode="transitionMode">
			<KeepAlive>
				<component :is="views[currentLeftView]"></component>
			</KeepAlive>
		</Transition>
	</div>

	<div class="container-main no-scrollbar" id="container-right">
		<Transition :name="transitionType" :mode="transitionMode">
			<KeepAlive>
				<component :is="views[currentRightView]"></component>
			</KeepAlive>
		</Transition>
	</div>

	<Popup :size="popupSize" @close="closePopup">
		<span v-html="popupHTML"></span>
	</Popup>

</template>

<style scoped>

.navbar {
	grid-column: 1 / span 2;
	background-color: var(--colour-theme);
	width: 100%;
	height: 64px;
	padding-left: 10%;
	padding-right: 10%;
	
	display: grid;
	grid: auto / 25% 40% 25%;
	gap: 5%;
}

.container-main {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	width: 100%;
	height: calc(100vh - 64px);
	overflow-x: hidden;
	overflow-y: scroll;
}


#container-left {
	border-right: 0px solid #888888;
}

.left-out-in-enter-active, 
.left-out-in-leave-active,
.right-out-in-enter-active,
.right-out-in-leave-active {
  	transition: all 0.5s ease;
}

.left-out-in-enter-from,
.left-out-in-leave-to {
	transform: translateX(-50%);
	opacity: 0;
}

.right-out-in-enter-from,
.right-out-in-leave-to {
	transform: translateX(50%);
	opacity: 0;
}

.left-scroll-enter-active,
.left-scroll-leave-active,
.right-scroll-enter-active,
.right-scroll-leave-active {
	transition: all 0.5s ease;
}

.left-scroll-enter-from,
.right-scroll-leave-to {
	transform: translateX(-100%);
}
.right-scroll-enter-from,
.left-scroll-leave-to {
	transform: translateX(100%);
}

.left-scroll-enter-active,
.right-scroll-enter-active {
	transition-delay: 0s;
}

</style>
