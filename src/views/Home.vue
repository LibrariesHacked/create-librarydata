<template>
  <div class="home">
    <custom-header
      title="Create"
      subtitle="Tools for building and sharing library data"
    />
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns"></div>
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

<style></style>
