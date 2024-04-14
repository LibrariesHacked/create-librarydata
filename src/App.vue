<template>
  <v-app>
    <v-app-bar elevation="0" flat color="grey-lighten-5">
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer" />
      <v-container>
        <img class="mr-3" src="/assets/logo.png" height="40" />
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer border v-model="drawer" elevation="0">
      <v-list nav>
        <v-list-item
          color="info"
          :to="'/'"
          active-class="highlighted"
          :class="'/' === $route.path ? 'highlighted' : ''"
          prepend-icon="mdi-home-circle"
        >
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item
          color="info"
          :to="'/about'"
          active-class="highlighted"
          :class="'/about' === $route.path ? 'highlighted' : ''"
          prepend-icon="mdi-information"
        >
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-group value="Events" no-action prepend-icon="mdi-calendar-star">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Events"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/events'"
            active-class="highlighted"
            :class="'/events' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Events dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="Libraries" no-action prepend-icon="mdi-domain">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Libraries"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/libraries'"
            active-class="highlighted"
            :class="'/libraries' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Libraries dataset</v-list-item-title>
          </v-list-item>
          <v-list-item
            color="success"
            :to="'/libraries-edit'"
            active-class="highlighted"
            :class="'/libraries' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Edit libraries</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="Loans" prepend-icon="mdi-book-account-outline">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Loans"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/loans'"
            active-class="highlighted"
            :class="'/loans' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Loans dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="Membership" prepend-icon="mdi-account-multiple">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Membership"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/membership'"
            active-class="highlighted"
            :class="'/membership' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Membership dataset</v-list-item-title>
          </v-list-item>
          <v-list-item
            color="success"
            :to="'/postcode-to-lsoa'"
            active-class="highlighted"
            :class="'/postcode-to-lsoa' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Postcode converter</v-list-item-title>
          </v-list-item>
          <v-list-item
            color="success"
            :to="'/membership-map'"
            active-class="highlighted"
            :class="'/membership-map' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Membership map</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="MobileLibraries" prepend-icon="mdi-bus-clock">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Mobile libraries"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/mobile-library-stops'"
            active-class="highlighted"
            :class="
              '/mobile-library-stops' === $route.path ? 'highlighted' : ''
            "
          >
            <v-list-item-title>Mobile library stops dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="Visits" prepend-icon="mdi-shoe-print">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Visits"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/physical-visits'"
            active-class="highlighted"
            :class="'/physical-visits' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Physical visits dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="Catalogue" prepend-icon="mdi-bookshelf">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Catalogue"></v-list-item>
          </template>
          <v-list-item
            color="success"
            :to="'/stock-summary'"
            active-class="highlighted"
            :class="'/stock-summary' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Stock summary dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-card>
          <v-card-text>
            <user-profile :actions="true" />
          </v-card-text>
        </v-card>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>

    <layout-footer />
  </v-app>
</template>
<style lang="scss">
.v-btn,
.v-tab {
  text-transform: none !important;
}
</style>

<script>
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    'layout-footer': Footer
  },
  methods: {
    async logout () {
      await this.$store.dispatch('logout')
      this.$router.push('/')
    }
  },
  data: () => ({
    drawer: null
  })
}
</script>
