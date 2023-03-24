<template>
  <v-autocomplete clearable :items="library_services" item-title="nice_name" item-value="code"
    label="Choose a library authority" outlined :value="value" @change="update" return-object
    :loading="library_services.length === 0" prepend-inner-icon="mdi-domain"></v-autocomplete>
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
      services = services.sort((a, b) => a.nice_name.localeCompare(b.nice_name));
      this.$store.commit("setServices", services);
      this.library_services = services;
    },
    update(newValue) {
      this.$emit("change", newValue);
    }
  }
};
</script>
