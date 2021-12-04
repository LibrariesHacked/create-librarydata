import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginKey: null
  },
  mutations: {
    login(state, key) {
      state.loginKey = key;
    }
  }
});
