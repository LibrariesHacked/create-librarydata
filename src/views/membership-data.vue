<template>
  <div>
    <layout-header
      title="Membership"
      subtitle="Snapshot counts of library membership by geographic area"
    />
    <section>
      <v-container>
        <vue-markdown :source="mdText"></vue-markdown>
        <p class="text-center">
          <v-btn
            depressed
            color="primary"
            href="https://schema.librarydata.uk/membership"
            target="_blank"
          >
            Membership data schema
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
