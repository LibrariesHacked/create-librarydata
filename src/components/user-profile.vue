<template>
  <v-card variant="tonal" color="info" max-width="350">
    <v-subheader v-if="this.$store.state.loginKey">Logged in. Session expires
      {{ this.$store.state.loginExpires.toLocaleString() }}</v-subheader>
    <v-divider />
    <v-card-text>
      <p v-if="!this.$store.state.loginKey">Not logged in</p>
      <p class="text-h5">
        {{ this.$store.state.loginSubject }}
      </p>
      <p v-if="this.$store.state.loginAdmin">
        <v-chip color="primary">
          <v-icon left> mdi-shield-crown-outline </v-icon>
          Admin
        </v-chip>
      </p>
      <v-chip class="mr-1" v-for="code in this.$store.state.loginCodes" :key="'chip_' + code">
        <v-icon left>mdi-map-legend</v-icon>
        {{
          library_services.length > 0
          ? library_services.filter((s) => s.code === code)[0].nice_name
          : code
        }}</v-chip>
    </v-card-text>
    <v-card-actions v-if="this.actions === true">
      <v-spacer></v-spacer>
      <v-btn v-if="this.$store.state.loginKey" large color="primary" text @click="logout">
        Log out
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-if="!this.$store.state.loginKey" large color="primary" text :to="'/login'">
        Log in
        <v-icon right>mdi-login</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const authoritiesHelper = require("../helpers/libraryAuthorities.js");

export default {
  props: ['actions'],
  data() {
    return {
    };
  },
  methods: {
    async getServices() {
      let services = await authoritiesHelper.getLibraryAuthorities();
      services = services.sort((a, b) => a.name.localeCompare(b.name));
      this.$store.commit("setServices", services);
      this.library_services = services;
    }
  },
  beforeMount() {
    this.getServices();
  }
};
</script>

<style scoped>
.footerLinks li {
  display: inline;
  margin-left: 5px;
  list-style-type: none;
}

.footerLinks li:not(:first-child):before {
  content: "• ";
}
</style>
