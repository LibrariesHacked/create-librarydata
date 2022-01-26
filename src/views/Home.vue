<template>
  <div>
    <custom-header
      title="Create"
      subtitle="Tools for creating, publishing, and analysing library data"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <h2>Library locations</h2>
        <ol>
          <li>
            <router-link to="/libraries" exact
              >Editor for library locations dataset</router-link
            >
          </li>
        </ol>
        <h2>Library membership</h2>
        <ol>
          <li>
            <router-link to="/postcode-to-lsoa" exact
              >Postcode to statistical geography converter</router-link
            >
          </li>
          <li>
            <router-link to="/membership-map" exact
              >Membership map visualisation</router-link
            >
          </li>
        </ol>
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/Header";

import MarkDownData from "../markdown/home.md";
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
