import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginKey: null,
    library_services: []
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('loginKey')) state.loginKey = localStorage.getItem('loginKey');
    },
    setLoginKey(state, key) {
      localStorage.setItem('loginKey', key);
      state.loginKey = key;
    },
    logout(state) {
      localStorage.removeItem('loginKey');
      state.loginKey = null;
    },
    setServices(state, library_services) {
      state.library_services = library_services;
    }
  },
  actions: {
    logout({ commit }) {
      commit('logout');
    }
  }
});

export default store;