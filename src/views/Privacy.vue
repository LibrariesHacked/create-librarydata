<template>
  <div>
    <custom-header
      title="Privacy policy"
      subtitle="How your data and privacy is protected"
    />
    <section class="main">
      <div class="container">
        <div class="content is-medium">
          <vue-markdown-plus :source="mdText"></vue-markdown-plus>
        </div>
      </div>
    </section>
    <custom-footer />
  </div>
</template>
<script>
import Footer from "../components/Footer";
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
  components: { "custom-footer": Footer, "custom-header": Header, VueMarkdownPlus }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
