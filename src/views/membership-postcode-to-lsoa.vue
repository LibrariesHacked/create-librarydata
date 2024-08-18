<template>
  <v-container>
    <layout-header
      title="Postcode converter"
      subtitle="Convert postcodes to statistical areas"
    />

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

    <h2 class="text-h5 text-decoration-underline my-3">Convert postcodes</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">
      <v-alert icon="mdi-numeric-1-circle" class="mb-1" title="Load postcodes">
        First you need a CSV file of postcodes. If your data isn't in CSV format
        try using <strong>Save as</strong> in your software. The first row
        should be column headings. One column should contain UK postcodes.
      </v-alert>

      <file-upload
        v-bind:files="files"
        v-on:change-files="confirmFile($event)"
      />

      <v-alert
        class="mt-8 mb-4"
        icon="mdi-numeric-2-circle"
        title="Select file options"
      >
        Column headings in your file are displayed below. Choose which column
        contains postcodes. If your data includes counts per postcode, select
        the field holding the count.
      </v-alert>

      <v-select
        color="success"
        v-model="postcodeColumn"
        :items="columns"
        label="Select postcode field"
        variant="outlined"
        :disabled="columns.length === 0"
      ></v-select>

      <v-select
        color="success"
        :value="countsColumn"
        :items="columns.filter(c => c !== postcodeColumn)"
        :disabled="
          postcodeColumn === '' ||
          columns.filter(c => c !== postcodeColumn).length === 0
        "
        label="Count field (optional)"
        variant="outlined"
      ></v-select>

      <v-btn
        color="info"
        variant="tonal"
        size="large"
        v-on:click="confirmOptions"
        :disabled="postcodeColumn === ''"
        append-icon="mdi-chevron-right-circle"
      >
        Convert
      </v-btn>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-3-circle" title="Results">
        Valid postcodes are changed to their statistical area code. Postcodes
        that are no longer valid are changed to
        <strong>Terminated</strong>. Postcodes not recognised are changed to
        <strong>Unknown</strong>.<br />
      </v-alert>

      <span v-if="endTime !== null">
        <p class="mb-2">
          {{ 'Completed in ' + getTimeCompleted() }}
        </p>

        <v-card
          color="grey-lighten-2"
          variant="outlined"
          elevation="0"
          class="mb-2"
        >
          <v-data-table
            no-filter
            :headers="summaryColumns"
            :items="summaryData"
            item-key="total"
          >
            <template #bottom></template>
          </v-data-table>
        </v-card>

        <v-btn
          color="info"
          variant="tonal"
          size="large"
          v-on:click="downloadConvertedFile"
          append-icon="mdi-content-save"
        >
          Save converted file
        </v-btn>
      </span>

      <v-alert
        class="mt-8 mb-4"
        icon="mdi-numeric-4-circle"
        title="Library membership data"
      >
        Census geographies are required to publish
        <a href="https://schema.librarydata.uk/membership" target="_blank"
          >library membership data</a
        >. This tool has calculated a count of members per statistical area.
        Select the name of your library service and choose a date the postcodes
        were extracted from your library management system
      </v-alert>

      <span v-if="endTime !== null">
        <service-select v-on:select="authority = $event" />

        <v-text-field
          class="mt-4"
          variant="outlined"
          v-model="extractDate"
          label="Count date"
          prepend-inner-icon="mdi-calendar"
          type="date"
        ></v-text-field>

        <v-btn
          variant="tonal"
          color="success"
          v-on:click="downloadSchemaFile"
          size="large"
          append-icon="mdi-content-save"
          :disabled="authority === '' || extractDate === null"
          >Save membership data</v-btn
        >
      </span>
    </v-sheet>

    <v-dialog v-model="loading" persistent width="300">
      <v-card>
        <v-card-title> Please wait </v-card-title>
        <v-card-text>
          <v-progress-linear indeterminate color="info"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'
import MarkDownData from '../markdown/membershippostcodetolsoa.md?raw'
import ServiceSelect from '../components/ServiceSelect.vue'

import moment from 'moment'

import { saveAs } from 'file-saver'

import * as Papa from 'papaparse'
import * as csvHelper from '../helpers/csv'
import * as postcodeHelper from '../helpers/postcode'

