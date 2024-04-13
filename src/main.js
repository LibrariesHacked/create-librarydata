import { createApp } from 'vue'
import { createVuetify } from 'vuetify'

import VueMaplibreGl from 'vue-maplibre-gl'

import './styles/main.scss'

import * as labs from 'vuetify/labs/components'

import Header from './components/Header.vue'
import Markdown from './components/Markdown.vue'
import UserProfile from './components/UserProfile.vue'

import router from './router'

import store from './plugins/store'

import App from './App.vue'

const vuetify = createVuetify({
  components: {
    ...labs
  }
})

createApp({
  extends: App,
  beforeCreate () {
    this.$store.commit('initialiseStore')
  }
})
  .use(vuetify)
  .use(router)
  .use(store)
  .use(VueMaplibreGl)
  .component('layout-header', Header)
  .component('markdown-section', Markdown)
  .component('user-profile', UserProfile)
  .mount('#app')
