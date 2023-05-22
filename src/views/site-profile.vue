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

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  },
  components: { "layout-header": Header, "markdown-section": Markdown }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
