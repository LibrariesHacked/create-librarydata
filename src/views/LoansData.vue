<template>
  <div>
    <custom-header title="Loans" subtitle="Lending of library items" />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
        <p class="text-center">
          <v-btn
            depressed
            color="primary"
            href="https://schema.librarydata.uk/loans"
            target="_blank"
          >
            Loans data schema
          </v-btn>
        </p>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/membershipdata.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      mdText: MarkDownData
    };
  },
  methods: {},
  components: {
    "custom-header": Header,
    VueMarkdownPlus
  }
};
</script>
<style scoped>
</style>
