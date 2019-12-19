<template>
  <div class="home">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Convert</h1>
          <h2 class="subtitle">
            Do things to data to get it into the right format
          </h2>
        </div>
      </div>
    </section>
    <div class="container">
      <p>
        <router-link to="/postcode-to-lsoa">Postcode to LSOA</router-link> |
        <router-link to="/date-format">Format dates</router-link>
      </p>
    </div>
    <custom-footer />
  </div>
</template>
<script>
import Footer from "../components/Footer";

export default {
  data() {
    return {};
  },
  methods: {},
  components: { "custom-footer": Footer }
};
</script>
