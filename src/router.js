import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import PostcodeToLsoa from "./views/PostcodeToLsoa.vue";
import DateFormat from "./views/DateFormat.vue";

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
      path: "/postcode-to-lsoa",
      name: "postcode-to-lsoa",
      component: PostcodeToLsoa
    },
    {
      path: "/date-format",
      name: "date-format",
      components: DateFormat
    }
  ]
});
