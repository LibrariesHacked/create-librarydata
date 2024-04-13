<template>
  <v-card elevation="0" color="grey-lighten-5" class="pt-4">
    <v-file-input
      chips
      show-size
      accept="text/csv"
      counter
      variant="outlined"
      bg-color="white"
      multiple
      label="Select a file on your computer"
      :model-value="files"
      v-on:update:model-value="updateSelection($event)"
      prepend-icon="mdi-file-document"
      hint="Only files with an extension of .csv will be displayed"
      persistent-hint
    ></v-file-input>
  </v-card>
</template>

<script>
export default {
  props: ['files'],
  methods: {
    updateSelection (files) {
      this.$emit('change-files', files)
    }
  }
}
</script>
