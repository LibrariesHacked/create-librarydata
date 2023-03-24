<template>
  <div>
    <layout-header title="Privacy policy" subtitle="How your data and privacy is protected" />
    <section>
      <v-container>
        <markdown-section :markdownText="mdText" />
      </v-container>
    </section>
  </div>
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
