import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { RegleVuePlugin } from '@regle/core'
import './styles/main.scss'
import './styles/reset.scss'
import AppButton from './components/globals/AppButton.vue'
import AppIcons from './components/globals/AppIcons.vue'
import AppInput from './components/globals/AppInput.vue'
import AppDropdown from './components/globals/AppDropdown.vue'
import AppModals from './components/globals/AppModals.vue'
import AppComponent from './components/globals/AppComponent.vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(RegleVuePlugin)

app.component('AppButton', AppButton)
app.component('AppIcons', AppIcons)
app.component('AppInput', AppInput)
app.component('AppDropdown', AppDropdown)
app.component('AppModals', AppModals)
app.component('AppComponent', AppComponent)

app.mount('#app')
