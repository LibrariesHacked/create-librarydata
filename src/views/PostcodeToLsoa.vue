<template>
  <div class="home">
    <custom-header
      title="Postcode to LSOA"
      subtitle="Convert data containing postcodes to use lower super output areas"
    />
    <div class="container">
      <br />
      <nav
        class="breadcrumb has-bullet-separator is-medium"
        aria-label="breadcrumbs"
      >
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/convert">Convert</a></li>
          <li class="is-active">
            <a href="#" aria-current="page">Postcode to LSOA</a>
          </li>
        </ul>
      </nav>
      <hr />
      <b-steps
        size="is-medium"
        type="is-info"
        v-model="active_step"
        :has-navigation="false"
        :animated="true"
      >
        <b-step-item label="File" icon="cloud-upload">
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
                icon-right="chevron-right"
                v-on:click="confirmFile"
                :disabled="file === null"
                :rounded="true"
              >
                Next
              </b-button>
            </div>
            <div class="column">
              <b-message type="is-info" class="content">
                <p><b>File tips</b></p>
                <p>
                  Select the file containing your data.
                </p>
                <ol>
                  <li>The first row of the file should be column headings</li>
                  <li>One column should contain UK postcodes.</li>
                </ol>
                <p>
                  In the next step you can choose which column contains
                  postcodes.
                </p>
              </b-message>
              <b-message type="is-warning" class="content">
                <p><b>No CSV?</b></p>
                <p>
                  If you have a sheet that isn't a CSV file you'll need to use
                  software to save as a CSV first.
                </p>
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
                icon-right="chevron-right"
                v-on:click="confirmOptions"
                :disabled="postcode_column === ''"
                :rounded="true"
              >
                Convert
              </b-button>
            </div>
            <div class="column">
              <b-message type="is-info" class="content">
                <p>
                  <b>Choose postcode column</b>
                </p>
                <p>
                  The list should display the columns in your data.
                </p>
                <ol>
                  <li>Select the correct column</li>
                  <li>
                    When ready select the <strong>Convert</strong> option to
                    continue
                  </li>
                </ol>
                <p>
                  Depending on the size of your file, the process may take a
                  number of minutes.
                </p>
              </b-message>
            </div>
          </div>
        </b-step-item>
        <b-step-item label="Download" icon="cloud-download">
          <hr />
          <div class="columns">
            <div class="column">
              <h3 class="content title is-4">Finished</h3>
              <h3 class="content subtitle is-6">
                {{ "Completed in " + getTimeCompleted() + " seconds" }}
              </h3>
              <b-table
                class="summary-table"
                :data="summary_data"
                :columns="summary_columns"
              ></b-table>
              <br />
              <b-button
                type="is-primary"
                icon-right="download"
                v-on:click="downloadConvertedFile"
                :rounded="true"
              >
                Download
              </b-button>
            </div>
            <div class="column">
              <b-message class="content" type="is-info">
                <p>
                  <b>Results</b>
                </p>
                <p>
                  The converted file will have the following changes.
                </p>
                <ul>
                  <li>
                    The column header will be changed to
                    <strong>LSOA</strong>.
                  </li>
                  <li>
                    Postcodes will be changed to the LSOA they're located in.
                  </li>
                  <li>
                    Out of date postcodes will be changed to
                    <strong>Terminated</strong>.
                  </li>
                  <li>
                    Invalid postcodes will be changed to
                    <strong>Unknown</strong>
                  </li>
                </ul>
              </b-message>
            </div>
          </div>
        </b-step-item>
      </b-steps>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false">
      <b-icon icon="sync" size="is-large" custom-class="mdi-spin"> </b-icon>
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
import * as postcodeHelper from "../helpers/postcode";

export default {
  data() {
    return {
      start_time: null,
      end_time: null,
      loading: false,
      loading_message: "",
      active_step: 0,
      columns: [],
      file: null,
      postcode_column: "",
      csv_data: [],
      summary_data: [{ total: 0, converted: 0, terminated: 0, unknown: 0 }],
      summary_columns: [
        { field: "total", label: "Total" },
        { field: "converted", label: "Completed" },
        { field: "terminated", label: "Terminated" },
        { field: "unknown", label: "Unknown" }
      ]
    };
  },
  methods: {
    getTimeElapsed: function() {
      return this.start_time ? this.start_time.fromNow() : "";
    },
    getTimeCompleted: function() {
      if (this.start_time && this.end_time) {
        return Math.round(
          moment.duration(this.end_time.diff(this.start_time)).asSeconds()
        );
      }
      return "";
    },
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
      let self = this;
      // First set timer
      this.start_time = moment();
      // First show loading
      this.loading = true;
      this.loading_message = "Collecting postcodes";
      // First get all the postcodes
      this.summary_data[0].total = 0;
      this.summary_data[0].converted = 0;
      this.summary_data[0].unknown = 0;
      this.summary_data[0].terminated = 0;
      const column_index = this.columns.indexOf(this.postcode_column);
      const postcodes = this.csv_data
        .map((row, idx) => {
          const value = row[column_index];
          if (idx != 0 && value !== this.postcode_column) return value;
        })
        .filter(postcode => postcode != null);
      this.loading_message = "Fetching LSOAs";
      postcodeHelper.extractLsoaLookupFromPostcodes(
        postcodes,
        postcode_lookup => {
          this.loading_message = "Replacing postcodes";
          // Now we have the postcode lookup we can update the original data
          self.csv_data.forEach((row, idx) => {
            const value = row[column_index];
            if (idx === 0 && value === self.postcode_column) {
              row[column_index] = "LSOA";
            } else {
              this.summary_data[0].total++;
              if (
                value &&
                value !== "" &&
                postcode_lookup[value.replace(/\s/g, "")]
              ) {
                if (postcode_lookup[value.replace(/\s/g, "")] !== "") {
                  row[column_index] = postcode_lookup[value.replace(/\s/g, "")];
                  this.summary_data[0].converted++;
                } else {
                  row[column_index] = "Terminated";
                  this.summary_data[0].terminated++;
                }
              } else {
                row[column_index] = "Unknown";
                this.summary_data[0].unknown++;
              }
            }
          });
          self.active_step = 2;
          this.loading = false;
          this.end_time = moment();
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

<style>
.summary-table table {
  border-collapse: collapse !important;
  background: #f9f9f9;
}

.summary-table td {
  border: 1px solid #e5e5e5 !important;
}

.summary-table th {
  border: 1px solid #e5e5e5 !important;
}
</style>
