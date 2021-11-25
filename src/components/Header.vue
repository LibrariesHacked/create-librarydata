<template>
  <section class="header">
    <v-container>
      <h1>{{ title }}</h1>
      <p class="text-subtitle-1">{{ subtitle }}</p>
      <v-divider></v-divider>
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
