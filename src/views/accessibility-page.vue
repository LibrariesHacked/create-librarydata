<template>
  <v-container>
    <layout-header title="Accessibility" subtitle="How this site meets accessibility requirements" />
    <markdown-section :markdownText="mdText" />
  </v-container>
</template>
<script>
import MarkDownData from "../markdown/accessibility.md";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {}
};
</script>
