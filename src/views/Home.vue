<template>
  <div>
    <v-container>
      <h1 class="text-center">Create</h1>
    </v-container>
    <section>
      <v-container>
        <div class="text-body-1 text-center">
          <vue-markdown-plus :source="mdText"></vue-markdown-plus>
        </div>
      </v-container>
      <v-container class="text-center">
        <v-btn x-large color="success" depressed class="mx-1 my-1" :to="'/login'">
          <v-icon left>mdi-account</v-icon>
          Log in
        </v-btn>
        <v-btn x-large color="info" depressed class="mx-1 my-1" :to="'/about'">
          <v-icon left>mdi-information-outline</v-icon>
          About Create
        </v-btn>
        <v-btn
          x-large
          color="primary"
          outlined
          class="mx-1 my-1"
          href="https://schema.librarydata.uk"
          target="_blank"
        >
          <v-icon left>mdi-cube</v-icon>
          Open data schemas
        </v-btn>
      </v-container>
    </section>
  </div>
</template>
<script>
import MarkDownData from "../markdown/home.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: { VueMarkdownPlus }
};
</script>
