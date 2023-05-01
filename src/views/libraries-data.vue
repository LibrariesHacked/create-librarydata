<template>
  <v-container>
    <layout-header title="Libraries" subtitle="Public library locations, hours, and contact details" />
    <p class="text-center">
      <v-btn size="x-large" prepend-icon="mdi-information-outline" variant="tonal" color="info"
        href="https://schema.librarydata.uk/libraries" target="_blank">
        Library locations data schema
      </v-btn>
    </p>

    <markdown-section :markdownText="mdText" />

    <v-divider inset color="info" class="my-2"></v-divider>

    <h2 class="text-h5 text-decoration-underline my-3">Edit libraries data</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">

      <v-alert class="my-2" icon="mdi-numeric-1-circle"
        text="First, choose a local authority to see libraries within that area."></v-alert>

      <service-select v-on:change="loadLibraries($event)" />

      <v-alert class="my-2" icon="mdi-numeric-2-circle" text="To edit library data, select the edit icon for each library.
        Changes are not saved until you select to publish changes."></v-alert>

      <v-card color="grey-lighten-2" variant="outlined" elevation="0" class="mx-4 my-4">

        <v-data-table hover items-per-page="5"
          no-data-text="To load library data ensure you select a local authority in Step 1." :headers="headers"
          :items="libraries" :sort-by="[{ key: 'Library_name', order: 'asc' }]" class="elevation-0">
          <template #top>
            <v-toolbar flat color="grey-lighten-5">
              <v-spacer></v-spacer>
              <v-dialog persistent v-model="dialogMainLibrary" max-width="500px" overlay-opacity="0.3"
                content-class="elevation-0">
                <template v-slot:activator="{ props }">
                  <v-btn :disabled="selectedService === null" v-bind="props" variant="tonal" color="success"
                    prepend-icon="mdi-plus-circle">
                    Add library
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <v-container>
                      <v-tabs>
                        <v-tab>Library</v-tab>
                        <v-tab>Location</v-tab>
                        <v-tab>Opening hours</v-tab>
                        <v-tab-item>
                          <v-container></v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field outlined v-model="editedItem.Library_name" label="Name"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="8" md="8">
                              <v-select v-model="editedItem.Type_of_library" label="Type" :items="[
                                  { text: 'Local authority', value: 'LAL' },
                                  {
                                    text: 'Local authority (unstaffed)',
                                    value: 'LAL-'
                                  },
                                  { text: 'Commisioned', value: 'CL' },
                                  { text: 'Community-run', value: 'CRL' },
                                  { text: 'Independent', value: 'ICL' }
                                ]" dense outlined></v-select>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                              <v-select v-model="editedItem.Statutory" :items="['Yes', 'No']" label="Statutory" dense
                                outlined></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Year_opened" label="Year opened"
                                type="number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Year_closed" label="Year closed"
                                type="number"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Email_address"
                                label="Email address"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.URL" label="Website"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea dense outlined v-model="editedItem.Notes" label="Notes" full-width></v-textarea>
                            </v-col>
                          </v-row>
                        </v-tab-item>
                        <v-tab-item>
                          <v-container></v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Address_1"
                                label="Address 1"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Address_2"
                                label="Address 2"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Address_3"
                                label="Address 3"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field dense outlined v-model="editedItem.Postcode" label="Postcode"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field dense outlined v-model="editedItem.Unique_property_reference_number
                                " label="Unique property reference number"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-tab-item>
                        <v-tab-item>
                          <v-container></v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6" v-for="hourType in openingHourTypes" :key="hourType">
                              <div v-for="day in days" :key="day">
                                <div class="text-subtitle-2">
                                  <v-btn icon color="success" v-on:click="addOpeningHoursEntry(
                                      day + '_' + hourType + '_hours'
                                    )
                                    ">
                                    <v-icon>mdi-plus-circle-outline</v-icon>
                                  </v-btn>
                                  {{ day }} {{ hourType }}
                                </div>

                                <v-chip class="ma-1" v-for="session in editedItem[
                                  day + '_' + hourType + '_hours'
                                ]
                                  ? editedItem[
                                    day + '_' + hourType + '_hours'
                                  ].split(',')
                                  : ''" :key="session" small label close close-icon="mdi-delete" color="success"
                                  v-on:click:close="removeOpeningHoursEntry(
                                      day + '_' + hourType + '_hours',
                                      session
                                    )
                                    ">{{ session }}</v-chip>
                              </div>
                            </v-col>
                          </v-row>
                        </v-tab-item>
                      </v-tabs>
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
              <v-dialog persistent overlay-opacity="0.3" content-class="elevation-0" v-model="dialogDelete"
                max-width="500px">
                <v-card>
                  <v-card-title>Remove this library?</v-card-title>
                  <v-card-text>
                    <p>
                      This will remove this library from the dataset.
                    </p>
                    <p>
                      If the library has closed it should not be removed. The
                      closed year can be entered in the library details to mark it as closed.
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="tonal" color="accent" v-on:click="closeDelete">
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
              <v-dialog persistent overlay-opacity="0.3" content-class="elevation-0" v-model="dialogOpeningHoursEntry"
                max-width="500px">
                <v-card>
                  <v-card-title>Add opening hours session</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu ref="openingHoursOpenMenu" v-model="openingHoursOpenMenuOpen"
                          :close-on-content-click="false" :nudge-right="40" :v-model:return-value="openingHoursOpen"
                          transition="scale-transition" offset-y max-width="290px" min-width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-bind="attrs" dense outlined v-model="openingHoursOpen" label="Open" readonly
                              v-on="on"></v-text-field>
                          </template>
                          <v-time-picker v-model="openingHoursOpen" full-width v-on:click:minute="$refs.openingHoursOpenMenu.save(openingHoursOpen)
                            "></v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu ref="openingHoursCloseMenu" v-model="openingHoursCloseMenuOpen"
                          :close-on-content-click="false" :nudge-right="40" :v-model:return-value="openingHoursClose"
                          transition="scale-transition" offset-y max-width="290px" min-width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-bind="attrs" dense outlined v-model="openingHoursClose" label="Close" readonly
                              v-on="on"></v-text-field>
                          </template>
                          <v-time-picker v-model="openingHoursClose" full-width v-on:click:minute="$refs.openingHoursCloseMenu.save(openingHoursClose)
                            "></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="accent" v-on:click="closeOpeningHoursEntry">Cancel</v-btn>
                    <v-btn text color="success" v-on:click="confirmOpeningHoursEntry">Ok</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.Library_name`]="{ item }">
            <v-edit-dialog large :v-model:return-value="item.Library_name">
              {{ item.Library_name }}
              <template v-slot:input>
                <p>
                  <br />
                  <v-text-field outlined v-model="item.Library_name" label="Name"></v-text-field>
                </p>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Year_closed`]="{ item }">
            <v-edit-dialog large :v-model:return-value="item.Year_closed">
              {{ item.Year_closed }}
              <template v-slot:input>
                <p>
                  <br />
                  <v-text-field outlined v-model="item.Year_closed" label="Year closed" type="number"></v-text-field>
                </p>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Type_of_library`]="{ item }">
            <v-edit-dialog large :v-model:return-value="item.Type_of_library">
              {{ item.Type_of_library }}
              <template v-slot:input>
                <p>
                  <br />
                  <v-select v-model="item.Type_of_library" label="Type" :items="[
                      { text: 'Local authority', value: 'LAL' },
                      {
                        text: 'Local authority (unstaffed)',
                        value: 'LAL-'
                      },
                      { text: 'Commisioned', value: 'CL' },
                      { text: 'Community-run', value: 'CRL' },
                      { text: 'Independent', value: 'IL' }
                    ]" dense outlined></v-select>
                </p>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Address_1`]="{ item }">
            <v-edit-dialog large :v-model:return-value="item.Address_1">
              {{ item.Address_1 }}
              <template v-slot:input>
                <p>
                  <br />
                  <v-text-field dense outlined v-model="item.Address_1" label="Address 1"></v-text-field>
                </p>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Postcode`]="{ item }">
            <v-edit-dialog large :v-model:return-value="item.Postcode">
              {{ item.Postcode }}
              <template v-slot:input>
                <p>
                  <br />
                  <v-text-field dense outlined v-model="item.Postcode" label="Postcode"></v-text-field>
                </p>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.Statutory`]="{ item }">
            <v-edit-dialog large :v-model:return-value="item.Statutory">
              {{ item.Statutory }}
              <template v-slot:input>
                <p>
                  <br />
                  <v-select v-model="item.Statutory" :items="['Yes', 'No']" label="Statutory" dense outlined></v-select>
                </p>
              </template>
            </v-edit-dialog>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex">
              <v-icon class="mr-2" v-on:click="editItem(item)">
                mdi-pencil-outline
              </v-icon>
              <v-icon v-on:click="deleteItem(item)">mdi-delete-outline</v-icon>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <v-alert class="my-2" icon="mdi-numeric-3-circle">
        To finish you can save a copy of the data to your computer in CSV format. If you are
        logged in with access to edit the library authority data, you can also
        overwrite the existing data by selecting <strong>Publish changes</strong>.
      </v-alert>

      <v-btn :disabled="!isEditing" size="large" variant="tonal" color="info" class="ma-2" append-icon="mdi-content-save"
        v-on:click="download">
        Save local copy
      </v-btn>

      <v-btn :disabled="!isEditing" size="large" variant="tonal" color="success" append-icon="mdi-cloud-upload"
        v-on:click="publishChanges">
        Publish changes
      </v-btn>

      <v-dialog v-model="successDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="text-h5">Success</v-card-title>
          <v-card-text>Your changes have been published. Thank you</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="successDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="errorDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="text-h5">Sorry</v-card-title>
          <v-card-text>
            Your changes failed to publish - please contact info@librarieshacked.org
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="errorDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-sheet>
  </v-container>
