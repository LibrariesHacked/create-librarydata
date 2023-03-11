<template>
  <div>
    <layout-header
      title="Mobile library stops"
      subtitle="Locations of mobile library stops, and their frequency"
    />
    <section>
      <v-container>
        <vue-markdown :source="mdText"></vue-markdown>
        <p class="text-center">
          <v-btn
            depressed
            color="primary"
            href="https://schema.librarydata.uk/mobile-library-stops"
            target="_blank"
          >
            Mobile libraries data schema
          </v-btn>
        </p>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/layout-header";
import MarkDownData from "../markdown/membershipdata.md";
import VueMarkdown from "vue-markdown-render";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {
    "layout-header": Header,
    VueMarkdown
  }
};
</script>
<style scoped>
</style>
