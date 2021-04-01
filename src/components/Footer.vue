<template>
  <footer class="footer has-background-white">
    <div class="container">
      <nav class="breadcrumb has-dot-separator is-medium">
        <ul>
          <li><router-link to="/" exact>Home</router-link></li>
          <li><router-link to="/accessibility" exact>Accessibility</router-link></li>
          <li><router-link to="/privacy" exact>Privacy</router-link></li>
        </ul>
      </nav>
    </div>
    <div class="container content is-medium">
      <p>
        Developed by
        <a href="https://www.librarieshacked.org" target="_blank">Libraries Hacked</a>
      </p>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.footer {
  padding-top: 50px;
}
</style>
