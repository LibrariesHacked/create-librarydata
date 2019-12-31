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
                  Select the file containing postcode data.
                </p>
                <ol>
                  <li>The first row of the file should be column headings.</li>
                  <li>One column should contain UK postcodes.</li>
                </ol>
              </b-message>
              <b-message type="is-warning" class="content">
                <p><b>No CSV?</b></p>
                <p>
                  If your data isn't a CSV file you'll need to use software to
                  save as a CSV first.
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
                Download converted file
              </b-button>
              <hr />
              <h4 class="content title is-5">Library data file</h4>
              <h4 class="content subtitle is-6">
                Publish your data
              </h4>
              <b-field label="Authority name">
                <b-input v-model="authority"></b-input>
              </b-field>
              <b-field label="Select date extracted">
                <b-datepicker
                  placeholder="Type or select a date..."
                  icon="calendar-today"
                  v-model="extract_date"
                  editable
                >
                </b-datepicker>
              </b-field>
              <b-button
                type="is-secondary"
                icon-right="download"
                v-on:click="downloadSchemaFile"
                :disabled="authority === '' || extract_date === ''"
                :rounded="true"
              >
                Download schema file
              </b-button>
            </div>
            <div class="column">
              <b-message class="content" type="is-info">
                <p>
                  <b>Results</b>
                </p>
                <p>
                  The converted file will include these changes:
                </p>
                <ul>
                  <li>
                    The column header will be changed to
                    <strong>LSOA</strong>.
                  </li>
                  <li>
                    Postcodes will be changed to their LSOA.
                  </li>
                  <li>
                    Outdated postcodes will be changed to
                    <strong>Terminated</strong>.
                  </li>
                  <li>
                    Invalid postcodes will be changed to
                    <strong>Unknown</strong>.
                  </li>
                </ul>
              </b-message>
              <b-message class="content" type="is-success">
                <p>
                  <b>Schema file</b>
                </p>
                <p>
                  LSOAs are required for the
                  <a
                    href="https://schema.librarydata.uk/membership"
                    target="_blank"
                    >membership library data schema</a
                  >.
                </p>
                <p>
                  If your data is library member postcodes, this tool will
                  create a valid data export.
                </p>
                <ol>
                  <li>
                    Fill out the name of your library service.
                  </li>
                  <li>
                    Select when the postcodes were extracted from your
                    membership database.
                  </li>
                  <li>
                    Download the data file ready for publishing.
                  </li>
                </ol>
              </b-message>
            </div>
          </div>
        </b-step-item>
      </b-steps>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false">
      <b-icon icon="sync" size="is-large" custom-class="mdi-spin"></b-icon>
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
      lsoas_counted: {},
      summary_data: [{ total: 0, converted: 0, terminated: 0, unknown: 0 }],
      summary_columns: [
        { field: "total", label: "Total" },
        { field: "converted", label: "Successful" },
        { field: "terminated", label: "Terminated" },
        { field: "unknown", label: "Unknown" }
      ],
      authority: "",
      extract_date: null
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
    confirmOptions: function() {
      let self = this;
      this.start_time = moment();
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
                if (
                  postcode_lookup[value.replace(/\s/g, "")] === "Terminated"
                ) {
                  row[column_index] = "Terminated";
                  this.summary_data[0].terminated++;
                } else if (
                  postcode_lookup[value.replace(/\s/g, "")] === "Unknown"
                ) {
                  row[column_index] = "Unknown";
                  this.summary_data[0].unknown++;
                } else {
                  row[column_index] = postcode_lookup[value.replace(/\s/g, "")];
                  this.summary_data[0].converted++;
                  if (
                    this.lsoas_counted[
                      postcode_lookup[value.replace(/\s/g, "")]
                    ]
                  ) {
                    this.lsoas_counted[
                      postcode_lookup[value.replace(/\s/g, "")]
                    ] = 0;
                  }
                  this.lsoas_counted[
                    postcode_lookup[value.replace(/\s/g, "")]
                  ]++;
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
      this.downloadFile("output.csv", this.csv_data);
    },
    downloadSchemaFile: function() {
      // Create the data
      let membership_data = [
        ["Local authority", "Count date", "Area code", "Members"]
      ];
      Object.keys(this.lsoas_counted).forEach(lsoa => {
        membership_data.push([
          this.authority,
          this.extract_date,
          lsoa,
          this.lsoas_counted[lsoa]
        ]);
      });
      // Push unknown and terminated (all as unknown)
      membership_data.push([
        this.authority,
        this.extract_date,
        "Unknown",
        this.summary_data[0].terminated + this.summary_data[0].unknown
      ]);
      this.downloadFile("membership.csv", membership_data);
    },
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
