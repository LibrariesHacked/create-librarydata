<template>
  <div>
    <custom-header
      title="Libraries"
      subtitle="Public library opening hours, types, and contact details"
    />
    <section>
      <v-container>
        <vue-markdown-plus :source="mdText"></vue-markdown-plus>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-stepper v-model="active_step" flat outlined elevation="0">
          <v-stepper-header class="elevation-0">
            <v-stepper-step :complete="active_step > 1" step="1" color="primary" editable>
              {{
                this.selected_service
                  ? this.selected_service.name
                  : "Select library service"
              }}
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="active_step > 2"
              :editable="active_step > 2"
              step="2"
              color="primary"
            >
              Edit
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="active_step > 3" step="3" color="primary">
              Publish
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-content step="1">
            <v-container>
              <v-alert border="left" icon="mdi-school-outline" text type="success">
                Get started by choosing a library service from the list. UK library
                services are listed in alphabetical order.
              </v-alert>
              <service-select v-on:change="selected_service = $event" />
              <v-btn
                color="primary"
                outlined
                large
                :loading="loadingServiceData"
                :disabled="selected_service == null"
                v-on:click="loadLibraries"
              >
                Edit library data
                <v-icon right>mdi-chevron-right-circle-outline</v-icon>
              </v-btn>
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-container>
              <v-alert border="left" icon="mdi-school-outline" text type="success">
                Select fields to change their values. For extended editing of library
                details, use the edit icon in the actions column.
              </v-alert>
              <v-data-table
                :headers="headers"
                :items="libraries"
                sort-by="name"
                disable-sort
                :loading="loadingServiceData"
                loading-text="Loading... Please wait"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-dialog
                      persistent
                      v-model="dialogMainLibrary"
                      max-width="500px"
                      overlay-opacity="0.3"
                      content-class="elevation-0"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn text color="success" v-bind="attrs" v-on="on">
                          <v-icon left dark>mdi-plus-circle-outline</v-icon>
                          Add library
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-text>
                          <v-container>
                            <template>
                              <v-tabs>
                                <v-tab>Library</v-tab>
                                <v-tab>Location</v-tab>
                                <v-tab>Opening hours</v-tab>
                                <v-tab-item>
                                  <v-container></v-container>
                                  <v-row>
                                    <v-col cols="12">
                                      <v-text-field
                                        outlined
                                        v-model="editedItem.Library_name"
                                        label="Name"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="8" md="8">
                                      <v-select
                                        v-model="editedItem.Type_of_library"
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
                                      ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="4">
                                      <v-select
                                        v-model="editedItem.Statutory"
                                        :items="['Yes', 'No']"
                                        label="Statutory"
                                        dense
                                        outlined
                                      ></v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="editedItem.Year_opened"
                                        label="Year opened"
                                        type="number"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="editedItem.Year_closed"
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
                                        v-model="editedItem.Email_address"
                                        label="Email address"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="editedItem.URL"
                                        label="Website"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-textarea
                                        dense
                                        outlined
                                        v-model="editedItem.Notes"
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
                                        v-model="editedItem.Address_1"
                                        label="Address 1"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="editedItem.Address_2"
                                        label="Address 2"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="editedItem.Address_3"
                                        label="Address 3"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="editedItem.Postcode"
                                        label="Postcode"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        dense
                                        outlined
                                        v-model="
                                          editedItem.Unique_property_reference_number
                                        "
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
                                            v-on:click="
                                              addOpeningHoursEntry(
                                                day + '_' + hourType + '_hours'
                                              )
                                            "
                                          >
                                            <v-icon>mdi-plus-circle-outline</v-icon>
                                          </v-btn>
                                          {{ day }} {{ hourType }}
                                        </div>

                                        <v-chip
                                          class="ma-1"
                                          v-for="session in editedItem[
                                            day + '_' + hourType + '_hours'
                                          ]
                                            ? editedItem[
                                                day + '_' + hourType + '_hours'
                                              ].split(',')
                                            : ''"
                                          :key="session"
                                          small
                                          label
                                          close
                                          close-icon="mdi-delete"
                                          color="primary"
                                          v-on:click:close="
                                            removeOpeningHoursEntry(
                                              day + '_' + hourType + '_hours',
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
                          <v-btn text color="accent" v-on:click="close">
                            <v-icon left>mdi-close-circle-outline</v-icon>
                            Cancel
                          </v-btn>
                          <v-btn text color="success" v-on:click="save">
                            <v-icon left>mdi-check-circle-outline</v-icon>
                            Ok
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      persistent
                      overlay-opacity="0.3"
                      content-class="elevation-0"
                      v-model="dialogDelete"
                      max-width="500px"
                    >
                      <v-card>
                        <v-card-title>Remove this library?</v-card-title>
                        <v-card-text>
                          <p>
                            This will completely remove this library from the dataset.
                          </p>
                          <p>
                            If the library has closed it does not need to be removed. The
                            closed year should be entered in the library details.
                          </p>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text color="accent" v-on:click="closeDelete">
                            <v-icon left>mdi-close-circle-outline</v-icon>
                            Cancel
                          </v-btn>
                          <v-btn text color="error" v-on:click="deleteItemConfirm">
                            <v-icon left>mdi-delete-outline</v-icon>
                            Delete
                          </v-btn>
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      persistent
                      overlay-opacity="0.3"
                      content-class="elevation-0"
                      v-model="dialogOpeningHoursEntry"
                      max-width="500px"
                    >
                      <v-card>
                        <v-card-title>Add opening hours session</v-card-title>
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
                                  v-on:click:minute="
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
                                  v-on:click:minute="
                                    $refs.openingHoursCloseMenu.save(openingHoursClose)
                                  "
                                ></v-time-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text color="accent" v-on:click="closeOpeningHoursEntry"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="success"
                            v-on:click="confirmOpeningHoursEntry"
                            >Ok</v-btn
                          >
                          <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template v-slot:item.Library_name="{ item }">
                  <v-edit-dialog large :return-value.sync="item.Library_name">
                    {{ item.Library_name }}
                    <template v-slot:input>
                      <p>
                        <br />
                        <v-text-field
                          outlined
                          v-model="item.Library_name"
                          label="Name"
                        ></v-text-field>
                      </p>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.Year_closed="{ item }">
                  <v-edit-dialog large :return-value.sync="item.Year_closed">
                    {{ item.Year_closed }}
                    <template v-slot:input>
                      <p>
                        <br />
                        <v-text-field
                          outlined
                          v-model="item.Year_closed"
                          label="Year closed"
                          type="number"
                        ></v-text-field>
                      </p>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.Type_of_library="{ item }">
                  <v-edit-dialog large :return-value.sync="item.Type_of_library">
                    {{ item.Type_of_library }}
                    <template v-slot:input>
                      <p>
                        <br />
                        <v-select
                          v-model="item.Type_of_library"
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
                        ></v-select>
                      </p>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.Address_1="{ item }">
                  <v-edit-dialog large :return-value.sync="item.Address_1">
                    {{ item.Address_1 }}
                    <template v-slot:input>
                      <p>
                        <br />
                        <v-text-field
                          dense
                          outlined
                          v-model="item.Address_1"
                          label="Address 1"
                        ></v-text-field>
                      </p>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.Postcode="{ item }">
                  <v-edit-dialog large :return-value.sync="item.Postcode">
                    {{ item.Postcode }}
                    <template v-slot:input>
                      <p>
                        <br />
                        <v-text-field
                          dense
                          outlined
                          v-model="item.Postcode"
                          label="Postcode"
                        ></v-text-field>
                      </p>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.Statutory="{ item }">
                  <v-edit-dialog large :return-value.sync="item.Statutory">
                    {{ item.Statutory }}
                    <template v-slot:input>
                      <p>
                        <br />
                        <v-select
                          v-model="item.Statutory"
                          :items="['Yes', 'No']"
                          label="Statutory"
                          dense
                          outlined
                        ></v-select>
                      </p>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex">
                    <v-icon class="mr-2" v-on:click="editItem(item)">
                      mdi-pencil-outline
                    </v-icon>
                    <v-icon v-on:click="deleteItem(item)">mdi-delete-outline</v-icon>
                  </div>
                </template>
                <template v-slot:no-data></template>
              </v-data-table>
              <v-btn outlined large color="primary" v-on:click="goToPublish">
                Publish the data
                <v-icon right dark>mdi-chevron-right-circle-outline</v-icon>
              </v-btn>
            </v-container>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-container>
              <v-alert border="left" icon="mdi-school-outline" text type="success">
                You can save a copy of the edited data to your computer in CSV format. If
                you are logged in on behalf of the library, you can overwrite the
                currently stored version of the data.
              </v-alert>
            </v-container>
            <v-btn outlined large color="primary" v-on:click="download" class="ma-2">
              Save file
              <v-icon right dark>mdi-content-save-outline</v-icon>
            </v-btn>
            <v-btn outlined large color="primary" v-on:click="publishChanges">
              Publish changes
              <v-icon right dark>mdi-cloud-upload-outline</v-icon>
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </section>
  </div>
</template>

<script>
import Header from "../components/Header";
import ServiceSelect from "../components/ServiceSelect";

import * as Papa from "papaparse";
import * as schemaHelper from "../helpers/schemas";

import MarkDownData from "../markdown/librariesdata.md";
import VueMarkdownPlus from "vue-markdown-plus";

export default {
  data() {
    return {
      active_step: 1,
      loadingServiceData: false,
      selected_service: null,
      mdText: MarkDownData,
      library_form_active: false,
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
          value: "Library_name"
        },
        { text: "Closed", value: "Year_closed" },
        {
          text: "Type",
          align: "start",
          value: "Type_of_library"
        },
        {
          text: "Address 1",
          align: "start",
          value: "Address_1"
        },
        { text: "Postcode", value: "Postcode" },
        { text: "Statutory", value: "Statutory" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      libraries: [],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {
        Local_authority: "",
        Library_name: "",
        Address_1: "",
        Address_2: "",
        Address_3: "",
        Postcode: "",
        Unique_property_reference_number: "",
        Statutory: "",
        Type_of_library: "LAL",
        Year_opened: "",
        Year_closed: "",
        Monday_staffed_hours: "",
        Tuesday_staffed_hours: "",
        Wednesday_staffed_hours: "",
        Thursday_staffed_hours: "",
        Friday_staffed_hours: "",
        Saturday_staffed_hours: "",
        Sunday_staffed_hours: "",
        Monday_unstaffed_hours: "",
        Tuesday_unstaffed_hours: "",
        Wednesday_unstaffed_hours: "",
        Thursday_unstaffed_hours: "",
        Friday_unstaffed_hours: "",
        Saturday_unstaffed_hours: "",
        Sunday_unstaffed_hours: "",
        Special_hours: "",
        Colocated: "",
        Colocated_with: "",
        Notes: "",
        URL: "",
        Email_address: ""
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
        this.editedItem.Local_authority = this.selected_service.name;
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
      var sessions = this.editedItem[key].split(",").filter(x => x.length > 0);
      sessions.splice(sessions.indexOf(session), 1);
      this.editedItem[key] = sessions.join(",");
      this.dialogOpeningHoursEntry = false;
    },
    closeOpeningHoursEntry() {
      this.dialogOpeningHoursEntry = false;
    },
    confirmOpeningHoursEntry() {
      var sessions = this.editedItem[this.openingHoursEditKey].split(",").filter(x => x.length > 0);
      sessions.push(`${this.openingHoursOpen}-${this.openingHoursClose}`);
      this.editedItem[this.openingHoursEditKey] = sessions.join(",");
      this.dialogOpeningHoursEntry = false;
    },
    goToPublish() {
      this.active_step = 3;
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
      this.loadingServiceData = true;
      let self = this;
      let service = this.selected_service;
      const libraries = await schemaHelper.getSchemaData("libraries", service.code);
      libraries.forEach((e, i) => {
        Object.keys(e).forEach((key) => {
          let val = e[key];
          let newKey = key.replace(/\s+/g, "_");
          delete libraries[i][key];
          libraries[i][newKey] = val;
        });
      });
      self.libraries = libraries;
      self.active_step = 2;
      this.loadingServiceData = false;
    },
    download() {
      let service = this.selected_service;
      this.downloadFile(`${service.code}_libraries.csv`, this.libraries);
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
    },
    publishChanges: async function () {
      let service = this.selected_service;
      const csvData = new Blob([Papa.unparse(this.libraries)], {
        type: "text/csv;charset=utf-8;"
      });
      const save = await schemaHelper.saveSchemaFile(
        "libraries",
        service.code,
        csvData,
        this.$store.state.loginKey
      );
    }
  },
  components: {
    "custom-header": Header,
    "service-select": ServiceSelect,
    VueMarkdownPlus
  }
};
</script>
<style scoped>
</style>
