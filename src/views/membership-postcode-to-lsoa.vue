<template>
  <v-container>
    <layout-header title="Postcodes to statistical areas" subtitle="Convert postcode locations to census-based areas" />

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

    <h2 class="text-h5 text-decoration-underline my-3">Convert postcodes</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">
      <v-alert icon="mdi-numeric-1-circle" class="mb-1" title="Load a file">
        This tool loads CSV files. If your data isn't in CSV format try <strong>Save as</strong> in your software.
        The first row should be column headings, one column should contain UK postcodes
      </v-alert>

      <file-upload v-bind:file="files" v-on:change-files="confirmFile($event)" />

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-2-circle" title="Select file options">
        The field headings in your data should be displayed below. Choose which one represents the postcodes. If your data
        includes counts per postcode, also select the field holding the count</v-alert>

      <v-select color="success" v-model="postcode_column" :items="columns" label="Select postcode field"
        variant="outlined" :disabled="columns.length === 0"></v-select>

      <v-select color="success" :value="counts_column" :items="columns.filter((c) => c !== postcode_column)" :disabled="postcode_column === '' ||
        columns.filter((c) => c !== postcode_column).length === 0
        " label="Count field (optional)" variant="outlined"></v-select>

      <v-btn color="info" variant="tonal" size="large" v-on:click="confirmOptions" :disabled="postcode_column === ''">
        Convert
      </v-btn>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-3-circle" title="Results">
        Valid postcodes are changed to their statistical area code. Postcodes that are no longer valid are changed to
        <strong>Terminated</strong>. Postcodes not recognised are changed to <strong>Unknown</strong>.<br />
      </v-alert>

      <span v-if="endTime !== null">
        <p>
          {{ "Completed in " + getTimeCompleted() + " seconds" }}
        </p>

        <v-data-table dense disable-filtering disable-pagination disable-sort hide-default-footer
          :headers="summary_columns" :items="summary_data" item-key="total"></v-data-table>

        <v-btn color="info" variant="tonal" size="large" v-on:click="downloadConvertedFile">
          Save converted file
        </v-btn>
      </span>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-4-circle" title="Library membership data">
        Census geographies are required to publish <a href="https://schema.librarydata.uk/membership"
          target="_blank">library membership data</a>. This tool has calculated a count of members per statistical area.
        Select the name of your library service and choose a date the postcodes were extracted from your library
        management system
      </v-alert>

      <v-select v-model="authority" :items="library_services" label="Library service name" variant="outlined"></v-select>

      <v-text-field variant="outlined" :v-model="extractDate" label="Count date" prepend-inner-icon="mdi-calendar"
        readonly v-on="on"></v-text-field>

      <v-btn variant="tonal" color="success" v-on:click="downloadSchemaFile" size="large"
        :disabled="authority === '' || extractDate === null">Save membership schema data</v-btn>

    </v-sheet>

    <v-dialog v-model="loading" persistent width="300">
      <v-card>
        <v-card-title>
          <span class="headline">Please wait</span>
        </v-card-title>
        <v-card-text>
          <v-progress-linear indeterminate color="info"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import FileUpload from "../components/file-upload";
import Header from "../components/layout-header";
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/membershippostcodetolsoa.md";

import moment from "moment";

const config = require("../helpers/config.json");

import { saveAs } from "file-saver";
import * as Papa from "papaparse";
import * as csvHelper from "../helpers/csv";
import * as postcodeHelper from "../helpers/postcode";

