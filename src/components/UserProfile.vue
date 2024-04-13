<template>
  <v-card variant="tonal" color="info">
    <v-card-text>
      <p v-if="this.$store.state.loginKey">
        Logged in as <strong>{{ this.$store.state.loginSubject }}</strong>
        <span v-if="this.$store.state.loginAdmin">
          <v-chip
            color="info"
            class="mx-2 my-2"
            prepend-icon="mdi-shield-crown"
          >
            Admin
          </v-chip>
        </span>
        <v-chip
          class="mr-1"
          v-for="code in this.$store.state.loginCodes"
          :key="'chip_' + code"
        >
          <v-icon left>mdi-map-legend</v-icon>
          {{
            library_services.length > 0
              ? library_services.filter(s => s.code === code)[0].nice_name
              : code
          }}</v-chip
        >
      </p>
      <p v-if="!this.$store.state.loginKey">You are not logged in</p>
    </v-card-text>
    <v-card-actions v-if="this.actions">
      <v-spacer></v-spacer>
      <v-btn
        v-if="this.$store.state.loginKey"
        size="small"
        variant="tonal"
        color="info"
        text
        @click="logout"
      >
        Log out
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
      <v-btn
        v-if="!this.$store.state.loginKey"
        size="small"
        variant="tonal"
        color="info"
        :to="'/login'"
      >
        Log in
        <v-icon right>mdi-login</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as authoritiesHelper from '../helpers/libraryAuthorities.js'

export default {
  props: ['actions'],
  data () {
    return {}
  },
  methods: {
    async getServices () {
      let services = await authoritiesHelper.getLibraryAuthorities()
      services = services.sort((a, b) => a.name.localeCompare(b.name))
      this.$store.commit('setServices', services)
      this.library_services = services
    },
    async logout () {
      this.$store.commit('logout')
    }
  },
  beforeMount () {
    this.getServices()
  }
}
</script>

<style scoped></style>
