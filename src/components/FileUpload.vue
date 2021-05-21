<template>
  <section>
    <v-file-input
      accept="text/csv"
      chips
      counter
      show-size
      small-chips
      multiple
      label="Choose a file from your computer"
      :value="file"
      v-on:change="$emit('change-files', $event)"
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
