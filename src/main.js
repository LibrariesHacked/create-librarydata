import { createApp } from 'vue'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import '@mdi/font/css/materialdesignicons.css'

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
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  components: {
    ...labs
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;'
    },
    VTabs: {
      style: 'text-transform: none;'
    }
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
