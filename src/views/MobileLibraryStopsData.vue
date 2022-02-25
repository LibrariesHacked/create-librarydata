<template>
  <div>
    <custom-header
      title="Mobile library stops"
      subtitle="Locations of mobile library stops, and their frequency"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
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
import Header from "../components/Header";
import MarkDownData from "../markdown/membershipdata.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {
    "custom-header": Header,
    VueMarkdownPlus
  }
};
</script>
<style scoped>
</style>
