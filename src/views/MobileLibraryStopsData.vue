<template>
  <div>
    <custom-header
      title="Mobile library stops"
      subtitle="Locations of mobile library stops, and their frequency"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-alert color="primary" text type="info">
          For full guidance see the
          <a href="https://schema.librarydata.uk/mobile-library-stops" target="_blank"
            >Mobile library stops dataset schema</a
          >
        </v-alert>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/membershipdata.md";

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
