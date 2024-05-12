<template>
  <v-container>
    <layout-header
      title="Membership map"
      subtitle="Insights from library membership data"
    />

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

    <h2 class="text-h5 text-decoration-underline my-3">Map library members</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">
      <v-alert icon="mdi-numeric-1-circle" class="mb-1" title="Load a file">
        This tool loads CSV files in the format of the membership data schema.
      </v-alert>

      <file-upload
        v-bind:files="lsoaFiles"
        v-on:change-files="lsoaFiles = $event"
        v-on:delete-file="lsoaFiles = null"
      />

      <v-btn
        append-icon="mdi-map-marker-plus"
        color="info"
        class="mt-3"
        variant="tonal"
        size="large"
        v-on:click="addMembershipData"
        :disabled="lsoaFiles.length == 0"
      >
        Add to map
      </v-btn>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-2-circle" title="Map">
        <strong>Population percentage</strong> shades the map to highlight
        concentration of membership. When zooming in in also displays the
        membership population percentage.
        <strong>Areas of deprivation</strong> shades the map to highlight highly
        deprived areas. Uses the index of multiple deprivation for each area. 1
        represents highly deprived areas, 10 the least deprived.
      </v-alert>

      <v-radio-group
        v-model="mapDisplay"
        v-on:change="setDisplayOptions"
        inline
      >
        <v-radio
          label="Display population percentage"
          value="populationPercentage"
        ></v-radio>
        <v-radio label="Display areas of deprivation" value="imd"></v-radio>
      </v-radio-group>

      <v-container class="map">
        <mgl-map
          ref="mglMap"
          :center="center"
          :zoom="zoom"
          :mapStyle="mapStyle"
        >
          <mgl-fullscreen-control />
          <mgl-navigation-control />
          <mgl-scale-control />
          <mgl-vector-source
            source-id="libraries"
            :tiles="librariesSource.tiles"
          >
            <mgl-circle-layer
              source-layer="libraries"
              layer-id="libraries_layer_circles"
              :paint="librariesLayerCircle.paint"
            />
          </mgl-vector-source>
          <mgl-vector-source
            source-id="lsoas"
            :tiles="lsoasSource.tiles"
            :promoteId="lsoasSource.promoteId"
          >
            <mgl-fill-layer
              source-layer="lsoa_boundaries"
              layer-id="lsoas_layer_fill"
              :paint="lsoasLayerFill.paint"
              :filter="matchFilter"
            />
            <mgl-symbol-layer
              source-layer="lsoa_boundaries"
              layer-id="lsoas_layer_label"
              :paint="lsoasLayerLabel.paint"
              :layout="lsoasLayerLabel.layout"
              :filter="matchFilter"
              :minzoom="lsoasLayerLabel.minzoom"
            />
          </mgl-vector-source>
          <mgl-geo-json-source
            source-id="authority"
            :data="authoritySource.data"
          >
            <mgl-line-layer
              v-if="authoritySource.show"
              layer-id="authority-line"
              :paint="authorityLayerLine.paint"
            />
            <mgl-symbol-layer
              v-if="authoritySource.show"
              layer-id="authority-label"
              :layout="authorityLayerLabel.layout"
              :paint="authorityLayerLabel.paint"
            />
          </mgl-geo-json-source>
        </mgl-map>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<script>
import MarkDownData from '../markdown/membershipmap.md?raw'

import '../extensions/strings'

import FileUpload from '../components/FileUpload.vue'

import * as colorbrewer from 'colorbrewer'

import bbox from '@turf/bbox'

import * as csvHelper from '../helpers/csv'
import * as libraryAuthoritiesHelper from '../helpers/libraryAuthorities'

import * as config from '../helpers/config.json'

