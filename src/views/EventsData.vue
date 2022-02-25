<template>
  <div>
    <custom-header title="Events" subtitle="Library event attendance and outcomes" />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
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
import Header from "../components/Header";
import MarkDownData from "../markdown/eventsdata.md";
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
