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
