import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Convert from "./views/Convert.vue";
import Schemas from "./views/Schemas.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/schemas",
      name: "schemas",
      component: Schemas
    },
    {
      path: "/convert",
      name: "convert",
      component: Convert
    }
  ]
});
