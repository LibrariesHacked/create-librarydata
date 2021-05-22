<template>
  <div>
    <custom-header
      title="Privacy policy"
      subtitle="How your data and privacy is protected"
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
import MarkDownData from "../markdown/privacy.md";
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

<style scoped>
.main {
  margin: 20px;
}
</style>
