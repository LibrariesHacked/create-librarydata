<template>
  <div>
    <custom-header
      title="Create"
      subtitle="Tools for building and sharing library data"
    />
    <section class="main">
      <div class="container">
        <div class="content is-medium">
          <p>
            This website is a set of tools designed to aid library services in creating
            and using library open data. Inspired by the
            <a href="https://schema.librarydata.uk">public library open data schemas</a>,
            the site will provide tools relating to different datasets from those schemas.
          </p>
          <h3 class="subtitle has-text-grey">Library membership</h3>
          <ul>
            <li>
              <router-link to="/postcode-to-lsoa" exact class="has-text-weight-semibold">
                Create: postcode to LSOA converter
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <custom-footer />
  </div>
</template>
<script>
import Footer from "../components/Footer";
import Header from "../components/Header";

export default {
  data() {
    return {};
  },
  methods: {},
  components: { "custom-footer": Footer, "custom-header": Header }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
