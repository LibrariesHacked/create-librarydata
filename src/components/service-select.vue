<template>
  <v-card elevation="0" color="grey-lighten-5">
    <v-card-text>
      <div class="text-caption pa-3">Select the local authority name</div>
      <v-autocomplete persistent-hint bg-color="green" class="elevation-0" clearable :v-model="value"
        :items="library_services" item-title="nice_name" item-value="code" label="Find a local library authority"
        return-object :loading="library_services.length === 0" prepend-inner-icon="mdi-domain"
        v-on:update:modelValue="updateSelection"
        hint="You can type to search. After selecting a service, select the arrow icon to confirm">
        <template v-slot:append>
          <v-icon :color="selected_service !== null ? 'success' : 'grey'"
            :icon="service_confirmed ? 'mdi-check' : 'mdi-chevron-right-circle'" disabled="false"
            @click="confirmSelection()"></v-icon>
        </template>
      </v-autocomplete>
    </v-card-text>
  </v-card>
</template>

<script>
const authoritiesHelper = require("../helpers/libraryAuthorities.js");

export default {
  data() {
    return {
      library_services: [],
      selected_service: null,
      service_confirmed: false,
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
    updateSelection(newValue) {
      this.service_confirmed = false;
      this.selected_service = newValue;
    },
    confirmSelection() {
      if (this.selected_service === null) return;
      this.service_confirmed = true;
      this.$emit("change", this.selected_service);
    }
  }
};
</script>
