<template>
  <div>
    <custom-header
      title="Create"
      subtitle="Tools for building and analysing library data"
    />
    <section class="main">
      <div class="container">
        <div class="content is-medium">
          <p>
            These are tools designed to aid library services in creating and using library
            open data. Inspired by the public library
            <a href="https://schema.librarydata.uk">open data schemas project</a>, the
            tools are tailored for the different datasets documented in that work.
          </p>
          <h2>Library membership</h2>
          <ol>
            <li>
              <router-link to="/postcode-to-lsoa" exact
                >Postcode to statistical geography converter</router-link
              >
            </li>
            <li>
              <router-link to="/membership-map" exact
                >Membership map visualisation</router-link
              >
            </li>
          </ol>
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
  padding: 20px;
}
</style>
