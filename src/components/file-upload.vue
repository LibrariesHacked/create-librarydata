<template>
  <v-card elevation="0" color="grey-lighten-5" class="pt-2">
    <v-file-input chips show-size single-line bg-color="info" accept="text/csv" counter variant="outlined" clearable
      multiple label="Select a file" :model-value="files" v-on:update:model-value="updateSelection($event)"
      prepend-inner-icon="mdi-file-document" prepend-icon="" hint="File loader will only accept CSV file types"
      persistent-hint></v-file-input>
  </v-card>
</template>

<script>
export default {
  props: ["files"],
  methods: {
    updateSelection(files) {
      this.$emit('change-files', files)
    },
  }
};
</script>
