<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <p class="font-weight-medium text-body-2">
          <ul class="footerLinks">
            <li><router-link to="/" exact>Home</router-link></li>
            <li><router-link to="/accessibility" exact>Accessibility</router-link></li>
            <li><router-link to="/privacy" exact>Privacy</router-link></li>
          </ul>
        </p>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="font-weight-medium text-body-2">
          Developed by
          <a href="https://www.librarieshacked.org" target="_blank">Libraries Hacked</a>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.footerLinks li {
  display: inline;
  margin-left: 10px;
  list-style-type: none;
}
</style>
