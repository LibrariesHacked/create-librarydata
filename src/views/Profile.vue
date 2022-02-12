<template>
  <div>
    <custom-header title="Profile" subtitle="See access and profile information" />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-card outlined max-width="350" class="mx-auto">
          <v-card-text>
            <p class="text-h4 text--primary">
              {{ this.$store.state.loginSubject }}
            </p>
          </v-card-text>
          <v-card-actions v-if="!success">
            <v-spacer></v-spacer>
            <v-btn v-if="this.$store.state.loginSubject" large color="primary" text @click="logout">
              Log out
              <v-icon right>mdi-logout</v-icon>
            </v-btn>
            <v-btn v-if="!this.$store.state.loginSubject" large color="primary" text :to="'/'">
              Log in
              <v-icon right>mdi-login</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        {{ this.$store.state.loginExpires }}
        {{ this.$store.state.loginSubject }}
        {{ this.$store.state.loginAdmin }}
      </v-container>
    </section>
  </div>
</template>
<script>
import Header from "../components/Header";
import MarkDownData from "../markdown/profile.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      mdText: MarkDownData,
      subject: "",
      expires: "",
      admin: false
    };
  },
  methods: {},
  components: { "custom-header": Header, VueMarkdownPlus }
};
</script>

<style scoped>
.main {
  margin: 20px;
}
</style>