export default {
  data () {
    return {
      authority: null,
      columns: [],
      countsColumn: '',
      csvData: [],
      endTime: null,
      extractDate: null,
      files: [],
      loading: false,
      lsoasCounted: {},
      mdText: MarkDownData,
      postcodeColumn: '',
      startTime: null,
      summaryColumns: [
        { key: 'total', title: 'Total' },
        { key: 'converted', title: 'Successful' },
        { key: 'terminated', title: 'Terminated' },
        { key: 'unknown', title: 'Unknown' }
      ],
      summaryData: [{ total: 0, converted: 0, terminated: 0, unknown: 0 }]
    }
  },
  methods: {
    confirmFile: async function (files) {
      this.files = files
      const self = this
      self.loading = true
      if (self.files.length > 0) {
        const data = await csvHelper.parseFile(self.files[0], false)
        self.columns = data[0]
        self.csvData = data
        self.loading = false
      } else {
        self.columns = []
        self.csvData = []
        self.loading = false
      }
    },
    confirmOptions: function () {
      const self = this
      self.startTime = moment()
      self.loading = true
      // First get all the postcodes
      self.summaryData[0].total = 0
      self.summaryData[0].converted = 0
      self.summaryData[0].unknown = 0
      self.summaryData[0].terminated = 0
      self.lsoasCounted = { Unknown: 0 }
      const postcodeColumnIndex = self.columns.indexOf(self.postcodeColumn)
      const countsColumnIndex = self.columns.indexOf(this.countsColumn)
      const postcodes = self.csvData
        .map(row => row[postcodeColumnIndex])
        .filter(p => p != null && p !== self.postcodeColumn)
      postcodeHelper.extractLsoaLookupFromPostcodes(
        postcodes,
        postcodeLookup => {
          self.csvData.forEach((row, idx) => {
            const postcode = row[postcodeColumnIndex]
            const stripped = postcode.replace(/\s/g, '')
            if (idx === 0 && postcode === self.postcodeColumn) {
              // This is the header row
              row[postcodeColumnIndex] = 'LSOA'
            } else {
              // This is a postcode row
              this.summaryData[0].total++
              let lsoa = ''
              if (postcode && postcode !== '' && postcodeLookup[stripped]) {
                lsoa = postcodeLookup[stripped]
                if (lsoa === 'Terminated') {
                  row[postcodeColumnIndex] = 'Terminated'
                  this.summaryData[0].terminated++
                } else if (lsoa === 'Unknown') {
                  row[postcodeColumnIndex] = 'Unknown'
                  this.summaryData[0].unknown++
                } else {
                  // We have a valid lookup
                  row[postcodeColumnIndex] = lsoa
                  this.summaryData[0].converted++
                }
              } else {
                row[postcodeColumnIndex] = 'Unknown'
                this.summaryData[0].unknown++
                lsoa = 'Unknown'
              }
              if (lsoa === 'Terminated') lsoa = 'Unknown'
              // Ensure our lookup count has the lsoa key value
              if (!this.lsoasCounted[lsoa]) this.lsoasCounted[lsoa] = 0
              if (this.countsColumn !== '') {
                // if count column use that
                this.lsoasCounted[lsoa] =
                  this.lsoasCounted[lsoa] + parseInt(row[countsColumnIndex])
              } else {
                // else just add one
                this.lsoasCounted[lsoa]++
              }
            }
          })
          self.active_step = 3
          this.loading = false
          this.endTime = moment()
        }
      )
    },
    downloadConvertedFile: function () {
      this.downloadFile('converted.csv', this.csvData)
    },
    downloadSchemaFile: async function () {
      const membershipData = [
        ['Local authority', 'Count date', 'Area code', 'Members']
      ]
      const dateString = moment(this.extractDate).format('YYYY-MM-DD')
      Object.keys(this.lsoasCounted)
        .filter(k => k !== 'Unknown' && k !== 'Terminated')
        .forEach(lsoa => {
          const count = this.lsoasCounted[lsoa]
          membershipData.push([
            this.authority.name,
            dateString,
            lsoa,
            count > 4 ? count.toString() : 'x'
          ])
        })
      const count = this.lsoasCounted.Unknown
      // Push unknown and terminated (all as unknown)
      if (this.lsoasCounted.Unknown > 0) {
        membershipData.push([
          this.authority.name,
          dateString,
          'Unknown',
          count > 4 ? count.toString() : 'x'
        ])
      }
      this.downloadFile('membership.csv', membershipData)
    },
    downloadFile: function (filename, data) {
      const blob = new Blob([Papa.unparse(data)], {
        type: 'text/plain;charset=utf-8'
      })
      saveAs(blob, filename)
    },
    getTimeCompleted: function () {
      if (this.startTime && this.endTime) {
        const diff = this.endTime.diff(this.startTime)
        const duration = moment.duration(diff)
        return moment.utc(duration.as('milliseconds')).format('HH:mm:ss')
      }
      return ''
    }
  },
  components: {
    'file-upload': FileUpload,
    'service-select': ServiceSelect
  }
}
</script>

<style scoped></style>
