<template>
  <v-container>
    <layout-header title="Log in" subtitle="Gain access to edit and submit data for your service" />
    <markdown-section :markdownText="mdText" />
    <section>
      <v-container>
        <v-card color="success" variant="outlined" elevation="0" :loading="loading" max-width="350" class="mx-auto">
          <template #progress>
            <v-progress-linear height="5" indeterminate></v-progress-linear>
          </template>
          <v-card-title>Access the site</v-card-title>
          <v-card-text v-if="!success">
            <v-form ref="form" v-model="valid">
              <v-text-field clearable variant="outlined" v-model="email" :rules="emailRules" label="Enter email address"
                type="email" prepend-inner-icon="mdi-email" required></v-text-field>
              <p>{{ message }}</p>
            </v-form>
          </v-card-text>
          <v-card-text v-if="success">
            Thank you - you should receive an email shortly.
          </v-card-text>
          <v-card-actions v-if="!success">
            <v-spacer></v-spacer>
            <v-btn append-icon="mdi-email" variant="tonal" size="large" color="success" text @click="login"
              :disabled="!valid">
              Log in
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </section>
  </v-container>
</template>
<script>
import { useRoute } from 'vue-router'

import MarkDownData from "../markdown/login.md";

import * as login from "../helpers/login";

export default {
  data() {
    return {
      mdText: MarkDownData,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      valid: true,
      loading: false,
      success: false,
      message: ""
    };
  },
  created: function () {
    this.processLoginKey();
  },
  methods: {
    async login() {
      this.loading = true;
      this.$refs.form.validate();
      if (this.valid) {
        var loginRequest = await login.login(this.email);
        if (loginRequest) {
          this.success = true;
        } else {
          this.success = false;
          this.message = "You do not have access rights with that email address";
        }
      }
      this.loading = false;
    },
    processLoginKey: function () {
      const route = useRoute()
      const key = route.query.key;
      if (key) {
        this.$store.commit("setLoginKey", key);
        this.$router.push("/profile");
      }
    }
  },
  components: {}
};
</script>