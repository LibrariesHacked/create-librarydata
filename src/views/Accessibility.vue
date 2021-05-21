<template>
  <div>
    <custom-header
      title="Accessibility"
      subtitle="How this site meets accessibility requirements"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/accessibility.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: { "custom-header": Header, VueMarkdownPlus }
};
</script>
