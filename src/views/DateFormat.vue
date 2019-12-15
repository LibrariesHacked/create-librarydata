<template>
  <div class="home">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Convert dates</h1>
          <h2 class="subtitle">Ensure your dates are formatted correctly</h2>
        </div>
      </div>
    </section>
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
