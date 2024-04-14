<template>
  <v-container>
    <layout-header
      title="Privacy policy"
      subtitle="How your data and privacy is protected"
    />
    <markdown-section :markdownText="mdText" />
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/privacy.md?raw'

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
