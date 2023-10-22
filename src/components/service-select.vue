<template>
  <v-card elevation="0" color="grey-lighten-5">
    <div class="text-caption pa-3">Select local authority</div>
    <v-autocomplete persistent-hint bg-color="info" density="compact" class="elevation-0" clearable
      :items="libraryServices" item-title="nice_name" item-value="code" label="Find a local authority" return-object
      :loading="libraryServices.length === 0" prepend-inner-icon="mdi-domain" v-on:update:modelValue="updateSelection"
      hint="You can type to search library services.">
    </v-autocomplete>
    <v-chip v-if="selectedService != null" class="ma-2" closable @click:close="deselectService()">{{
      selectedService.nice_name }}</v-chip>
  </v-card>
</template>

<script>
const authoritiesHelper = require("../helpers/libraryAuthorities.js");

export default {
  data() {
    return {
      libraryServices: [],
      selectedService: null
    };
  },
  created() {
    this.libraryServices = this.$store.state.libraryServices;
    if (this.libraryServices.length === 0) {
      this.getServices();
    }
  },
  methods: {
    deselectService() {
      this.selectedService = null;
      this.$emit("select", null);
    },
    async getServices() {
      let services = await authoritiesHelper.getLibraryAuthorities();
      services = services.sort((a, b) => a.nice_name.localeCompare(b.nice_name));
      this.$store.commit("setServices", services);
      this.libraryServices = services;
    },
    updateSelection(newValue) {
      this.selectedService = newValue;
      this.$emit("select", this.selectedService);
    }
  }
};
</script>
