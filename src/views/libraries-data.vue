<template>
  <v-container>
    <layout-header title="Libraries" subtitle="Public library locations, hours, and contact details" />
    <p class="text-center">
      <v-btn size="large" prepend-icon="mdi-information-outline" variant="tonal" color="info"
        href="https://schema.librarydata.uk/libraries" target="_blank">
        Explore the locations schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/librariesdata.md?raw'

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
