<template>
  <v-container>
    <layout-header title="Postcodes to areas" subtitle="Convert postcode locations to statistical areas" />

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

    <h2 class="text-h5 text-decoration-underline my-3">Convert postcodes</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">
      <v-alert icon="mdi-numeric-1-circle" class="mb-1" title="Load a file">
        This tool loads CSV files. If your data isn't in CSV format try <strong>Save as</strong> in your software.
        The first row should be column headings, one column should contain UK postcodes
      </v-alert>

      <file-upload v-bind:files="files" v-on:change-files="confirmFile($event)" />

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-2-circle" title="Select file options">
        The field headings in your data should be displayed below. Choose which one represents the postcodes. If your data
        includes counts per postcode, also select the field holding the count</v-alert>

      <v-select color="success" v-model="postcodeColumn" :items="columns" label="Select postcode field" variant="outlined"
        :disabled="columns.length === 0"></v-select>

      <v-select color="success" :value="countsColumn" :items="columns.filter((c) => c !== postcodeColumn)" :disabled="postcodeColumn === '' ||
        columns.filter((c) => c !== postcodeColumn).length === 0
        " label="Count field (optional)" variant="outlined"></v-select>

      <v-btn color="info" variant="tonal" size="large" v-on:click="confirmOptions" :disabled="postcodeColumn === ''"
        append-icon="mdi-chevron-triple-right">
        Convert
      </v-btn>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-3-circle" title="Results">
        Valid postcodes are changed to their statistical area code. Postcodes that are no longer valid are changed to
        <strong>Terminated</strong>. Postcodes not recognised are changed to <strong>Unknown</strong>.<br />
      </v-alert>

      <span v-if="endTime !== null">
        <p class="mb-2">
          {{ "Completed in " + getTimeCompleted() + " seconds" }}
        </p>

        <v-card color="grey-lighten-2" variant="outlined" elevation="0" class="mb-2">
          <v-data-table no-filter :headers="summaryColumns" :items="summaryData" item-key="total">
            <template #bottom></template>
          </v-data-table>
        </v-card>

        <v-btn color="info" variant="tonal" size="large" v-on:click="downloadConvertedFile"
          append-icon="mdi-content-save">
          Save converted file
        </v-btn>
      </span>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-4-circle" title="Library membership data">
        Census geographies are required to publish <a href="https://schema.librarydata.uk/membership"
          target="_blank">library membership data</a>. This tool has calculated a count of members per statistical area.
        Select the name of your library service and choose a date the postcodes were extracted from your library
        management system
      </v-alert>

      <span v-if="endTime !== null">

        <service-select v-on:change="authority = $event" />

        <v-text-field class="mt-4" variant="outlined" v-model="extractDate" label="Count date"
          prepend-inner-icon="mdi-calendar" type="date"></v-text-field>

        <v-btn variant="tonal" color="success" v-on:click="downloadSchemaFile" size="large" append-icon="mdi-content-save"
          :disabled="authority === '' || extractDate === null">Save membership data</v-btn>

      </span>

    </v-sheet>

    <v-dialog v-model="loading" persistent width="300">
      <v-card>
        <v-card-title>
          Please wait
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
import ServiceSelect from '../components/service-select'

import moment from "moment";

const config = require("../helpers/config.json");

import { saveAs } from "file-saver";

import * as Papa from "papaparse";
import * as csvHelper from "../helpers/csv";
import * as postcodeHelper from "../helpers/postcode";

