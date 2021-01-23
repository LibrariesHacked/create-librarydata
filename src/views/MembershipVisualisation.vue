<template>
  <div>
    <custom-header
      title="Membership visualisation"
      subtitle="Explore library membership data"
    />
    <section>
      <div class="container"></div>
      <custom-footer />
    </section>
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
  components: {
    "custom-footer": Footer,
    "custom-header": Header
  }
};
</script>

<style></style>
