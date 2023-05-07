<template>
  <v-card elevation="0" color="grey-lighten-5">
    <div class="text-caption pa-3">Select your file</div>
    <v-file-input chips color="success" accept="text/csv" counter variant="outlined" clearable multiple
      label="Select this field to choose a file" :model-value="file" v-on:update:model-value="updateSelection($event)"
      prepend-inner-icon="mdi-file-document" prepend-icon="" hint="Ensure the file you select is a CSV"
      persistent-hint></v-file-input>
  </v-card>
</template>

<script>
export default {
  props: ["file"],
  data() {
    return {
    };
  },
  methods: {
    updateSelection(files) {
      this.$emit('change-files', files)
    },
  }
};
</script>
