<template>
  <div>
    <v-container>
      <h1 class="text-center">Create</h1>
    </v-container>
    <section>
      <v-container>
        <div class="text-body-1 text-center">
          <vue-markdown :source="mdText"></vue-markdown>
        </div>
      </v-container>
      <v-container class="text-center">
        <v-btn prepend-icon="mdi-login-variant" variant="tonal" size="x-large" color="success" class="mx-1 my-1" :to="'/login'">
          Log in
        </v-btn>
      </v-container>
    </section>
  </div>
</template>
<script>
import MarkDownData from "../markdown/home.md";
import VueMarkdown from "vue-markdown-render";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: { VueMarkdown }
};
</script>
