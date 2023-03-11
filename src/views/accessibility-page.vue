<template>
  <div>
    <layout-header
      title="Accessibility"
      subtitle="How this site meets accessibility requirements"
    />
    <section>
      <v-container>
        <vue-markdown :source="mdText"></vue-markdown>
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/layout-header";
import MarkDownData from "../markdown/accessibility.md";
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
