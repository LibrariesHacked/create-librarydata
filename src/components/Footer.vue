<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <ul class="footerLinks font-weight-medium">
          <li><router-link to="/" exact>Home</router-link></li>
          <li><router-link to="/accessibility" exact>Accessibility</router-link></li>
          <li><router-link to="/privacy" exact>Privacy</router-link></li>
        </ul>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="font-weight-medium">
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
.footerLinks li:not(:first-child):before {
    content: " | ";
}
</style>
