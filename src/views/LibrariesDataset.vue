<template>
  <div class="home">
    <custom-header
      title="Libraries dataset"
      subtitle="Create and maintain data about your libraries"
    />
    <div class="container">
      <file-upload
        v-bind:file="file"
        v-on:upload-file="file = $event"
        v-on:delete-file="file = null"
      />
      <hr />
      <b-table :data="data" :columns="columns"> </b-table>
    </div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false">
      <b-icon icon="autorenew" size="is-large" custom-class="mdi-spin"></b-icon>
    </b-loading>
    <custom-footer />
  </div>
</template>

<script>
import FileUploadButton from "../components/FileUploadButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

import * as Papa from "papaparse";

export default {
  data() {
    return {
      loading: false,
      active_step: 0,
      file: null,
      data: [],
      columns: [
        {
          field: "local_authority",
          label: "Local authority"
        },
        {
          field: "library_name",
          label: "Library name"
        },
        {
          field: "address_1",
          label: "Address 1"
        },
        {
          field: "address_2",
          label: "Address 2"
        },
        {
          field: "address_3",
          label: "Address 3"
        }
      ]
    };
  },
  methods: {
    confirmFile: async function() {},
    confirmOptions: function() {},
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
    "file-upload": FileUploadButton,
    "custom-header": Header
  }
};
</script>
