<template>
  <v-container>
    <layout-header title="Events" subtitle="Library event attendance and outcomes" />
    <p class="text-center">
      <v-btn variant="tonal" size="large" color="info" href="https://schema.librarydata.uk/events" target="_blank">
        Explore the events data schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

  </v-container>
</template>

<script>
import MarkDownData from "../markdown/eventsdata.md";

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
