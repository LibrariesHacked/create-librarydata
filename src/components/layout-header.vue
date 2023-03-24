<template>
  <v-container>
    <h1 class="text-center text-h2">{{ title }}</h1>
    <p class="text-subtitle-1 text-center">{{ subtitle }}</p>
  </v-container>
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
