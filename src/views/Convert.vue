<template>
  <div class="home">
    <custom-header title="Convert" subtitle="Get data into the right format" />
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
import Header from "../components/Header";

export default {
  data() {
    return {};
  },
  methods: {},
  components: { "custom-footer": Footer, "custom-header": Header }
};
</script>
