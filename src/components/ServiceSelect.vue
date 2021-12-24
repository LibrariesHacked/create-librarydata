<template>
  <section>
    <v-select
      :items="library_services"
      label="Choose a library service"
      outlined
      :value="value"
      @change="update"
    ></v-select>
  </section>
</template>

<script>
const config = require("../helpers/config.json");

export default {
  data() {
    return {
      library_services: config.library_services,
    }
  },
  props: ["value"],
  methods: {
    update(newValue) {
      this.$emit("change", newValue);
    }
  }
};
</script>
