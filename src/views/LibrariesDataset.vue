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
      <div class="table-container">
        <b-table
          class="table is-narrow libraries-table"
          :data="data"
          :columns="columns"
        >
        </b-table>
      </div>
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
        },
        {
          field: "postcode",
          label: "Postcode"
        },
        {
          field: "statutory",
          label: "Statutory"
        },
        {
          field: "type_of_library",
          label: "Type of library"
        },
        {
          field: "year_opened",
          label: "Year opened"
        },
        {
          field: "year_closed",
          label: "Year closed"
        },
        {
          field: "",
          label: "Address 3"
        },
        {
          field: "address_3",
          label: "Address 3"
        },
        {
          field: "address_3",
          label: "Address 3"
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
<style>
.libraries-table table {
  border-collapse: collapse !important;
  background: #f9f9f9;
}

.libraries-table td {
  border: 1px solid #e5e5e5 !important;
}

.libraries-table th {
  border: 1px solid #e5e5e5 !important;
  font-weight: 700 !important;
  font-size: 0.9em !important;
  color: #7a7a7a !important;
}
</style>
