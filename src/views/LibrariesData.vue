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
                  v-model="dialog"
                  max-width="500px"
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
                              v-model="editedItem['Library name']"
                              label="Library name"
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
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="closeDelete">Cancel</v-btn>
                      <v-btn text @click="deleteItemConfirm">OK</v-btn>
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
              <br />
              <v-btn
                depressed
                color="primary"
                :disabled="libraryFiles.length === 0"
                v-on:click="loadLibraries"
                >Load libraries
              </v-btn>
            </template>
          </v-data-table>

          <v-btn>Save libraries</v-btn>
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
          value: '1',
        },
        {
          text: 'Address 1',
          align: 'start',
          value: '2',
        },
        { text: 'Postcode', value: '5' },
        { text: 'Statutory', value: '7' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      libraries: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    };
  },
  methods: {
    loadLibraries: async function() {
      let self = this;
      if (self.libraryFiles[0].name) {
        const data = await csvHelper.parseFile(self.libraryFiles[0]);
        this.libraries = data.splice(1);
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
