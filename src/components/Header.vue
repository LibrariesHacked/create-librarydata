<template>
  <section class="header">
    <v-container>
      <h1>{{ title }}</h1>
      <p class="text-subtitle-2">{{ subtitle }}</p>
    </v-container>
  </section>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  props: ["title", "subtitle"]
};
</script>
<style scoped>
.header {
  padding-top: 10px;
}
</style>
