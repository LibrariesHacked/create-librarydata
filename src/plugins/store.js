import { createStore } from 'vuex'

import * as jose from 'jose';

export default createStore({
  state: {
    // Logged in user data
    loginKey: null,
    loginSubject: null,
    loginIssuer: null,
    loginExpires: null,
    loginAdmin: false,
    loginCodes: [],
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
        state.loginCodes = claims.codes;
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
      state.loginCodes = claims.codes;
    },
    logout(state) {
      localStorage.removeItem('loginKey');
      state.loginKey = null;
      state.loginSubject = null;
      state.loginIssuer = null;
      state.loginExpires = null;
      state.loginAdmin = null;
      state.loginCodes = [];
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
