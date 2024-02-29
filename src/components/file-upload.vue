<template>
  <v-card elevation="0" color="grey-lighten-5">
    <v-file-input
      chips
      accept="text/csv"
      counter
      variant="outlined"
      bg-color="white"
      multiple
      label="Select a file"
      :model-value="files"
      v-on:update:model-value="updateSelection($event)"
      prepend-inner-icon="mdi-file-document"
      prepend-icon=""
      hint="This file loader only accepts CSV files"
      persistent-hint
    ></v-file-input>
  </v-card>
</template>

<script>
export default {
  props: ["files"],
  methods: {
    updateSelection(files) {
      this.$emit("change-files", files);
    }
  }
};
</script>
