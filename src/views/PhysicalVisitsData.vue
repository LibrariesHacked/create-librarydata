<template>
  <div>
    <custom-header title="Physical visits" subtitle="Footfall of people into library premises" />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-alert color="primary" text type="info">
          For full guidance see the
          <a href="https://schema.librarydata.uk/physical-visits" target="_blank"
            >Physical visits dataset schema</a
          >
        </v-alert>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/physicalvisitsdata.md";

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
