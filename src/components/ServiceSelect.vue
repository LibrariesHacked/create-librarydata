<template>
  <section>
    <v-select
      :items="items"
      label="Outlined style"
      outlined
      :value="value"
      @change="update"
    ></v-select>
  </section>
</template>

<script>
export default {
  props: ["value"],
  methods: {
    update(newValue) {
      this.$emit("change", newValue);
    }
  }
};
</script>
