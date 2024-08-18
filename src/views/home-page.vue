<template>
  <v-container>
    <layout-header
      title="Create"
      subtitle="Helping libraries publish and utilise open data"
    />
    <markdown-section :markdownText="mdText" />
    <v-container class="text-center" v-if="!this.$store.state.loginKey">
      <v-btn
        prepend-icon="mdi-login-variant"
        variant="tonal"
        size="x-large"
        color="success"
        class="mx-1 my-1"
        :to="'/login'"
      >
        Log in
      </v-btn>
    </v-container>
    <div v-if="this.$store.state.loginKey">
      <user-profile :actions="true" />
    </div>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/home.md?raw'

export default {
  data () {
    return {
      mdText: MarkDownData
    }
  },
  methods: {},
  components: {}
}
</script>
