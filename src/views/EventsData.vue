<template>
  <div>
    <custom-header title="Events" subtitle="Event attendance and outcomes" />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-alert color="primary" text type="info">
          For full guidance see the
          <a href="https://schema.librarydata.uk/events" target="_blank"
            >Events dataset schema</a
          >
        </v-alert>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/eventsdata.md";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {
    "custom-header": Header
  }
};
</script>
<style scoped>
</style>
