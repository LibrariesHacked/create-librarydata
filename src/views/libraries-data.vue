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

    <h2 class="text-h5 text-decoration-underline my-3">Edit library locations</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">
      <v-alert class="my-2" icon="mdi-numeric-1-circle"
        text="Choose a local authority to view the libraries within that area."></v-alert>

      <service-select v-on:change="loadLibraries($event)" />

      <v-alert class="my-2" icon="mdi-numeric-2-circle" text="To make changes select the edit icon for each library.
        Changes are not saved until you publish changes."></v-alert>

      <v-card color="grey-lighten-2" variant="outlined" elevation="0">
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
                  <v-container>
                    <v-tabs align-tabs="center" v-model="editTabs">
                      <v-tab :value="1">Details</v-tab>
                      <v-tab :value="2">Address</v-tab>
                      <v-tab :value="3">Hours</v-tab>
                    </v-tabs>
                    <v-window v-model="editTabs">
                      <v-window-item :key="1" :value="1">
                        <v-container fluid>
                          <v-row dense>
                            <v-col cols="12">
                              <v-text-field variant="outlined" density="compact" v-model="editedItem.Library_name"
                                label="Name"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="8" md="8">
                              <v-select v-model="editedItem.Type_of_library" :items="libraryTypes" variant="outlined"
                                density="compact" item-title="text" item-value="value" label="Type"></v-select>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                              <v-select variant="outlined" density="compact" v-model="editedItem.Statutory"
                                :items="['Yes', 'No']" label="Statutory"></v-select>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Year_opened"
                                label="Year opened" type="number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Year_closed"
                                label="Year closed" type="number"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Email_address"
                                label="Email address"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.URL"
                                label="Website"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea rows="2" density="compact" variant="outlined" v-model="editedItem.Notes"
                                label="Notes" clearable persistent-clear full-width></v-textarea>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-window-item>
                      <v-window-item :key="2" :value="2">
                        <v-container fluid>
                          <v-row dense>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Address_1"
                                label="Address 1"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Address_2"
                                label="Address 2"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Address_3"
                                label="Address 3"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field density="compact" variant="outlined" v-model="editedItem.Postcode"
                                label="Postcode"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field density="compact" variant="outlined"
                                v-model="editedItem.Unique_property_reference_number"
                                label="Unique property reference number"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-window-item>
                      <v-window-item :key="3" :value="3">
                        <v-container fluid>
                          <v-row dense>
                            <v-col cols="12" sm="6" md="6" v-for="hourType in openingHourTypes" :key="hourType">
                              <h4 class="text-subtitle">{{ hourType }}</h4>
                              <div v-for="day in days" :key="day" class="ma-2">
                                <v-divider/>
                                <div class="text-subtitle-2">
                                  {{ day }}
                                  <v-btn variant="tonal" icon="mdi-plus-circle" size="x-small" color="success" v-on:click="addOpeningHoursEntry(
                                    day + '_' + hourType.toLowerCase() + '_hours'
                                  )">
                                  </v-btn>
                                </div>

                                <v-chip class="ma-1" v-for="session in editedItem[
                                  day + '_' + hourType.toLowerCase() + '_hours'
                                ]
                                  ? editedItem[
                                    day + '_' + hourType.toLowerCase() + '_hours'
                                  ].split(',')
                                  : ''" :key="session" small label close close-icon="mdi-delete" color="success"
                                  v-on:click:close="removeOpeningHoursEntry(
                                      day + '_' + hourType.toLowerCase() + '_hours',
                                      session
                                    )
                                    ">{{ session }}</v-chip>

                              </div>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-window-item>
                    </v-window>
                  </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="plain" v-on:click="close" append-icon="mdi-close-circle">
                      Cancel
                    </v-btn>
                    <v-btn variant="tonal" color="success" v-on:click="save" append-icon="mdi-check-circle">
                      Ok
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog persistent overlay-opacity="0.1" content-class="elevation-0" v-model="dialogDelete"
                max-width="500px">
                <v-card>
                  <v-card-title>Remove library?</v-card-title>
                  <v-card-text>
                    This action will remove the library. If the library has closed it
                    should not be removed. The closed year can be entered in the library
                    details to mark it as closed and retain the details.
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn variant="plain" v-on:click="closeDelete" append-icon="mdi-close-circle">
                      Cancel
                    </v-btn>
                    <v-btn variant="tonal" color="warning" v-on:click="deleteItemConfirm" append-icon="mdi-delete">
                      Remove
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog persistent overlay-opacity="0.3" content-class="elevation-0" v-model="dialogOpeningHoursEntry"
                max-width="500px">
                <v-card>
                  <v-card-title>Add opening hours session</v-card-title>
                  <v-card-text>
                    <v-row dense>
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
                    <v-btn variant="plain" v-on:click="closeOpeningHoursEntry">Cancel</v-btn>
                    <v-btn variant="tonal" color="success" v-on:click="confirmOpeningHoursEntry">Ok</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex">
              <v-icon class="mr-2" v-on:click="editItem(item.raw)"> mdi-pencil </v-icon>
              <v-icon v-on:click="deleteItem(item.raw)">mdi-delete</v-icon>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <v-alert class="my-2" icon="mdi-numeric-3-circle">
        To finish you can save a copy of the data to your computer. If you are logged in
        with access to edit the library authority data, you can overwrite the existing
        data by selecting <strong>Publish changes</strong>.
      </v-alert>

      <v-btn :disabled="!isEditing" size="large" variant="tonal" color="info" append-icon="mdi-content-save"
        v-on:click="download">
        Save local copy
      </v-btn>

      <v-btn :disabled="!isEditing" size="large" variant="tonal" color="success" class="ma-2"
        append-icon="mdi-cloud-upload" v-on:click="publishChanges">
        Publish changes
      </v-btn>

      <v-dialog v-model="successDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="text-h5">Success</v-card-title>
          <v-card-text>Your changes have been published. Thank you</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="successDialog = false"> Close </v-btn>
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
            <v-btn color="secondary" text @click="errorDialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
  </v-container>
