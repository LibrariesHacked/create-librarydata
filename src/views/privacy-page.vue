<template>
  <v-container>
    <layout-header title="Privacy policy" subtitle="How your data and privacy is protected" />
    <markdown-section :markdownText="mdText" />
  </v-container>
</template>
<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/privacy.md";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: { "layout-header": Header, "markdown-section": Markdown }
};
</script>

<style scoped></style>
