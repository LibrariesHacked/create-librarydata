<template>
  <div>
    <layout-header title="Events" subtitle="Library event attendance and outcomes" />
    <section>
      <v-container>
        <vue-markdown :source="mdText"></vue-markdown>
        <p class="text-center">
          <v-btn
            depressed
            color="primary"
            href="https://schema.librarydata.uk/events"
            target="_blank"
          >
            Events data schema
          </v-btn>
        </p>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/layout-header";
import MarkDownData from "../markdown/eventsdata.md";
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
