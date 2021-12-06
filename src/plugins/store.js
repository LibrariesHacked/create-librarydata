import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginKey: null
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('loginKey')) state.loginKey = localStorage.getItem('loginKey');
    },
    setLoginKey(state, key) {
      localStorage.setItem('loginKey', key);
      state.loginKey = key;
    }
  }
});

export default store;