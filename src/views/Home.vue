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
            These are tools designed to aid library services in creating and using library
            open data. Inspired by the public library
            <a href="https://schema.librarydata.uk">open data schemas</a>, this site will
            provide tools for the different datasets from those schemas.
          </p>
          <h3 class="subtitle has-text-grey">Library membership</h3>
          <router-link to="/postcode-to-lsoa" exact>
            Postcode to statistical geography converter
          </router-link>
          <br />
          <router-link to="/membership-map" exact>
            Visualise membership on a map
          </router-link>
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
