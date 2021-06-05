<template>
  <v-app>
    <v-app-bar app dense flat color="green" dark clipped-left>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer" />
      <v-container>
        <v-toolbar-title>Create</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Library data tools
          </v-list-item-title>
          <v-list-item-subtitle>
            Building and analysing library data
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense rounded>
        <v-list-item-group color="indigo">
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
        <v-list-group :value="false" no-action prepend-icon="mdi-account-circle">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Libraries</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/library-locations'"
            active-class="highlighted"
            :class="'/library-locations' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Library locations</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" no-action prepend-icon="mdi-account-circle">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Membership</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="'/postcode-to-lsoa'"
            active-class="highlighted"
            :class="'/postcode-to-lsoa' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Postcode converter</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="'/membership-map'"
            active-class="highlighted"
            :class="'/membership-map' === $route.path ? 'highlighted' : ''"
          >
            <v-list-item-title>Membership map</v-list-item-title>
          </v-list-item>
        </v-list-group>
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

<script>
import Footer from "./components/Footer";

export default {
  name: "App",

  components: {
    "custom-footer": Footer
  },

  data: () => ({
    drawer: null
  })
};
</script>
