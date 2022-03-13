<template>
  <section>
    <v-file-input
      accept="text/csv"
      chips
      counter
      outlined
      multiple
      show-size
      label="Choose a file"
      :value="file"
      v-on:change="$emit('change-files', $event)"
      prepend-icon=""
      prepend-inner-icon="mdi-file-document-outline"
    ></v-file-input>
  </section>
</template>

<script>
export default {
  props: ["file"],
  data() {
    return {};
  },
  methods: {}
};
</script>