</template>

<script>
import Header from '../components/layout-header'
import ServiceSelect from '../components/service-select'

import * as Papa from 'papaparse'
import * as schemaHelper from '../helpers/schemas'

import Markdown from '../components/markdown-section'
import MarkDownData from '../markdown/librariesdata.md'

const config = require('../helpers/config.json')

export default {
  beforeMount() {
    window.addEventListener('beforeunload', event => {
      if (!this.isEditing) return
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ''
    })
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav)
  },
  data() {
    return {
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      openingHourTypes: ['Staffed', 'Unstaffed'],
      dialogMainLibrary: false,
      dialogOpeningHours: false,
      dialogDelete: false,
      dialogOpeningHoursEntry: false,
      editedIndex: -1,
      editTabs: 1,
      editedItem: {},
      defaultItem: {
        Local_authority: '',
        Library_name: '',
        Address_1: '',
        Address_2: '',
        Address_3: '',
        Postcode: '',
        Unique_property_reference_number: '',
        Statutory: '',
        Type_of_library: 'LAL',
        Year_opened: '',
        Year_closed: '',
        Monday_staffed_hours: '',
        Tuesday_staffed_hours: '',
        Wednesday_staffed_hours: '',
        Thursday_staffed_hours: '',
        Friday_staffed_hours: '',
        Saturday_staffed_hours: '',
        Sunday_staffed_hours: '',
        Monday_unstaffed_hours: '',
        Tuesday_unstaffed_hours: '',
        Wednesday_unstaffed_hours: '',
        Thursday_unstaffed_hours: '',
        Friday_unstaffed_hours: '',
        Saturday_unstaffed_hours: '',
        Sunday_unstaffed_hours: '',
        Special_hours: '',
        Colocated: '',
        Colocated_with: '',
        Notes: '',
        URL: '',
        Email_address: ''
      },
      errorDialog: false,
      headers: [
        {
          title: 'Name',
          align: 'start',
          value: 'Library_name'
        },
        { title: 'Closed', value: 'Year_closed' },
        {
          title: 'Address 1',
          align: 'start',
          value: 'Address_1'
        },
        { title: 'Postcode', value: 'Postcode' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      isEditing: false,
      libraries: [],
      libraryTypes: config.library_types,
      loadingServiceData: false,
      mdText: MarkDownData,
      openingHoursOpenMenuOpen: false,
      openingHoursCloseMenuOpen: false,
      openingHoursEditKey: null,
      openingHoursOpen: null,
      openingHoursClose: null,
      selectedService: null,
      successDialog: false
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.libraries.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogMainLibrary = true
    },
    deleteItem(item) {
      this.editedIndex = this.libraries.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.isEditing = true
      this.libraries.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close() {
      this.dialogMainLibrary = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedItem.Local_authority = this.selectedService.name
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    addOpeningHoursEntry(key) {
      this.openingHoursEditKey = key
      this.dialogOpeningHoursEntry = true
    },
    removeOpeningHoursEntry(key, session) {
      var sessions = this.editedItem[key].split(',').filter(x => x.length > 0)
      sessions.splice(sessions.indexOf(session), 1)
      this.editedItem[key] = sessions.join(',')
      this.dialogOpeningHoursEntry = false
    },
    closeOpeningHoursEntry() {
      this.dialogOpeningHoursEntry = false
    },
    confirmOpeningHoursEntry() {
      var sessions = this.editedItem[this.openingHoursEditKey]
        .split(',')
        .filter(x => x.length > 0)
      sessions.push(`${this.openingHoursOpen}-${this.openingHoursClose}`)
      this.editedItem[this.openingHoursEditKey] = sessions.join(',')
      this.dialogOpeningHoursEntry = false
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.libraries[this.editedIndex], this.editedItem)
      } else {
        this.libraries.push(this.editedItem)
      }
      this.close()
    },
    loadLibraries: async function (service) {
      this.selectedService = service
      this.loadingServiceData = true
      let self = this
      const libraries = await schemaHelper.getSchemaData('libraries', service.code)
      libraries.forEach((e, i) => {
        Object.keys(e).forEach(key => {
          let val = e[key]
          let newKey = key.replace(/\s+/g, '_')
          delete libraries[i][key]
          libraries[i][newKey] = val
        })
      })
      self.libraries = libraries
      this.loadingServiceData = false
    },
    download() {
      let service = this.selectedService
      this.downloadFile(`${service.code}_libraries.csv`, this.libraries)
    },
    downloadFile: function (filename, data) {
      var csv = new Blob([Papa.unparse(data)], {
        type: 'text/csv;charset=utf-8;'
      })
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csv, filename)
      } else {
        //In FF link must be added to DOM to be clicked
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(csv)
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    publishChanges: async function () {
      let librariesToPublish = JSON.parse(JSON.stringify(this.libraries))
      librariesToPublish.forEach((e, i) => {
        Object.keys(e).forEach(key => {
          let val = e[key]
          let newKey = key.replace(/_/g, ' ')
          delete librariesToPublish[i][key]
          librariesToPublish[i][newKey] = val
        })
      })
      const csvData = new Blob([Papa.unparse(librariesToPublish)], {
        type: 'text/csv;charset=utf-8;'
      })
      const saveResult = await schemaHelper.saveSchemaFile(
        'libraries',
        this.selectedService.code,
        csvData,
        this.$store.state.loginKey
      )
      if (saveResult) {
        this.successDialog = true
      } else {
        this.errorDialog = true
      }
    },
    preventNav(event) {
      if (!this.isEditing) return
      event.preventDefault()
      event.returnValue = ''
    }
  },
  components: {
    'layout-header': Header,
    'service-select': ServiceSelect,
    'markdown-section': Markdown
  }
}
</script>
<style scoped></style>
