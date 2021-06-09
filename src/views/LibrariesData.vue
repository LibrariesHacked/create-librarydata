<template>
  <div>
    <custom-header
      title="Library locations"
      subtitle="Create and maintain data about your library buildings."
    />
    <section>
      <v-container>
          <v-data-table
            :headers="headers"
            :items="libraries"
            sort-by="name"
          >
            <template v-slot:top>
              <v-toolbar
                flat
              >
                <v-spacer></v-spacer>
                <v-dialog
                  persistent
                  v-model="dialog"
                  max-width="500px"
                  overlay-opacity="0.2"
                  content-class="elevation-0"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      Add library
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem['Local authority']"
                              label="Local authority"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem['Library name']"
                              label="Library name"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem['Unique property reference number']"
                              label="UPRN"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem['Address 1']"
                              label="Address 1"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem['Address 2']"
                              label="Address 2"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                          >
                            <v-text-field
                              v-model="editedItem['Address 3']"
                              label="Address 3"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        @click="close"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog persistent overlay-opacity="0.2"
                  content-class="elevation-0" v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">Remove this library?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="closeDelete">Cancel</v-btn>
                      <v-btn text color="error" @click="deleteItemConfirm">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
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
          <v-btn text>Save libraries</v-btn>
      </v-container>
    </section>
  </div>
</template>

<script>
import FileUpload from "../components/FileUpload";
import Header from "../components/Header";

import * as csvHelper from "../helpers/csv";
import * as Papa from "papaparse";

export default {
  data() {
    return {
      library_form_active: false,
      libraryFiles: [],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'Library name',
        },
        {
          text: 'Address 1',
          align: 'start',
          value: 'Address 1',
        },
        { text: 'Postcode', value: 'Postcode' },
        { text: 'Statutory', value: 'Statutory' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      libraries: [],
      editedIndex: -1,
      editedItem: {
      
      },
      defaultItem: {
        "Local authority": "",
        "Library name": "",
        "Address 1": "",
        "Address 2": "",
        "Address 3": "",
        "Postcode": "",
        "Unique property reference number": "",
        "Statutory": "",
        "Type of library": "",
        "Year opened": "",
        "Year closed": "",
        "Monday hours": "",
        "Tuesday hours": "",
        "Wednesday hours": "",
        "Thursday hours": "",
        "Friday hours": "",
        "Saturday hours": "",
        "Sunday hours": "",
        "Special hours": "",
        "Colocated": "",
        "Colocated with": "",
        "Notes": "",
        "URL": "",
        "Email address": ""
      },
    };
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.libraries.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
        this.editedIndex = this.libraries.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.libraries.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    loadLibraries: async function() {
      let self = this;
      if (self.libraryFiles[0].name) {
        const data = await csvHelper.parseFile(self.libraryFiles[0], true);
        this.libraries = data;
      }
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
    "custom-header": Header,
    "file-upload": FileUpload,
  }
};
</script>
<style scoped>
</style>
