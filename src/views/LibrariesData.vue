<template>
  <div>
    <custom-header
      title="Library locations"
      subtitle="Create and maintain data on your library buildings."
    />
    <section>
      <v-container>
        <v-alert color="primary" text type="info">
          For guidance see the
          <a href="https://schema.librarydata.uk/libraries" target="_blank"
            >Library locations dataset</a
          >
        </v-alert>
        <v-data-table :headers="headers" :items="libraries" sort-by="name">
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-dialog
                persistent
                v-model="dialogMainLibrary"
                max-width="500px"
                overlay-opacity="0.2"
                content-class="elevation-0"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text color="primary" v-bind="attrs" v-on="on">
                    Add library
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <v-container>
                      <template>
                        <v-tabs>
                          <v-tab>Main details</v-tab>
                          <v-tab>Location</v-tab>
                          <v-tab>Opening hours</v-tab>
                          <v-tab-item>
                            <v-container></v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-select
                                  v-model="editedItem['Local authority']"
                                  :items="library_services"
                                  label="Service"
                                  outlined
                                  rounded
                                  dense
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Library name']"
                                  label="Name"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="8" md="8">
                                <v-select
                                  v-model="editedItem['Type of library']"
                                  label="Type"
                                  :items="[
                                    { text: 'Local authority', value: 'LAL' },
                                    {
                                      text: 'Local authority (unstaffed)',
                                      value: 'LAL-'
                                    },
                                    { text: 'Commisioned', value: 'CL' },
                                    { text: 'Community-run', value: 'CRL' },
                                    { text: 'Independent', value: 'IL' }
                                  ]"
                                  dense
                                  outlined
                                  rounded
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="4" md="4">
                                <v-select
                                  v-model="editedItem['Statutory']"
                                  :items="['Yes', 'No']"
                                  label="Statutory"
                                  dense
                                  outlined
                                  rounded
                                ></v-select>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Year opened']"
                                  label="Year opened"
                                  type="number"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Year closed']"
                                  label="Year closed"
                                  type="number"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Email address']"
                                  label="Email address"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['URL']"
                                  label="Website"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-textarea
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Notes']"
                                  label="Notes"
                                  full-width
                                ></v-textarea>
                              </v-col>
                            </v-row>
                          </v-tab-item>
                          <v-tab-item>
                            <v-container></v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Address 1']"
                                  label="Address 1"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Address 2']"
                                  label="Address 2"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Address 3']"
                                  label="Address 3"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Postcode']"
                                  label="Postcode"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                  dense
                                  outlined
                                  rounded
                                  v-model="editedItem['Unique property reference number']"
                                  label="Unique property reference number"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-tab-item>
                          <v-tab-item>
                            <v-container></v-container>
                            <v-row>
                              <v-col
                                cols="12"
                                sm="6"
                                md="6"
                                v-for="hourType in openingHourTypes"
                                :key="hourType"
                              >
                                <div v-for="day in days" :key="day">
                                  <div class="text-subtitle-2">
                                    <v-btn
                                      icon
                                      color="primary"
                                      @click="
                                        addOpeningHoursEntry(
                                          day + ' ' + hourType + ' hours'
                                        )
                                      "
                                    >
                                      <v-icon>mdi-plus-circle</v-icon>
                                    </v-btn>
                                    {{ day }} {{ hourType }}
                                  </div>

                                  <v-chip
                                    class="ma-1"
                                    v-for="session in editedItem[
                                      day + ' ' + hourType + ' hours'
                                    ]
                                      ? editedItem[day + ' ' + hourType + ' hours'].split(
                                          ','
                                        )
                                      : ''"
                                    :key="session"
                                    small
                                    label
                                    close
                                    close-icon="mdi-delete"
                                    color="primary"
                                    @click:close="
                                      removeOpeningHoursEntry(
                                        day + ' ' + hourType + ' hours',
                                        session
                                      )
                                    "
                                    >{{ session }}</v-chip
                                  >
                                </div>
                              </v-col>
                            </v-row>
                          </v-tab-item>
                        </v-tabs>
                      </template>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="close">Cancel</v-btn>
                    <v-btn text color="success" @click="save">Ok</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                persistent
                overlay-opacity="0.2"
                content-class="elevation-0"
                v-model="dialogDelete"
                max-width="500px"
              >
                <v-card>
                  <v-card-title class="text-h5">Remove this library?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="closeDelete">Cancel</v-btn>
                    <v-btn text color="error" @click="deleteItemConfirm">Ok</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog
                persistent
                overlay-opacity="0.2"
                content-class="elevation-0"
                v-model="dialogOpeningHoursEntry"
                max-width="500px"
              >
                <v-card>
                  <v-card-title class="text-h5">Add opening hours session</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          ref="openingHoursOpenMenu"
                          v-model="openingHoursOpenMenuOpen"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="openingHoursOpen"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              outlined
                              rounded
                              v-model="openingHoursOpen"
                              label="Open"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-model="openingHoursOpen"
                            full-width
                            @click:minute="
                              $refs.openingHoursOpenMenu.save(openingHoursOpen)
                            "
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          ref="openingHoursCloseMenu"
                          v-model="openingHoursCloseMenuOpen"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="openingHoursClose"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              dense
                              outlined
                              rounded
                              v-model="openingHoursClose"
                              label="Close"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-model="openingHoursClose"
                            full-width
                            @click:minute="
                              $refs.openingHoursCloseMenu.save(openingHoursClose)
                            "
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="closeOpeningHoursEntry"
                      >Cancel</v-btn
                    >
                    <v-btn text color="success" @click="confirmOpeningHoursEntry"
                      >Ok</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <file-upload
              v-bind:file="libraryFiles"
              v-on:change-files="libraryFiles = $event"
              v-on:delete-file="libraryFiles = []"
            />
            <v-btn
              class="ma-2"
              text
              color="primary"
              :disabled="libraryFiles.length === 0"
              v-on:click="loadLibraries"
              >Load libraries
            </v-btn>
          </template>
        </v-data-table>
        <v-btn
          :disabled="libraryFiles.length === 0"
          text
          color="success"
          @click="download"
          >Save file</v-btn
        >
      </v-container>
    </section>
  </div>
