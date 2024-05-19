<template>
  <v-container>
    <layout-header title="Physical visits" subtitle="Counts of people using libraries" />
    <p class="text-center">
      <v-btn size="large" variant="tonal" color="info" href="https://schema.librarydata.uk/physical-visits"
        target="_blank">
        Explore the visits schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/physicalvisitsdata.md?raw'

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
<style scoped></style>
