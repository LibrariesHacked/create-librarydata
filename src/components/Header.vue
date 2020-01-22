<template>
  <section class="hero is-light header">
    <div class="hero-body">
      <div class="container">
        <h1 class="title has-text-primary has-text-weight-bold">{{ title }}</h1>
        <h2 class="subtitle has-text-weight-semibold">{{ subtitle }}</h2>
      </div>
    </div>
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
  margin-bottom: 20px;
}
</style>
