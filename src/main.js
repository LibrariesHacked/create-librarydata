import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./plugins/store";
import CarbonBadge from 'vue-carbonbadge'
Vue.use(CarbonBadge)

Vue.config.productionTip = false;

new Vue({
  store,
  beforeCreate() { this.$store.commit('initialiseStore') },
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
