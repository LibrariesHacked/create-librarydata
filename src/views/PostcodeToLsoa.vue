<template>
  <div class="home">
    <custom-header
      title="Postcode to LSOAs"
      subtitle="Convert data with postcodes in to use lower super output areas."
    />
    <div class="container">
      <br />
      <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/convert">Convert</a></li>
          <li class="is-active">
            <a href="#" aria-current="page">Postcode to LSOAs</a>
          </li>
        </ul>
      </nav>
      <hr />
      <b-steps
        size="is-medium"
        type="is-light"
        v-model="active_step"
        :has-navigation="false"
        :animated="true"
      >
        <b-step-item label="Choose File" icon="cloud-upload">
          <hr />
          <div class="columns">
            <div class="column">
              <file-upload
                v-bind:file="file"
                v-on:upload-file="file = $event"
                v-on:delete-file="file = null"
              />
              <br />
              <b-button
                size="is-medium"
                icon-right="chevron-right"
                v-on:click="confirmFile"
                :disabled="file === null"
              >
                Next
              </b-button>
            </div>
            <div class="column">
              <b-message>
                You will need to upload a CSV (comma separated values) file. One
                of the columns in this file should be UK postcodes.
              </b-message>
            </div>
          </div>
        </b-step-item>
        <b-step-item label="Options" icon="settings">
          <hr />
          <div class="columns">
            <div class="column">
              <b-field label="Select postcode column">
                <b-select
                  size="is-medium"
                  placeholder="Select column"
                  v-model="postcode_column"
                >
                  <option
                    v-for="option in columns"
                    :value="option"
                    :key="option"
                  >
                    {{ option }}
                  </option>
                </b-select>
              </b-field>
              <br />
              <b-button
                size="is-medium"
                icon-right="chevron-right"
                v-on:click="confirmOptions"
                :disabled="postcode_column === ''"
              >
                Convert
              </b-button>
            </div>
            <div class="column">
              <b-message>
                Choose the column in your file that contains postcodes. These
                will be converted to LSOAs.
              </b-message>
            </div>
          </div>
        </b-step-item>
        <b-step-item label="Download" icon="cloud-download">
          <hr />
          <div class="columns">
            <div class="column">
              <b-table
                :data="summary_data"
                :columns="summary_columns"
                :striped="true"
              ></b-table>
              <b-button
                size="is-medium"
                icon-right="download"
                v-on:click="downloadConvertedFile"
              >
                Download converted file
              </b-button>
            </div>
            <div class="column">
              <b-message>
                Choose the column in your file that contains postcodes. These
                will be converted to LSOAs.
              </b-message>
            </div>
          </div>
        </b-step-item>
      </b-steps>
    </div>
    <custom-footer />
  </div>
</template>

<script>
import Footer from "../components/Footer";
import FileUpload from "../components/FileUpload";
import Header from "../components/Header";

import * as Papa from "papaparse";
import * as postcodeHelper from "../helpers/postcode";

export default {
  data() {
    return {
      active_step: 0,
      columns: [],
      file: null,
      postcode_column: "",
      csv_data: [],
      summary_data: [{ converted: 0, unknown: 0 }],
      summary_columns: [
        { field: "converted", label: "Converted" },
        { field: "unknown", label: "Unmatched" }
      ]
    };
  },
  methods: {
    confirmFile: function() {
      if (this.file !== null) {
        let self = this;
        Papa.parse(self.file, {
          skipEmptyLines: true,
          complete: function(results) {
            self.columns = results.data[0];
            self.csv_data = results.data;
            self.active_step = 1;
          }
        });
      }
    },
    confirmOptions: function() {
      // First get all the postcodes
      this.summary_data[0].converted = 0;
      this.summary_data[0].unknown = 0;
      const column_index = this.columns.indexOf(this.postcode_column);
      let self = this;
      const postcodes = this.csv_data
        .map(row => {
          const value = row[column_index];
          if (value !== this.postcode_column) return row[column_index];
        })
        .filter(postcode => postcode != null);
      postcodeHelper.extractLsoaLookupFromPostcodes(
        postcodes,
        postcode_lookup => {
          // Now we have the postcode lookup we can update the original data
          self.csv_data.forEach(row => {
            const column_value = row[column_index];
            if (column_value === self.postcode_column) {
              row[column_index] = "LSOA";
            } else {
              // Do lookup
              if (
                column_value &&
                column_value !== "" &&
                postcode_lookup[column_value.replace(/\s/g, "")]
              ) {
                row[column_index] =
                  postcode_lookup[column_value.replace(/\s/g, "")];
                this.summary_data[0].converted++;
              } else {
                row[column_index] = "Unknown";
                this.summary_data[0].unknown++;
              }
            }
          });
          self.active_step = 2;
        }
      );
    },
    downloadConvertedFile: function() {
      var csv = new Blob([Papa.unparse(this.csv_data)], {
        type: "text/csv;charset=utf-8;"
      });
      const filename = "output.csv";
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
