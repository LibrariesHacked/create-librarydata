<template>
  <v-container>
    <layout-header title="Stock summary" subtitle="Snapshot counts of library stock by item type" />
    <p class="text-center">
      <v-btn size="x-large" variant="tonal" color="info" href="https://schema.librarydata.uk/stock-summary"
        target="_blank">
        Stock summary data schema
      </v-btn>
    </p>
    <markdown-section :markdownText="mdText" />
  </v-container>
</template>

<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/stocksummarydata.md";

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