export default {
  data() {
    return {
      mdText: MarkDownData,
      start_time: null,
      endTime: null,
      loading: false,
      loading_message: "",
      active_step: 1,
      columns: [],
      files: [],
      postcode_column: "",
      counts_column: "",
      csv_data: [],
      lsoas_counted: {},
      summary_data: [{ total: 0, converted: 0, terminated: 0, unknown: 0 }],
      summary_columns: [
        { value: "total", text: "Total" },
        { value: "converted", text: "Successful" },
        { value: "terminated", text: "Terminated" },
        { value: "unknown", text: "Unknown" }
      ],
      authority: "",
      extractDate: null,
      library_services: config.library_services,
      modal: false
    };
  },
  methods: {
    confirmFile: async function (files) {
      this.files = files;
      let self = this;
      self.loading = true;
      if (self.files.length > 0) {
        const data = await csvHelper.parseFile(self.files[0], false);
        self.columns = data[0];
        self.csv_data = data;
        self.active_step = 2;
        self.loading = false;
      }
    },
    confirmOptions: function () {
      let self = this;
      self.start_time = moment();
      self.loading = true;
      // First get all the postcodes
      self.summary_data[0].total = 0;
      self.summary_data[0].converted = 0;
      self.summary_data[0].unknown = 0;
      self.summary_data[0].terminated = 0;
      self.lsoas_counted = { Unknown: 0 };
      const postcode_column_index = self.columns.indexOf(self.postcode_column);
      const counts_column_index = self.columns.indexOf(this.counts_column);
      const postcodes = self.csv_data
        .map((row) => row[postcode_column_index])
        .filter((p) => p != null && p != self.postcode_column);
      postcodeHelper.extractLsoaLookupFromPostcodes(postcodes, (postcode_lookup) => {
        self.csv_data.forEach((row, idx) => {
          const postcode = row[postcode_column_index];
          const stripped = postcode.replace(/\s/g, "");
          if (idx === 0 && postcode === self.postcode_column) {
            // This is the header row
            row[postcode_column_index] = "LSOA";
          } else {
            // This is a postcode row
            this.summary_data[0].total++;
            let lsoa = "";
            if (postcode && postcode !== "" && postcode_lookup[stripped]) {
              lsoa = postcode_lookup[stripped];
              if (lsoa === "Terminated") {
                row[postcode_column_index] = "Terminated";
                this.summary_data[0].terminated++;
              } else if (lsoa === "Unknown") {
                row[postcode_column_index] = "Unknown";
                this.summary_data[0].unknown++;
              } else {
                // We have a valid lookup
                row[postcode_column_index] = lsoa;
                this.summary_data[0].converted++;
              }
            } else {
              row[postcode_column_index] = "Unknown";
              this.summary_data[0].unknown++;
              lsoa = "Unknown";
            }
            if (lsoa === "Terminated") lsoa = "Unknown";
            // Ensure our lookup count has the lsoa key value
            if (!this.lsoas_counted[lsoa]) this.lsoas_counted[lsoa] = 0;
            if (this.counts_column !== "") {
              // if count column use that
              this.lsoas_counted[lsoa] =
                this.lsoas_counted[lsoa] + parseInt(row[counts_column_index]);
            } else {
              // else just add one
              this.lsoas_counted[lsoa]++;
            }
          }
        });
        self.active_step = 3;
        this.loading = false;
        this.endTime = moment();
      });
    },
    downloadConvertedFile: function () {
      this.downloadFile("converted.csv", this.csv_data);
    },
    downloadSchemaFile: async function () {
      let membership_data = [["Local authority", "Count date", "Area code", "Members"]];
      const date_string = moment(this.extractDate).format("YYYY-MM-DD");
      Object.keys(this.lsoas_counted)
        .filter((k) => k !== "Unknown" && k !== "Terminated")
        .forEach((lsoa) => {
          let count = this.lsoas_counted[lsoa];
          membership_data.push([
            this.authority,
            date_string,
            lsoa,
            count > 4 ? count.toString() : "x"
          ]);
        });
      let count = this.lsoas_counted["Unknown"];
      // Push unknown and terminated (all as unknown)
      if (this.lsoas_counted["Unknown"] > 0) {
        membership_data.push([
          this.authority,
          date_string,
          "Unknown",
          count > 4 ? count.toString() : "x"
        ]);
      }
      this.downloadFile("membership.csv", membership_data);
    },
    downloadFile: function (filename, data) {
      var blob = new Blob([Papa.unparse(data)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, filename);
    },
    getTimeCompleted: function () {
      if (this.start_time && this.endTime) {
        return Math.round(
          moment.duration(this.endTime.diff(this.start_time))
        );
      }
      return "";
    }
  },
  components: {
    "file-upload": FileUpload,
    "layout-header": Header,
    "markdown-section": Markdown
  }
};
</script>

<style scoped>
tbody tr:hover {
  background-color: transparent !important;
}
</style>
