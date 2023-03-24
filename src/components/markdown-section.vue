<template>
    <v-container class="markdown">
        <vue-markdown :source="markdownText" :options=options></vue-markdown>
    </v-container>
</template>
<script>
import VueMarkdown from "vue-markdown-render";

export default {
    data() {
        return {
            options: { html: true, breaks: true }
        };
    },
    methods: {},
    components: { VueMarkdown },
    props: {
        markdownText: {
            type: String,
            required: true
        }
    }
};
</script>
<style>
.markdown {
    padding: 1rem;
    margin: 1rem;
}

.markdown p {
    margin: 1rem 0;
}

.markdown a {
    color: #2196F3;
}

.markdown ul {
    padding-left: 1.5rem;
}
</style>