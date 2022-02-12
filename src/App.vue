<template>
  <v-app>
    <v-app-bar app flat outlined clipped-left>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer" />
      <v-container>
        <img class="mr-3" :src="require('./assets/logo.png')" height="40" />
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped hide-overlay class="elevation-0">
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item
            :to="'/'"
            active-class="highlighted"
            :class="'/' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-calendar-star">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Events</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/events'"
            active-class="highlighted"
            :class="'/events' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Events dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-domain">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Libraries</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/libraries'"
            active-class="highlighted"
            :class="'/libraries' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Libraries dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-book-account-outline ">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Loans</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/loans'"
            active-class="highlighted"
            :class="'/loans' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Loans dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-account-multiple">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Membership</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/membership'"
            active-class="highlighted"
            :class="'/membership' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Membership dataset</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="'/postcode-to-lsoa'"
            active-class="highlighted"
            :class="'/postcode-to-lsoa' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Postcode converter tool</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="'/membership-map'"
            active-class="highlighted"
            :class="'/membership-map' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Membership map</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-bus-clock">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Mobile libraries</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/mobile-library-stops'"
            active-class="highlighted"
            :class="'/mobile-library-stops' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Mobile library stops dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-shoe-print">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Visits</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/physical-visits'"
            active-class="highlighted"
            :class="'/physical-visits' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Physical visits dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-bookshelf">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Catalogue</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/stock-summary'"
            active-class="highlighted"
            :class="'/stock-summary' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Stock summary dataset</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-item
          v-if="!this.$store.state.loginKey"
          :to="'/login'"
          active-class="highlighted"
          :class="'/login' === $route.path ? 'highlighted' : ''"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Log in</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="this.$store.state.loginKey" @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="this.$store.state.loginKey"
          :to="'/profile'"
          active-class="highlighted"
          :class="'/profile' === $route.path ? 'highlighted' : ''"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app>
      <custom-footer />
    </v-footer>
  </v-app>
</template>
<style lang="scss">
.v-btn,
.v-tab {
  text-transform: none !important;
}
.v-text-field--outlined >>> fieldset {
  border-color: #e5e5e5;
}
</style>

<script>
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    "custom-footer": Footer
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  },
  data: () => ({
    drawer: null
  })
};
</script>
