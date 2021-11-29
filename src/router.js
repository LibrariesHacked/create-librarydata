import Vue from "vue";
import Router from "vue-router";

import Accessibility from "./views/Accessibility.vue";
import Home from "./views/Home.vue";
import EventsData from "./views/EventsData.vue";
import LibrariesData from "./views/LibrariesData.vue";
import LoansData from "./views/LoansData.vue";
import MembershipData from "./views/MembershipData.vue";
import MembershipMap from "./views/MembershipMap.vue";
import MembershipPostcodeToLsoa from "./views/MembershipPostcodeToLsoa.vue";
import MobileLibraryStopsData from "./views/MobileLibraryStopsData.vue";
import PhysicalVisitsData from "./views/PhysicalVisitsData.vue";
import StockSummaryData from "./views/StockSummaryData.vue";
import Privacy from "./views/Privacy.vue";
import Login from "./views/Login.vue";

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
      path: "/events",
      name: "events",
      component: EventsData
    },
    {
      path: "/libraries",
      name: "libraries",
      component: LibrariesData
    },
    {
      path: "/loans",
      name: "loans",
      component: LoansData
    },
    {
      path: "/membership",
      name: "membership",
      component: MembershipData
    },
    {
      path: "/postcode-to-lsoa",
      name: "postcode-to-lsoa",
      component: MembershipPostcodeToLsoa
    },
    {
      path: "/membership-map",
      name: "membership-map",
      component: MembershipMap
    },
    {
      path: "/mobile-library-stops",
      name: "mobile-library-stops",
      component: MobileLibraryStopsData
    },
    {
      path: "/physical-visits",
      name: "physical-visits",
      component: PhysicalVisitsData
    },
    {
      path: "/stock-summary",
      name: "stock-summary",
      component: StockSummaryData
    },
    {
      path: "/privacy",
      name: "privacy",
      component: Privacy
    },
    {
      path: "/accessibility",
      name: "accessibility",
      component: Accessibility
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});
