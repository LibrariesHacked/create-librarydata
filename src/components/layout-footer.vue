<template>
  <v-footer app color="grey-lighten-5">
    <v-row justify="center" class="text-xs-center w-100" no-gutters>
      <v-btn size="large" variant="text" color="info" to="/accessibility">
        Accessibility
      </v-btn>
      <v-btn size="large" variant="text" color="info" to="/privacy">
        Privacy
      </v-btn>
    </v-row>
    <v-row justify="center" no-gutters>
      <p>
        <CarbonBadge />
      </p>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped></style>
