<template>
  <v-card elevation="0" color="grey-lighten-5" class="pt-2">
    <v-file-input chips color="success" accept="text/csv" counter variant="outlined" clearable multiple
      label="Select a file" :model-value="file" v-on:update:model-value="updateSelection($event)"
      prepend-inner-icon="mdi-file-document" prepend-icon="" hint="Accepts CSV files only" persistent-hint></v-file-input>
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
