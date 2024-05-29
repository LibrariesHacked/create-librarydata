<template>
  <v-container>
    <layout-header title="Loans" subtitle="Lending of library items" />
    <p class="text-center">
      <v-btn size="large" variant="tonal" color="info" href="https://schema.librarydata.uk/loans" target="_blank">
        Explore the loans schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/loansdata.md?raw'

export default {
  data() {
    return {
      mdText: MarkDownData
    }
  },
  methods: {},
  components: {}
}
</script>
