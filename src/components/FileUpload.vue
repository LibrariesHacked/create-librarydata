<template>
  <v-card elevation="0" color="grey-lighten-5" class="pt-4">
    <v-file-input
      chips
      accept="text/csv"
      variant="solo-filled"
      flat
      multiple
      label="Select a file on your computer"
      :model-value="files"
      v-on:update:model-value="updateSelection($event)"
      hint="Only files with a .csv extension will be available"
      persistent-hint
      persistent-clear
      prepend-icon=""
      prepend-inner-icon="mdi-file-document"
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
