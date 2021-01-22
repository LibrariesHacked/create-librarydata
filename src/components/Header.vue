<template>
  <section class="header">
    <div class="container">
      <div class="content">
        <h1 class="title has-text-primary">{{ title }}</h1>
        <h2 class="subtitle has-text-grey">{{ subtitle }}</h2>
      </div>
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
