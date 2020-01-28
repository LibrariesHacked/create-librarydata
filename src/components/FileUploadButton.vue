<template>
  <section>
    <b-field class="file">
      <b-upload v-model="file">
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>Click to upload</span>
        </a>
      </b-upload>
      <span class="file-name" v-if="file">
        {{ file.name }}
      </span>
    </b-field>
  </section>
</template>

<script>
export default {
  props: ["file"],
  data() {
    return {};
  },
  methods: {}
};
</script>
