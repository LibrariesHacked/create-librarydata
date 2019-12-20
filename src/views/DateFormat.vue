<template>
  <div class="home">
    <custom-header
      title="Format dates"
      subtitle="Ensure your dates are formatted consistently"
    />
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