</template>

<script>
import Header from "../components/layout-header";
import ServiceSelect from "../components/service-select";

import * as Papa from "papaparse";
import * as schemaHelper from "../helpers/schemas";

import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/librariesdata.md";

export default {
  beforeMount() {
    window.addEventListener("beforeunload", event => {
      if (!this.isEditing) return
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ""
    })
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventNav);
  },
  data() {
    return {
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
      },
      errorDialog: false,
      headers: [
        {
          title: "Name",
          align: "start",
          value: "Library_name"
        },
        { title: "Closed", value: "Year_closed" },
        {
          title: "Type",
          align: "start",
          value: "Type_of_library"
        },
        {
          title: "Address 1",
          align: "start",
          value: "Address_1"
        },
        { title: "Postcode", value: "Postcode" },
        { title: "Statutory", value: "Statutory" },
        { title: "Actions", key: "actions", sortable: false }
      ],
      isEditing: false,
      libraries: [],
      library_form_active: false,
      loadingServiceData: false,
      mdText: MarkDownData,
      openingHoursOpenMenuOpen: false,
      openingHoursCloseMenuOpen: false,
      openingHoursEditKey: null,
      openingHoursOpen: null,
      openingHoursClose: null,
      selectedService: null,
      successDialog: false
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
      this.isEditing = true;
      this.libraries.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialogMainLibrary = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem.Local_authority = this.selectedService.name;
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
      var sessions = this.editedItem[key].split(",").filter((x) => x.length > 0);
      sessions.splice(sessions.indexOf(session), 1);
      this.editedItem[key] = sessions.join(",");
      this.dialogOpeningHoursEntry = false;
    },
    closeOpeningHoursEntry() {
      this.dialogOpeningHoursEntry = false;
    },
    confirmOpeningHoursEntry() {
      var sessions = this.editedItem[this.openingHoursEditKey]
        .split(",")
        .filter((x) => x.length > 0);
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
    loadLibraries: async function (service) {
      this.selectedService = service;
      this.loadingServiceData = true;
      let self = this;
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
      this.loadingServiceData = false;
    },
    download() {
      let service = this.selectedService;
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
      let librariesToPublish = JSON.parse(JSON.stringify(this.libraries));
      librariesToPublish.forEach((e, i) => {
        Object.keys(e).forEach((key) => {
          let val = e[key];
          let newKey = key.replace(/_/g, " ");
          delete librariesToPublish[i][key];
          librariesToPublish[i][newKey] = val;
        });
      });
      const csvData = new Blob([Papa.unparse(librariesToPublish)], {
        type: "text/csv;charset=utf-8;"
      });
      const saveResult = await schemaHelper.saveSchemaFile(
        "libraries",
        this.selectedService.code,
        csvData,
        this.$store.state.loginKey
      );
      if (saveResult) {
        this.successDialog = true;
      } else {
        this.errorDialog = true;
      }
    },
    preventNav(event) {
      if (!this.isEditing) return
      event.preventDefault()
      event.returnValue = ""
    }
  },
  components: {
    "layout-header": Header,
    "service-select": ServiceSelect,
    "markdown-section": Markdown
  }
};
</script>
<style scoped></style>
