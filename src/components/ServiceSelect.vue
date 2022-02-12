<template>
  <section>
    <v-select
      :items="library_services"
      item-text="nice_name"
      item-value="code"
      label="Choose a library service"
      outlined
      :value="value"
      @change="update"
      return-object
      :loading="library_services.length === 0"
      prepend-inner-icon="mdi-map-legend"
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
      let services = await authoritiesHelper.getLibraryAuthorities();
      services = services.sort((a, b) => a.name.localeCompare(b.name));
      this.$store.commit("setServices", services);
      this.library_services = services;
    },
    update(newValue) {
      this.$emit("change", newValue);
    }
  }
};
</script>
