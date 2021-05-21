<template>
  <v-app>
    <v-app-bar app flat color="white" clipped-left>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click="drawer = !drawer" />
      <v-container>
        <v-toolbar-title>Create</v-toolbar-title>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list nav dense>
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
    drawer: true
  })
};
</script>
