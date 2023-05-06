<template>
  <v-container>
    <layout-header title="Membership" subtitle="Snapshot counts of library membership by geographic area" />
    <p class="text-center">
      <v-btn size="large" variant="tonal" color="info" href="https://schema.librarydata.uk/membership" target="_blank">
        Explore the membership data schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

  </v-container>
</template>

<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/membershipdata.md";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {
    "layout-header": Header,
    "markdown-section": Markdown
  }
};
</script>
<style scoped></style>