</template>

<script>
import FileUpload from "../components/FileUpload";
import Header from "../components/Header";

import * as csvHelper from "../helpers/csv";
import * as Papa from "papaparse";

const config = require("../helpers/config.json");

import * as schema from "../helpers/validate";

export default {
  data() {
    return {
      library_services: config.library_services,
      library_form_active: false,
      libraryFiles: [],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      openingHourTypes: ["staffed", "unstaffed"],
      dialogMainLibrary: false,
      dialogOpeningHours: false,
      dialogDelete: false,
      dialogOpeningHoursEntry: false,
      openingHoursOpenMenuOpen: false,
      openingHoursCloseMenuOpen: false,
      openingHoursEditKey: null,
      openingHoursOpen: null,
      openingHoursClose: null,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "Library name"
        },
        {
          text: "Address 1",
          align: "start",
          value: "Address 1"
        },
        { text: "Postcode", value: "Postcode" },
        { text: "Statutory", value: "Statutory" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      libraries: [],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {
        "Local authority": "",
        "Library name": "",
        "Address 1": "",
        "Address 2": "",
        "Address 3": "",
        Postcode: "",
        "Unique property reference number": "",
        Statutory: "",
        "Type of library": "LAL",
        "Year opened": "",
        "Year closed": "",
        "Monday staffed hours": "",
        "Tuesday staffed hours": "",
        "Wednesday staffed hours": "",
        "Thursday staffed hours": "",
        "Friday staffed hours": "",
        "Saturday staffed hours": "",
        "Sunday staffed hours": "",
        "Monday unstaffed hours": "",
        "Tuesday unstaffed hours": "",
        "Wednesday unstaffed hours": "",
        "Thursday unstaffed hours": "",
        "Friday unstaffed hours": "",
        "Saturday unstaffed hours": "",
        "Sunday unstaffed hours": "",
        "Special hours": "",
        Colocated: "",
        "Colocated with": "",
        Notes: "",
        URL: "",
        "Email address": ""
      }
    };
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.libraries.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogMainLibrary = true;
    },
    deleteItem(item) {
      this.editedIndex = this.libraries.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.libraries.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialogMainLibrary = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    addOpeningHoursEntry(key) {
      this.openingHoursEditKey = key;
      this.dialogOpeningHoursEntry = true;
    },
    removeOpeningHoursEntry(key, session) {
      var sessions = this.editedItem[key].split(",");
      sessions.splice(sessions.indexOf(session), 1);
      this.editedItem[key] = sessions.join(",");
      this.dialogOpeningHoursEntry = false;
    },
    closeOpeningHoursEntry() {
      this.dialogOpeningHoursEntry = false;
    },
    confirmOpeningHoursEntry() {
      var sessions = this.editedItem[this.openingHoursEditKey].split(",");
      sessions.push(`${this.openingHoursOpen}-${this.openingHoursClose}`);
      this.editedItem[this.openingHoursEditKey] = sessions.join(",");
      this.dialogOpeningHoursEntry = false;
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.libraries[this.editedIndex], this.editedItem);
      } else {
        this.libraries.push(this.editedItem);
      }
      this.close();
    },
    loadLibraries: async function () {
      let self = this;
      if (self.libraryFiles[0].name) {
        const data = await csvHelper.parseFile(self.libraryFiles[0], true);
        this.libraries = data;
      }
    },
    download() {
      this.downloadFile("libraries.csv", this.libraries);
    },
    downloadFile: function (filename, data) {
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
    "custom-header": Header,
    "file-upload": FileUpload
  }
};
</script>
<style scoped>
</style>
