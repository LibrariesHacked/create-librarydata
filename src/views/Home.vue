<template>
  <div>
    <custom-header
      title="Create"
      subtitle="Tools for building and sharing library data."
    />
    <section></section>
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
