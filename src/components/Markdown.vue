<template>
  <section class="markdown">
    <vue-markdown :source="markdownText" :options="options"></vue-markdown>
  </section>
</template>

<script>
import VueMarkdown from 'vue-markdown-render'

export default {
  data () {
    return {
      options: { html: true, breaks: true }
    }
  },
  components: { VueMarkdown },
  props: {
    markdownText: {
      type: String,
      required: true
    }
  }
}
</script>
<style>
.markdown p {
  margin: 1rem 0;
}

.markdown a {
  color: #2196f3;
}

.markdown ul {
  padding-left: 1.5rem;
}
</style>
