<template>
  <v-container>
    <layout-header title="Profile" subtitle="See access and profile information" />
    <markdown-section :markdownText="mdText" />
    <section>
      <v-container>
        <user-profile />
      </v-container>
    </section>
  </v-container>
</template>
<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/profile.md";
import UserProfile from "../components/user-profile";

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
  components: { "layout-header": Header, "markdown-section": Markdown, "user-profile": UserProfile }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
