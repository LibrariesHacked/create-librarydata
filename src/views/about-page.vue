<template>
  <div>
    <layout-header title="About" subtitle="What this site is for and how it works" />
    <section>
      <v-container>
        <vue-markdown :source="mdText"></vue-markdown>
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/layout-header";
import MarkDownData from "../markdown/about.md";
import VueMarkdown from "vue-markdown-render";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: { "layout-header": Header, VueMarkdown }
};
</script>
