import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import VueMaplibreGl from 'vue-maplibre-gl'
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
  .mount('#app')
