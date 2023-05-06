<template>
  <v-container>
    <layout-header title="Create" subtitle="Helping libraries publish and use library open data" />
    <markdown-section :markdownText="mdText" />
    <v-container class="text-center">
      <v-btn prepend-icon="mdi-login-variant" variant="tonal" size="x-large" color="success" class="mx-1 my-1"
        :to="'/login'">
        Log in
      </v-btn>
    </v-container>
  </v-container>
</template>
<script>
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/home.md";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: { "layout-header": Header, "markdown-section": Markdown }
};
</script>
