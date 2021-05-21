<template>
  <div>
    <custom-header
      title="Convert library member postcodes"
      subtitle="Obtain census-based areas for the locations of library members"
    />
    <section>
      <v-container>
        <p>
          England and Wales release statistics at the census-based Lower super output area
          geographic level. In Scotland, Data Zones are most useful, and in Northern
          Ireland, Small Areas. This tool converts UK postcodes into the most appropriate
          matching area.
        </p>
        <p>
          Postcodes are kept secure. A selection of postcode/area pairings are downloaded
          based on the postcode <b>sectors</b> in your data. The correct areas are then
          chosen on your local PC.
        </p>
        <v-stepper v-model="active_step" vertical flat>
          <v-stepper-step :complete="active_step > 1" step="1" color="secondary" editable>
            Load postcodes
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-container>
                  <file-upload v-bind:file="files" v-on:change-files="files = $event" />
                  <v-btn
                    color="primary"
                    depressed
                    :disabled="files.length === 0"
                    v-on:click="confirmFile"
                  >
                    Next
                  </v-btn>
                </v-container>
              </v-col>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-alert border="right" color="blue" text type="info">
                    <p>
                      <b>File tips</b>
                    </p>
                    <ol>
                      <li>
                        This tool loads CSV files. If your data isn't in CSV format you'll
                        need to convert it. Try <b>Save as</b> in your software.
                      </li>
                      <li>The first row should be column headings</li>
                      <li>One column should contain UK postcodes</li>
                    </ol>
                  </v-alert>
                </v-container>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-step color="secondary" :complete="active_step > 2" step="2">
            Choose conversion options
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-select
                    v-model="postcode_column"
                    :items="columns"
                    label="Select column"
                    outlined
                  ></v-select>
                  <v-btn
                    color="primary"
                    depressed
                    v-on:click="confirmOptions"
                    :disabled="postcode_column === ''"
                    >Convert
                  </v-btn>
                  <v-container>
                    <v-subheader>My columns include a count</v-subheader>
                    <v-select
                      :value="option"
                      :items="columns.filter(c => c !== postcode_column)"
                      :disabled="
                        postcode_column === '' ||
                          columns.filter(c => c !== postcode_column).length === 0
                      "
                      label="Count column (optional)"
                      outlined
                    ></v-select>
                  </v-container>
                </v-container>
              </v-col>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-alert border="right" color="blue" text type="info">
                    <p>
                      <b>Choose your columns</b>
                    </p>
                    <p>The column headings in your data should be displayed.</p>
                    <ol>
                      <li>Select the correct column for the postcodes</li>
                      <li>Check guidance below on the optional step</li>
                      <li>
                        When ready, select the
                        <strong>Convert</strong> option to continue
                      </li>
                    </ol>
                    <br />
                    <p>
                      It may take a few minutes depending on number of postcodes.
                    </p>
                  </v-alert>
                  <v-alert border="right" color="orange" text type="warning">
                    <p>
                      <b>Optional: counts of people</b>
                    </p>
                    <p>
                      If your data is grouped into counts per postcode, select the column
                      the count is held in. The tool will then be able to count people per
                      area for you.
                    </p>
                    <p>
                      If each of your rows relates to an individual person you can ignore
                      this option.
                    </p>
                  </v-alert>
                </v-container>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-step color="secondary" :complete="active_step > 3" step="3">
            Results
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-subheader>
                    {{ "Completed in " + getTimeCompleted() + " seconds" }}
                  </v-subheader>
                  <v-data-table
                    dense
                    disable-filtering
                    disable-pagination
                    disable-sort
                    hide-default-footer
                    :headers="summary_columns"
                    :items="summary_data"
                    item-key="total"
                  ></v-data-table>
                  <br />
                  <v-btn color="primary" depressed v-on:click="downloadConvertedFile"
                    >Save converted file
                  </v-btn>
                </v-container>
              </v-col>
              <v-col cols="12" sm="6">
                <v-container>
                  <v-alert border="right" color="blue" text type="info">
                    <p>
                      <b>Saving converted file - what to expect</b>
                    </p>
                    <ul>
                      <li>Valid postcodes are changed to their statistical area</li>
                      <li>
                        Postcodes that are no longer valid are changed to
                        <strong>Terminated</strong>.
                      </li>
                      <li>
                        Postcodes not recognised changed to
                        <strong>Unknown</strong>.
                      </li>
                      <li>
                        The postcode column header changed to
                        <strong>Area</strong>.
                      </li>
                    </ul>
                  </v-alert>
                </v-container>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-container>
                  <h4>Library membership data</h4>
                  <br />
                  <v-select
                    v-model="authority"
                    :items="library_services"
                    label="Library service name"
                    outlined
                  ></v-select>
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="extract_date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Count date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.dialog.save(date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <v-btn
                    depressed
                    v-on:click="downloadSchemaFile"
                    :disabled="authority === '' || extract_date === null"
                    >Save membership file</v-btn
                  >
                </v-container>
              </v-col>
              <v-col cols="12" sm="6">
                <v-alert border="right" color="orange" text type="warning">
                  <p>
                    <b>Public library open data</b>
                  </p>
                  <p>
                    Census geographies are required for
                    <a href="https://schema.librarydata.uk/membership" target="_blank"
                      >library membership data</a
                    >.
                  </p>
                  <p>This tool has calculated a count of members per statistical area.</p>
                  <ol>
                    <li>Select the name of your library service</li>
                    <li>
                      Choose a date the postcodes were extracted from your library
                      management system
                    </li>
                    <li>Save the data file</li>
                  </ol>
                </v-alert>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </section>
    <v-dialog v-model="loading" persistent width="300">
      <v-card>
        <v-card-title>
          <span class="headline">Please wait</span>
        </v-card-title>
        <v-card-text>
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FileUpload from "../components/FileUpload";
import Header from "../components/Header";

import moment from "moment";

const config = require("../helpers/config.json");

import { saveAs } from "file-saver";
import * as Papa from "papaparse";
import * as csvHelper from "../helpers/csv";
import * as postcodeHelper from "../helpers/postcode";

export default {
  data() {
    return {
      start_time: null,
      end_time: null,
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
      extract_date: null,
      library_services: config.library_services
    };
  },
  methods: {
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
      self.loading = true;
      if (self.files.length > 0) {
        const data = await csvHelper.parseFile(self.files[0]);
        self.columns = data[0];
        self.csv_data = data;
        self.active_step = 2;
        self.loading = false;
      }
    },
    confirmOptions: function() {
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
        .map(row => row[postcode_column_index])
        .filter(p => p != null && p != self.postcode_column);
      postcodeHelper.extractLsoaLookupFromPostcodes(postcodes, postcode_lookup => {
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
        this.end_time = moment();
      });
    },
    downloadConvertedFile: function() {
      this.downloadFile("converted.csv", this.csv_data);
    },
    downloadSchemaFile: async function() {
      let membership_data = [["Local authority", "Count date", "Area code", "Members"]];
      const date_string = moment(this.extract_date).format("YYYY-MM-DD");
      Object.keys(this.lsoas_counted)
        .filter(k => k !== "Unknown" && k !== "Terminated")
        .forEach(lsoa => {
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
    downloadFile: function(filename, data) {
      var blob = new Blob([Papa.unparse(data)], { type: "text/plain;charset=utf-8" });
      saveAs(blob, filename);
    }
  },
  components: {
    "file-upload": FileUpload,
    "custom-header": Header
  }
};
</script>

<style scoped>
tbody tr:hover {
  background-color: transparent !important;
}
</style>
