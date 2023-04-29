<template>
  <v-container>
    <layout-header title="Mobile library stops" subtitle="Locations of mobile library stops, and their frequency" />
    <p class="text-center">
      <v-btn size="x-large" variant="tonal" color="info" href="https://schema.librarydata.uk/mobile-library-stops"
        target="_blank">
        Mobile libraries data schema
      </v-btn>
    </p>
    <markdown-section :markdownText="mdText" />
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
