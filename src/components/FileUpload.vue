<template>
  <section>
    <b-field>
      <b-upload
        type="is-light"
        accept=".csv"
        v-on:input="$emit('upload-file', $event)"
        drag-drop
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"> </b-icon>
            </p>
            <p>Drop your CSV file here or click to add</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="tags">
      <span class="tag is-primary" v-if="file">
        {{ file.name }}
        <button
          class="delete is-small"
          type="button"
          @click="$emit('delete-file')"
        ></button>
      </span>
    </div>
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
