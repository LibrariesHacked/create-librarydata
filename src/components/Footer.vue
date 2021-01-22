<template>
  <footer class="footer">
    <div class="content container">
      <div class="columns">
        <div class="column">
          <div class="content is-medium">
            <p>
              Developed and maintained by
              <a href="https://www.librarieshacked.org" target="_blank"
                >Libraries Hacked</a
              >.
            </p>
          </div>
        </div>
        <div class="column">
          <div class="content is-medium">
            <router-link to="/" exact class="navbar-item has-text-weight-semibold">
              Home
            </router-link>
          </div>
        </div>
      </div>
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
  margin-top: 10px;
}
</style>
