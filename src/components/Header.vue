<template>
  <section class="header">
    <div class="container">
      <h1 class="title has-text-primary has-text-weight-bold">{{ title }}</h1>
      <h2 class="subtitle">{{ subtitle }}</h2>
    </div>
    <hr />
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
  margin: 20px;
}
</style>
