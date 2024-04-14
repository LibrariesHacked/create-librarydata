import { createRouter, createWebHashHistory } from 'vue-router'

import About from './views/about-page.vue'
import Accessibility from './views/accessibility-page.vue'
import EventsData from './views/events-data.vue'
import Home from './views/home-page.vue'
import LibrariesData from './views/libraries-data.vue'
import LibrariesDataEdit from './views/libraries-data-edit.vue'
import LoansData from './views/loans-data.vue'
import Login from './views/site-login.vue'
import MembershipData from './views/membership-data.vue'
import MembershipMap from './views/membership-map.vue'
import MembershipPostcodeToLsoa from './views/membership-postcode-to-lsoa.vue'
import MobileLibraryStopsData from './views/mobile-library-stops-data.vue'
import PhysicalVisitsData from './views/physical-visits-data.vue'
import Privacy from './views/privacy-page.vue'
import Profile from './views/site-profile.vue'
import StockSummaryData from './views/stock-summary-data.vue'

const router = createRouter({
  history: createWebHashHistory(),
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/events',
      name: 'Events',
      component: EventsData
    },
    {
      path: '/libraries',
      name: 'Libraries',
      component: LibrariesData
    },
    {
      path: '/libraries-edit',
      name: 'Libraries edit',
      component: LibrariesDataEdit
    },
    {
      path: '/loans',
      name: 'Loans',
      component: LoansData
    },
    {
      path: '/membership',
      name: 'Membership',
      component: MembershipData
    },
    {
      path: '/postcode-to-lsoa',
      name: 'Membership postcode to LSOA',
      component: MembershipPostcodeToLsoa
    },
    {
      path: '/membership-map',
      name: 'Membership map',
      component: MembershipMap
    },
    {
      path: '/mobile-library-stops',
      name: 'Mobile library stops',
      component: MobileLibraryStopsData
    },
    {
      path: '/physical-visits',
      name: 'Physical visits',
      component: PhysicalVisitsData
    },
    {
      path: '/stock-summary',
      name: 'Stock summary',
      component: StockSummaryData
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
      path: '/accessibility',
      name: 'Accessibility',
      component: Accessibility
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    }
  ]
})

export default router
