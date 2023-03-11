<template>
  <div>
    <layout-header
      title="Stock summary"
      subtitle="Snapshot counts of library stock by item type"
    />
    <section>
      <v-container>
        <vue-markdown :source="mdText"></vue-markdown>
        <p class="text-center">
          <v-btn
            depressed
            color="primary"
            href="https://schema.librarydata.uk/stock-summary"
            target="_blank"
          >
            Stock summary data schema
          </v-btn>
        </p>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/layout-header";
import MarkDownData from "../markdown/stocksummarydata.md";
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
