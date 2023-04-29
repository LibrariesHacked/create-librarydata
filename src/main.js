import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import './styles/main.scss'

import * as components from 'vuetify/components'
import * as labs from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'

import router from './router'

import store from './plugins/store'

import App from './App.vue'

const vuetify = createVuetify({
  components: {
    ...components,
    ...labs
  },
  directives
})

createApp(App).use(vuetify).use(router).use(store).mount('#app')
