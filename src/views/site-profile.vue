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
  components: {}
};
</script>