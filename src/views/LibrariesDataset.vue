<template>
  <div class="home">
    <custom-header
      title="Libraries dataset"
      subtitle="Create and maintain data about your libraries"
    />
    <div class="container">
      <b-steps
        size="is-medium"
        type="is-info"
        v-model="active_step"
        :has-navigation="false"
        :animated="true"
      >
        <b-step-item label="File" icon="cloud-upload">
          <div class="columns">
            <div class="column">
              <file-upload
                v-bind:file="file"
                v-on:upload-file="file = $event"
                v-on:delete-file="file = null"
              />
              <br />
              <b-button
                icon-right="chevron-right"
                v-on:click="confirmFile"
                :disabled="file === null"
                :rounded="true"
                >Next</b-button
              >
            </div>
            <div class="column">
              <b-message type="is-info" class="content"> </b-message>
            </div>
          </div>
        </b-step-item>
        <b-step-item label="Options" icon="settings"> </b-step-item>
        <b-step-item label="Download" icon="cloud-download"> </b-step-item>
      </b-steps>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false">
      <b-icon icon="autorenew" size="is-large" custom-class="mdi-spin"></b-icon>
    </b-loading>
    <custom-footer />
  </div>
</template>

<script>
import Footer from "../components/Footer";
import FileUpload from "../components/FileUpload";
import Header from "../components/Header";

import moment from "moment";

import * as Papa from "papaparse";

export default {
  data() {
    return {
      loading: false,
      active_step: 0,
      file: null,
      csv_data: []
    };
  },
  methods: {
    confirmFile: async function() {
      let self = this;
      self.start_time = moment();
      self.loading = true;
      self.loading_message = "Analysing file";
      if (self.file !== null) {
        const parseFile = rawFile => {
          return new Promise(resolve => {
            let data = [];
            Papa.parse(rawFile, {
              skipEmptyLines: true,
              worker: true,
              step: results => {
                data.push(results.data);
              },
              complete: () => {
                resolve(data);
              }
            });
          });
        };
        let data = await parseFile(self.file);
        self.columns = data[0];
        self.csv_data = data;
        self.loading = false;
        self.end_time = moment();
        self.active_step = 1;
      }
    },
    confirmOptions: function() {},
    downloadFile: function(filename, data) {
      var csv = new Blob([Papa.unparse(data)], {
        type: "text/csv;charset=utf-8;"
      });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csv, filename);
      } else {
        //In FF link must be added to DOM to be clicked
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(csv);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  },
  components: {
    "custom-footer": Footer,
    "file-upload": FileUpload,
    "custom-header": Header
  }
};
</script>
