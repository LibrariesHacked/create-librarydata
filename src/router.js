import Vue from "vue";
import Router from "vue-router";

// Our pages/views
import Home from "./views/Home.vue";
import LibrariesDataset from "./views/LibrariesDataset.vue";
import MembershipVisualisation from "./views/MembershipVisualisation.vue";
import PostcodeToLsoa from "./views/PostcodeToLsoa.vue";

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
      path: "/libraries",
      name: "libraries",
      component: LibrariesDataset
    },
    {
      path: "/membership-visualisation",
      name: "membership-visualisation",
      component: MembershipVisualisation
    }
  ]
});
