<template>
  <div>
    <layout-header
      title="Privacy policy"
      subtitle="How your data and privacy is protected"
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
import MarkDownData from "../markdown/privacy.md";
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

<style scoped>
.main {
  margin: 20px;
}
</style>
