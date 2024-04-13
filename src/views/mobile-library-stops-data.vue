<template>
  <v-container>
    <layout-header
      title="Mobile library stops"
      subtitle="Locations of mobile library stops, and their frequency"
    />
    <p class="text-center">
      <v-btn
        size="large"
        variant="tonal"
        color="info"
        href="https://schema.librarydata.uk/mobile-library-stops"
        target="_blank"
      >
        Explore the mobile stops data schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/mobilelibrarystopsdata.md?raw'

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