export default {
  data () {
    return {
      authoritySource: {
        data: {
          type: 'FeatureCollection',
          features: []
        },
        show: false
      },
      authorityLayerLine: {
        type: 'line',
        minzoom: 10,
        paint: {
          'line-color': '#697B89',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 22, 8]
        }
      },
      authorityLayerLabel: {
        type: 'symbol',
        layout: {
          'text-field': ['to-string', ['get', 'utla19nm']],
          'text-font': ['Open Sans Bold'],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
          'symbol-placement': 'line',
          'text-max-angle': 90,
          'text-size': {
            base: 1.2,
            stops: [
              [10, 8],
              [22, 48]
            ]
          },
          'text-line-height': 1
        },
        paint: {
          'text-color': '#697B89',
          'text-halo-color': '#fafaf8',
          'text-halo-width': 2
        }
      },
      center: [-2, 52],
      zoom: 7,
      librariesSource: {
        tiles: [config.libraries_tiles]
      },
      librariesLayerCircle: {
        filter: ['!', ['has', 'Year closed']],
        'source-layer': 'libraries',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2, 18, 10],
          'circle-color': '#1b5e20',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            1,
            18,
            4
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            0.8,
            18,
            1
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            0.4,
            18,
            0.9
          ]
        }
      },
      lsoaFiles: [],
      lsoasSource: {
        tiles: [config.lsoa_tiles],
        promoteId: { lsoa_boundaries: 'code' },
        show: false
      },
      lsoasLayerFill: {
        paint: {
          'fill-color': 'rgba(254, 113, 144, 1)',
          'fill-opacity': 0.5
        }
      },
      lsoasLayerLabel: {
        minzoom: 12,
        layout: {
          'text-field': ['to-string', ['get', 'code']],
          'text-font': ['Source Sans Pro SemiBold'],
          'symbol-placement': 'point',
          'text-size': {
            base: 1.2,
            stops: [
              [12, 14],
              [22, 48]
            ]
          },
          'text-line-height': 1
        },
        paint: {
          'text-color': '#697B89',
          'text-halo-color': '#fafaf8',
          'text-halo-width': 1
        }
      },
      matchColourLsoaPopulation: 'rgba(254, 113, 144, 1)',
      matchColourLsoaDeprivation: 'rgba(254, 113, 144, 1)',
      matchFilter: ['in', ['get', 'code'], ['literal', []]],
      mapDisplay: 'populationPercentage',
      mapStyle: 'https://zoomstack.librarydata.uk/light.json',
      minZoom: 5,
      maxZoom: 16,
      matchFieldLsoaPopulation: ['to-string', ['get', 'code']],
      matchFieldLsoaDeprivation: ['to-string', ['get', 'code']],
      mdText: MarkDownData
    }
  },
  methods: {
    addMembershipData: async function () {
      const self = this
      if (self.lsoaFiles[0].name) {
        const data = await csvHelper.parseFile(self.lsoaFiles[0], false)
        this.setLsoaFields(data.slice(1))
        const authority =
          await libraryAuthoritiesHelper.getLibraryAuthorityByName(data[1][0])
        const geojson = JSON.parse(authority.geojson)
        this.authoritySource.data = geojson
        this.authoritySource.show = true
        const bounds = bbox(geojson)
        this.$refs.mglMap.map.fitBounds(bounds, { padding: 10 })
      }
    },
    setDisplayOptions: function () {
      if (this.mapDisplay === 'populationPercentage') {
        this.lsoasLayerFill.paint['fill-color'] = this.matchColourLsoaPopulation
        this.lsoasLayerLabel.layout['text-field'] =
          this.matchFieldLsoaPopulation
        this.$refs.mglMap.map.setPaintProperty(
          'lsoas_layer_fill',
          'fill-color',
          this.matchColourLsoaPopulation
        )
        this.$refs.mglMap.map.setLayoutProperty(
          'lsoas_layer_label',
          'text-field',
          this.matchFieldLsoaPopulation
        )
      }
      if (this.mapDisplay === 'imd') {
        this.lsoasLayerFill.paint['fill-color'] =
          this.matchColourLsoaDeprivation
        this.lsoasLayerLabel.layout['text-field'] =
          this.matchFieldLsoaDeprivation
        this.$refs.mglMap.map.setPaintProperty(
          'lsoas_layer_fill',
          'fill-color',
          this.matchColourLsoaDeprivation
        )
        this.$refs.mglMap.map.setLayoutProperty(
          'lsoas_layer_label',
          'text-field',
          this.matchFieldLsoaDeprivation
        )
      }
    },
    setLsoaFields: function (lsoas) {
      const filters = []
      const matchFieldLsoaPopulation = ['match', ['get', 'code']]
      const matchFieldLsoaDeprivation = ['match', ['get', 'code']]

      lsoas.forEach(lsoa => {
        const members = parseInt(lsoa[3].replace('x', '2'))
        this.$refs.mglMap.map.setFeatureState(
          {
            source: 'lsoas',
            sourceLayer: 'lsoa_boundaries',
            id: lsoa[2]
          },
          {
            members: members
          }
        )

        filters.push(lsoa[2])
        matchFieldLsoaPopulation.push(lsoa[2])
        matchFieldLsoaPopulation.push([
          'concat',
          [
            'to-string',
            [
              'round',
              ['*', ['/', members, ['to-number', ['get', 'population']]], 100]
            ]
          ],
          '%'
        ])
        matchFieldLsoaDeprivation.push(lsoa[2])
        matchFieldLsoaDeprivation.push(['get', 'imd'])
      })

      matchFieldLsoaPopulation.push('')
      matchFieldLsoaDeprivation.push('')

      const estimatedMinPopulationPercentage = Math.floor(
        Math.min(
          ...lsoas.map(lsoa => {
            return (parseInt(lsoa[3].replace('x', '2')) / 1500) * 100
          })
        )
      )

      const estimatedMaxPopulationPercentage = Math.ceil(
        Math.max(
          ...lsoas
            .filter(lsoa => lsoa[3] <= 1500)
            .map(lsoa => {
              return (parseInt(lsoa[3].replace('x', '2')) / 1500) * 100
            })
        )
      )

      // From the min and max, create 10 deciles
      const percentageDeciles = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(decile => {
        return Math.round(
          estimatedMinPopulationPercentage +
            (estimatedMaxPopulationPercentage -
              estimatedMinPopulationPercentage) *
              (decile / 10)
        )
      })

      const decilesPlusColourFlattened = percentageDeciles.map(
        (decile, index) => {
          return [decile, colorbrewer.default.OrRd[9][index]]
        }
      )

      const matchColourLsoaPopulation = [
        'interpolate',
        ['linear'],
        [
          'round',
          [
            '*',
            [
              '/',
              ['to-number', ['feature-state', 'members']],
              ['to-number', ['get', 'population']]
            ],
            100
          ]
        ],
        ...decilesPlusColourFlattened.flat()
      ]

      const matchColourLsoaDeprivation = [
        'interpolate',
        ['linear'],
        ['to-number', ['get', 'imd']],
        1,
        colorbrewer.default.OrRd[9][8],
        2,
        colorbrewer.default.OrRd[9][7],
        3,
        colorbrewer.default.OrRd[9][6],
        4,
        colorbrewer.default.OrRd[9][5],
        5,
        colorbrewer.default.OrRd[9][4],
        6,
        colorbrewer.default.OrRd[9][3],
        7,
        colorbrewer.default.OrRd[9][2],
        8,
        colorbrewer.default.OrRd[9][1],
        9,
        colorbrewer.default.OrRd[9][0],
        10,
        colorbrewer.default.OrRd[9][0]
      ]

      // Only show where lsoas exist in data
      const matchFilter = ['in', ['get', 'code'], ['literal', filters]]
      this.matchFilter = matchFilter

      this.$refs.mglMap.map.setFilter('lsoas_layer_fill', matchFilter)
      this.$refs.mglMap.map.setFilter('lsoas_layer_label', matchFilter)

      // Store permanent definitions
      this.matchFieldLsoaPopulation = matchFieldLsoaPopulation
      this.matchFieldLsoaDeprivation = matchFieldLsoaDeprivation
      this.matchColourLsoaPopulation = matchColourLsoaPopulation
      this.matchColourLsoaDeprivation = matchColourLsoaDeprivation

      this.setDisplayOptions()
    }
  },
  components: {
    'file-upload': FileUpload
  }
}
</script>

<style>
.map {
  position: relative;
  height: 500px;
  width: 100%;
  border: 1px solid #e5e5e5;
  padding: 0;
}
</style>
