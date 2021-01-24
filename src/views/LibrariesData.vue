<template>
  <div>
    <custom-header
      title="Libraries dataset"
      subtitle="Create and maintain data about your libraries."
    />
    <section>
      <div class="container">
        <div class="column">
          <b-button icon-left="upload">Load dataset</b-button>&nbsp;
          <b-button icon-left="download">Save dataset</b-button>&nbsp;
          <br />
          <br />
          <b-table
            class="libraries-table"
            detail-key="Library name"
            detailed
            ref="table"
            per-page="5"
            :data="data"
            :opened-detailed="defaultOpenedDetails"
            :show-detail-icon="showDetailIcon"
          >
            <template slot-scope="props">
              <b-table-column field="Library name" label="Library name">
                <template slot="header" slot-scope="{ column }">
                  <b-tooltip :label="column.label" dashed>
                    {{ column.label }}
                  </b-tooltip>
                </template>
                {{ props.row["Library name"] }}
              </b-table-column>
              <b-table-column field="Library name" label="Library name">
                {{ props.row["Library name"] }}
              </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
              <h2>{{ props.row["Library name"] }}</h2>
            </template>
          </b-table>
          <br />
          <b-button
            type="is-text"
            icon-left="plus"
            v-on:click="library_form_active = true"
            >Add library
          </b-button>
          <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false">
            <b-icon icon="autorenew" size="is-large" custom-class="mdi-spin"></b-icon>
          </b-loading>
        </div>
      </div>
    </section>
    <custom-footer />
    <b-modal has-modal-card :active.sync="library_form_active" :can-cancel="false">
      <modal-form>
        <div class="modal-card">
          <section class="modal-card-body">
            <!-- Content ... -->
          </section>
        </div>
      </modal-form>
    </b-modal>
  </div>
</template>

<script>
import Footer from "../components/Footer";
import Header from "../components/Header";

import * as Papa from "papaparse";

export default {
  data() {
    return {
      loading: false,
      active_step: 0,
      library_form_active: false,
      file: null,
      data: [
        {
          "Local authority": "Gloucestershire",
          "Library name": "Gloucester"
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
    "custom-header": Header
  }
};
</script>
<style>
.modal-card {
  border: 1px solid #ccc;
  border-radius: 6;
}

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
