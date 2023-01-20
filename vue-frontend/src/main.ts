import { createApp } from 'vue'
import { createPinia } from 'pinia'     // Allows creation and use of Stores, which are global variables. Currently unused.
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
