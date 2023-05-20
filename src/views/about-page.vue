<template>
  <v-container>
    <layout-header title="About" subtitle="What the site is and does, and who for" />
    <markdown-section :markdownText="mdText" />
  </v-container>
</template>
<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/about.md";

export default {
  data() {
    return {
      mdText: MarkDownData,
      options: { html: true, breaks: true }
    };
  },
  methods: {},
  components: { "layout-header": Header, "markdown-section": Markdown }
};
</script>
