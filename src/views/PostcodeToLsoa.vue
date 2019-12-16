<template>
  <div class="home">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Postcode to LSOA</h1>
          <h2 class="subtitle">
            Convert data containing postcodes to use LSOAs
          </h2>
        </div>
      </div>
    </section>
    <div class="container">
      <br />
      <b-steps
        type="is-info"
        size="is-medium"
        :has-navigation="false"
        v-model="active_step"
        :animated="true"
      >
        <b-step-item label="Choose File" icon="cloud-upload">
          <file-upload
            v-bind:file="file"
            v-on:upload-file="file = $event"
            v-on:delete-file="file = null"
          />
          <br />
          <b-button
            size="is-large"
            icon-right="chevron-right"
            @click="confirmFile"
            :disabled="file === null"
          >
            Next
          </b-button>
          <br />
          <br />
        </b-step-item>
        <b-step-item label="Options" icon="settings">
          <b-field label="Select postcode column">
            <b-select placeholder="Select column" v-model="postcode_column">
              <option v-for="option in columns" :value="option" :key="option">
                {{ option }}
              </option>
            </b-select>
          </b-field>
          <br />
          <b-button
            size="is-large"
            icon-right="chevron-right"
            @click="confirmOptions"
            :disabled="postcode_column === ''"
          >
            Convert
          </b-button>
        </b-step-item>
        <b-step-item label="Download" icon="cloud-download"></b-step-item>
      </b-steps>
    </div>
    <custom-footer />
  </div>
</template>
<script>
import Footer from "../components/Footer";
import FileUpload from "../components/FileUpload";

import * as Papa from "papaparse";

export default {
  data() {
    return {
      active_step: 0,
      columns: [],
      file: null,
      postcode_column: ""
    };
  },
  methods: {
    confirmFile: function() {
      if (this.file !== null) {
        let self = this;
        Papa.parse(self.file, {
          complete: function(results) {
            self.columns = results.data[0];
            self.active_step = 1;
          }
        });
      }
    },
    confirmOptions: function() {
      this.active_step = 2;
    }
  },
  components: { "custom-footer": Footer, "file-upload": FileUpload }
};
</script>
