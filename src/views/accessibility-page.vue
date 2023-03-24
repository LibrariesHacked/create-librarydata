<template>
  <div>
    <layout-header title="Accessibility" subtitle="How this site meets accessibility requirements" />
    <markdown-section :markdownText="mdText" />
  </div>
</template>
<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/accessibility.md";

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
