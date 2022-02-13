import Vue from "vue";
import Router from "vue-router";

import Accessibility from "./views/Accessibility.vue";
import About from "./views/About.vue";
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
import Profile from "./views/Profile.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/about",
      name: "About",
      component: About
    },
    {
      path: "/events",
      name: "Events",
      component: EventsData
    },
    {
      path: "/libraries",
      name: "Libraries",
      component: LibrariesData
    },
    {
      path: "/loans",
      name: "Loans",
      component: LoansData
    },
    {
      path: "/membership",
      name: "Membership",
      component: MembershipData
    },
    {
      path: "/postcode-to-lsoa",
      name: "Membership postcode to LSOA",
      component: MembershipPostcodeToLsoa
    },
    {
      path: "/membership-map",
      name: "Membership map",
      component: MembershipMap
    },
    {
      path: "/mobile-library-stops",
      name: "Mobile library stops",
      component: MobileLibraryStopsData
    },
    {
      path: "/physical-visits",
      name: "Physical visits",
      component: PhysicalVisitsData
    },
    {
      path: "/stock-summary",
      name: "Stock summary",
      component: StockSummaryData
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: Privacy
    },
    {
      path: "/accessibility",
      name: "Accessibility",
      component: Accessibility
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    }
  ]
});
