<template>
  <v-container>
    <layout-header title="Loans" subtitle="Lending of library items" />
    <p class="text-center">
      <v-btn size="large" variant="tonal" color="info" href="https://schema.librarydata.uk/loans" target="_blank">
        Explore the loans data schema
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
