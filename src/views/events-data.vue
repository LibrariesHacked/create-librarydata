<template>
  <div>
    <layout-header title="Events" subtitle="Library event attendance and outcomes" />
    <section>
      <v-container>
        <p class="text-center">
          <v-btn variant="tonal" size="x-large" color="info" href="https://schema.librarydata.uk/events"
            target="_blank">
            Events data schema
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
import MarkDownData from "../markdown/eventsdata.md";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {
    "layout-header": Header, "markdown-section": Markdown
  }
};
</script>
<style scoped></style>
