<template>
  <section>
    <v-file-input
      accept="text/csv"
      chips
      show-size
      label="Choose a file"
      :value="file"
      v-on:change="$emit('change-files', $event)"
      outlined
      multiple
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
