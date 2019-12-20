<template>
  <div class="home">
    <custom-header
      title="Create"
      subtitle="Tools for creating with library data."
    />
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