export default {
  data() {
    return {
      authority: null,
      columns: [],
      countsColumn: "",
      csvData: [],
      endTime: null,
      extractDate: null,
      files: [],
      libraryServices: config.libraryServices,
      loading: false,
      lsoasCounted: {},
      mdText: MarkDownData,
      postcodeColumn: "",
      startTime: null,
      summaryColumns: [
        { value: "total", title: "Total" },
        { value: "converted", title: "Successful" },
        { value: "terminated", title: "Terminated" },
        { value: "unknown", title: "Unknown" }
      ],
      summaryData: [{ total: 0, converted: 0, terminated: 0, unknown: 0 }]
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
        self.csvData = data;
        self.loading = false;
      }
    },
    confirmOptions: function () {
      let self = this;
      self.startTime = moment();
      self.loading = true;
      // First get all the postcodes
      self.summaryData[0].total = 0;
      self.summaryData[0].converted = 0;
      self.summaryData[0].unknown = 0;
      self.summaryData[0].terminated = 0;
      self.lsoasCounted = { Unknown: 0 };
      const postcodeColumnIndex = self.columns.indexOf(self.postcodeColumn);
      const countsColumnIndex = self.columns.indexOf(this.countsColumn);
      const postcodes = self.csvData
        .map((row) => row[postcodeColumnIndex])
        .filter((p) => p != null && p != self.postcodeColumn);
      postcodeHelper.extractLsoaLookupFromPostcodes(postcodes, (postcode_lookup) => {
        self.csvData.forEach((row, idx) => {
          const postcode = row[postcodeColumnIndex];
          const stripped = postcode.replace(/\s/g, "");
          if (idx === 0 && postcode === self.postcodeColumn) {
            // This is the header row
            row[postcodeColumnIndex] = "LSOA";
          } else {
            // This is a postcode row
            this.summaryData[0].total++;
            let lsoa = "";
            if (postcode && postcode !== "" && postcode_lookup[stripped]) {
              lsoa = postcode_lookup[stripped];
              if (lsoa === "Terminated") {
                row[postcodeColumnIndex] = "Terminated";
                this.summaryData[0].terminated++;
              } else if (lsoa === "Unknown") {
                row[postcodeColumnIndex] = "Unknown";
                this.summaryData[0].unknown++;
              } else {
                // We have a valid lookup
                row[postcodeColumnIndex] = lsoa;
                this.summaryData[0].converted++;
              }
            } else {
              row[postcodeColumnIndex] = "Unknown";
              this.summaryData[0].unknown++;
              lsoa = "Unknown";
            }
            if (lsoa === "Terminated") lsoa = "Unknown";
            // Ensure our lookup count has the lsoa key value
            if (!this.lsoasCounted[lsoa]) this.lsoasCounted[lsoa] = 0;
            if (this.countsColumn !== "") {
              // if count column use that
              this.lsoasCounted[lsoa] =
                this.lsoasCounted[lsoa] + parseInt(row[countsColumnIndex]);
            } else {
              // else just add one
              this.lsoasCounted[lsoa]++;
            }
          }
        });
        self.active_step = 3;
        this.loading = false;
        this.endTime = moment();
      });
    },
    downloadConvertedFile: function () {
      this.downloadFile("converted.csv", this.csvData);
    },
    downloadSchemaFile: async function () {
      let membershipData = [["Local authority", "Count date", "Area code", "Members"]];
      const date_string = moment(this.extractDate).format("YYYY-MM-DD");
      Object.keys(this.lsoasCounted)
        .filter((k) => k !== "Unknown" && k !== "Terminated")
        .forEach((lsoa) => {
          let count = this.lsoasCounted[lsoa];
          membershipData.push([
            this.authority.name,
            date_string,
            lsoa,
            count > 4 ? count.toString() : "x"
          ]);
        });
      let count = this.lsoasCounted["Unknown"];
      // Push unknown and terminated (all as unknown)
      if (this.lsoasCounted["Unknown"] > 0) {
        membershipData.push([
          this.authority.name,
          date_string,
          "Unknown",
          count > 4 ? count.toString() : "x"
        ]);
      }
      this.downloadFile("membership.csv", membershipData);
    },
    downloadFile: function (filename, data) {
      var blob = new Blob([Papa.unparse(data)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, filename);
    },
    getTimeCompleted: function () {
      if (this.startTime && this.endTime) {
        return Math.round(
          moment.duration(this.endTime.diff(this.startTime))
        );
      }
      return "";
    }
  },
  components: {
    "file-upload": FileUpload,
    "layout-header": Header,
    "markdown-section": Markdown,
    "service-select": ServiceSelect
  }
};
</script>

<style scoped></style>
