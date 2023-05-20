<template>
  <v-card elevation="0" color="grey-lighten-5">
    <div class="text-caption pa-3">Select local authority</div>
    <v-autocomplete persistent-hint bg-color="green" class="elevation-0" clearable :v-model="value"
      :items="libraryServices" item-title="nice_name" item-value="code" label="Find a local authority" return-object
      :loading="libraryServices.length === 0" prepend-inner-icon="mdi-domain" v-on:update:modelValue="updateSelection"
      hint="You can type to search. After selecting a service, select the arrow icon to confirm">
      <template v-slot:append>
        <v-icon :color="selectedService !== null ? 'success' : 'grey'"
          :icon="serviceConfirmed ? 'mdi-check-circle' : 'mdi-chevron-right-circle'" disabled="false"
          @click="confirmSelection()"></v-icon>
      </template>
    </v-autocomplete>
    <v-chip v-if="serviceConfirmed" class="ma-2" closable @click:close="serviceConfirmed = false">{{
      selectedService.nice_name }}</v-chip>
  </v-card>
</template>

<script>
const authoritiesHelper = require("../helpers/libraryAuthorities.js");

export default {
  data() {
    return {
      libraryServices: [],
      selectedService: null,
      serviceConfirmed: false,
    };
  },
  created() {
    this.libraryServices = this.$store.state.libraryServices;
    if (this.libraryServices.length === 0) {
      this.getServices();
    }
  },
  props: ["value"],
  methods: {
    confirmSelection() {
      if (this.selectedService === null) return;
      this.serviceConfirmed = true;
      this.$emit("change", this.selectedService);
    },
    async getServices() {
      let services = await authoritiesHelper.getLibraryAuthorities();
      services = services.sort((a, b) => a.nice_name.localeCompare(b.nice_name));
      this.$store.commit("setServices", services);
      this.libraryServices = services;
    },
    updateSelection(newValue) {
      this.serviceConfirmed = false;
      this.selectedService = newValue;
    }
  }
};
</script>
