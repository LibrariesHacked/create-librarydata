<template>
  <div>
    <layout-header title="Profile" subtitle="See access and profile information" />
    <section>
      <v-container>
        <markdown-section :markdownText="mdText" />
      </v-container>
    </section>
    <section>
      <v-container>
        <v-card outlined max-width="350" class="mx-auto">
          <v-subheader v-if="this.$store.state.loginKey">Logged in. Session expires
            {{ this.$store.state.loginExpires.toLocaleString() }}</v-subheader>
          <v-divider />
          <v-card-text>
            <v-subheader v-if="!this.$store.state.loginKey">Not logged in</v-subheader>
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
          <v-card-actions v-if="!success">
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
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/profile.md";

const authoritiesHelper = require("../helpers/libraryAuthorities.js");

export default {
  data() {
    return {
      mdText: MarkDownData,
      subject: "",
      expires: "",
      admin: false,
      library_services: []
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    async getServices() {
      let services = await authoritiesHelper.getLibraryAuthorities();
      services = services.sort((a, b) => a.name.localeCompare(b.name));
      this.$store.commit("setServices", services);
      this.library_services = services;
    }
  },
  beforeMount() {
    this.getServices();
  },
  components: { "layout-header": Header, "markdown-section": Markdown }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
