<template>
  <div>
    <custom-header
      title="Profile"
      subtitle="See access and profile information"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/profile.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {
  },
  components: { "custom-header": Header, VueMarkdownPlus }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
