<template>
  <section>
    <v-select
      :items="library_services.sort((a, b) => a.name.localeCompare(b.name))"
      item-text="nice_name"
      item-value="code"
      label="Choose a library service"
      outlined
      :value="value"
      @change="update"
    ></v-select>
  </section>
</template>

<script>
const authoritiesHelper = require("../helpers/libraryAuthorities.js");

export default {
  data() {
    return {
      library_services: []
    };
  },
  created() {
    this.library_services = this.$store.state.library_services;
    if (this.library_services.length === 0) {
      this.getServices();
    }
  },
  props: ["value"],
  methods: {
    async getServices() {
      let res = await authoritiesHelper.getLibraryAuthorities();
      this.$store.commit("setServices", res);
      this.library_services = this.$store.state.library_services;
    },
    update(newValue) {
      this.$emit("change", newValue);
    }
  }
};
</script>
