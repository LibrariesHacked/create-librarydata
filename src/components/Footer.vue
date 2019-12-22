<template>
  <footer class="footer">
    <div class="content container">
      <div class="columns">
        <div class="column">
          <p>
            Developed and maintained by
            <a href="https://www.librarieshacked.org" target="_blank"
              >Libraries Hacked</a
            >.
          </p>
          <p>
            <small
              ><strong>Create</strong> is open source and licensed under the
              <a
                href="http://opensource.org/licenses/mit-license.php"
                target="_blank"
                >MIT Licence</a
              >.</small
            >
          </p>
          <p class="control">
            <a
              class="button"
              href="https://github.com/librarieshacked/create-librarydata"
              target="_blank"
            >
              <b-icon icon="github-circle" />

              <span>GitHub</span>
            </a>
          </p>
          <p></p>
        </div>
        <div class="column">
          <router-link
            to="/"
            exact
            class="navbar-item has-text-weight-semibold"
          >
            Home
          </router-link>
          <router-link
            to="/privacy"
            class="navbar-item has-text-weight-semibold"
          >
            Privacy
          </router-link>
          <router-link
            to="/accessibility"
            class="navbar-item has-text-weight-semibold"
          >
            Accessibility
          </router-link>
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
.router-link-active {
  color: #36a2eb;
}
</style>
