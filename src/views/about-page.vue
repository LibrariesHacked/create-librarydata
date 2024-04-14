<template>
  <v-container>
    <layout-header
      title="About"
      subtitle="What the site is and does, and who for"
    />
    <markdown-section :markdownText="mdText" />
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/about.md?raw'

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
