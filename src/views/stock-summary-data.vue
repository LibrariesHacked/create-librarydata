<template>
  <v-container>
    <layout-header
      title="Stock summary"
      subtitle="Snapshot counts of library stock by item type"
    />
    <p class="text-center">
      <v-btn
        size="large"
        variant="tonal"
        color="info"
        href="https://schema.librarydata.uk/stock-summary"
        target="_blank"
      >
        Explore the stock summary data schema
      </v-btn>
    </p>

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/stocksummarydata.md?raw'

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
