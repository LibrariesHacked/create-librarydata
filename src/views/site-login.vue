<template>
  <div>
    <layout-header
      title="Log in"
      subtitle="Gain access to edit and submit data for your service"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-card outlined :loading="loading" max-width="350" class="mx-auto">
          <template slot="progress">
            <v-progress-linear height="5" indeterminate></v-progress-linear>
          </template>
          <v-card-title>Access</v-card-title>
          <v-card-text v-if="!success">
            <v-form ref="form" v-model="valid">
              <v-text-field
                clearable
                dense
                outlined
                v-model="email"
                :rules="emailRules"
                label="Enter email address"
                type="email"
                prepend-inner-icon="mdi-email"
                color="primary"
                required
              ></v-text-field>
              <p>{{ message }}</p>
            </v-form>
          </v-card-text>
          <v-card-text v-if="success">
            Thank you - you should receive an email shortly.
          </v-card-text>
          <v-card-actions v-if="!success">
            <v-spacer></v-spacer>
            <v-btn large color="primary" text @click="login" :disabled="!valid">
              Log in
              <v-icon right>mdi-login</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/layout-header";
import MarkDownData from "../markdown/login.md";
import VueMarkdownPlus from "vue-markdown-plus";

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
    this.stripLoginKey();
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
    stripLoginKey: function () {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const key = urlParams.get("key");
      if (key) {
        this.$store.commit("setLoginKey", key);
        this.$router.push("/profile");
      }
    }
  },
  components: { "layout-header": Header, VueMarkdownPlus }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
