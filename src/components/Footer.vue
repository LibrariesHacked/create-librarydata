<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <ul class="footerLinks text-body-1 font-weight-medium">
          <li><router-link to="/accessibility" exact>Accessibility</router-link></li>
          <li><router-link to="/privacy" exact>Privacy</router-link></li>
        </ul>
      </v-col>
      <v-col cols="12" sm="6">
        <p class="text-body-1 font-weight-medium">
          <v-btn
            color="success"
            depressed
            class="mx-2"
            href="https://www.github.com/librarieshacked/create-librarydata"
            target="_blank"
          >
            <v-icon left>mdi-github</v-icon>
            Code on GitHub
          </v-btn>
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
  margin-left: 5px;
  list-style-type: none;
}
.footerLinks li:not(:first-child):before {
  content: "• ";
}
</style>
