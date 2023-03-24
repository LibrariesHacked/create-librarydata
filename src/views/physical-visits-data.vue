<template>
  <div>
    <layout-header title="Physical visits" subtitle="Counts of people using libraries" />
    <section>
      <v-container>
        <p class="text-center">
          <v-btn size="x-large" variant="tonal" color="info" href="https://schema.librarydata.uk/physical-visits"
            target="_blank">
            Physical visits data schema
          </v-btn>
        </p>
        <markdown-section :markdownText="mdText" />
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/physicalvisitsdata.md";

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
