import Vue from 'vue';
import Vuex from 'vuex';

import * as jose from 'jose';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // Logged in user data
    loginKey: null,
    loginSubject: null,
    loginIssuer: null,
    loginExpires: null,
    loginAdmin: false,
    // Library service lookups
    library_services: []
  },
  mutations: {
    initialiseStore(state) {
      if (localStorage.getItem('loginKey')) {
        state.loginKey = localStorage.getItem('loginKey');
        const claims = jose.decodeJwt(state.loginKey);
        state.loginSubject = claims.sub;
        state.loginIssuer = claims.iss;
        state.loginExpires = new Date(claims.exp * 1000);
        state.loginAdmin = claims.admin;
      }
    },
    setLoginKey(state, key) {
      localStorage.setItem('loginKey', key);
      state.loginKey = key;
      const claims = jose.decodeJwt(state.loginKey);
      state.loginSubject = claims.sub;
      state.loginIssuer = claims.iss;
      state.loginExpires = new Date(claims.exp * 1000);
      state.loginAdmin = claims.admin;
    },
    logout(state) {
      localStorage.removeItem('loginKey');
      state.loginKey = null;
      state.loginSubject = null;
      state.loginIssuer = null;
      state.loginExpires = null;
      state.loginAdmin = null;
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