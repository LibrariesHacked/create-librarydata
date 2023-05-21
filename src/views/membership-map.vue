<template>
  <v-container>
    <layout-header title="Membership map" subtitle="Insights from library membership data" />

    <v-divider inset color="info" class="my-2"></v-divider>
    <markdown-section :markdownText="mdText" />
    <v-divider inset color="info" class="my-2"></v-divider>

    <h2 class="text-h5 text-decoration-underline my-3">Map library members</h2>

    <v-sheet color="grey-lighten-5" rounded elevation="0" class="px-5 py-5">
      <v-alert icon="mdi-numeric-1-circle" class="mb-1" title="Load a file">
        This tool loads CSV files in the format of the membership data schema.
      </v-alert>

      <file-upload v-bind:files="lsoaFiles" v-on:change-files="lsoaFiles = $event" v-on:delete-file="lsoaFiles = null" />

      <v-btn append-icon="mdi-plus" color="info" class="mt-3" variant="tonal" size="large" v-on:click="addMembershipData" :disabled="lsoaFiles.length == 0">
        Add members to map
      </v-btn>

      <v-alert class="mt-8 mb-4" icon="mdi-numeric-2-circle" title="Map">
        <strong>Population percentage</strong> shades the map to highlight concentration of membership. When zooming in in
        also displays the membership population percentage.
        <strong>Areas of deprivation</strong> shades the map to highlight highly deprived areas. Uses the index of
        multiple deprivation for each area. 1 represents highly deprived areas, 10 the least deprived.
      </v-alert>

      <v-radio-group v-model="mapDisplay" v-on:change="setDisplayOptions" row>
        <v-radio label="Display population percentage" value="populationPercentage"></v-radio>
        <v-radio label="Display areas of deprivation" value="imd"></v-radio>
      </v-radio-group>

      <v-container class="map">
        <mgl-map :center="center" :zoom="zoom" :mapStyle="mapStyle">
          <mgl-fullscreen-control />
          <mgl-navigation-control />
          <mgl-scale-control />
          <mgl-vector-source source-id="libraries" :tiles="librariesSourceTiles">
            <mgl-circle-layer source-layer="libraries" layer-id="libraries" :paint="librariesLayerCircles.paint" />
          </mgl-vector-source>
          <mgl-geojson-source v-if="authoritySource != null" source-id="authority" :data="authoritySource">
            <mgl-line-layer source-layer="authority" layer-id="authority" :paint="authorityLayerLine.paint" />
            <mgl-symbol-layer source-layer="authority" layer-id="authority-label" :layout="authorityLayerLabel.layout"
              :paint="authorityLayerLabel.paint" />
          </mgl-geojson-source>
        </mgl-map>
      </v-container>
    </v-sheet>
  </v-container>
</template>

<script>
import Markdown from "../components/markdown-section";
import MarkDownData from "../markdown/membershipmap.md";

import "../extensions/strings";

import FileUpload from "../components/file-upload";

import Header from "../components/layout-header";

const config = require('../helpers/config.json');

import * as colorbrewer from "colorbrewer";

import bbox from "@turf/bbox";

import * as csvHelper from "../helpers/csv";
import * as libraryAuthoritiesHelper from "../helpers/libraryAuthorities";

export default {
  data() {
    return {
      authorityLayerLine: {
        type: "line",
        minzoom: 10,
        paint: {
          "line-color": "#697B89",
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 22, 8]
        }
      },
      authorityLayerLabel: {
        type: "symbol",
        layout: {
          "text-field": ["to-string", ["get", "utla19nm"]],
          "text-font": ["Open Sans Bold"],
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "symbol-placement": "line",
          "text-max-angle": 90,
          "text-size": {
            base: 1.2,
            stops: [
              [10, 8],
              [22, 48]
            ]
          },
          "text-line-height": 1
        },
        paint: {
          "text-color": "#697B89",
          "text-halo-color": "#fafaf8",
          "text-halo-width": 2
        }
      },
      authoritySource: null,
      center: [-2, 52],
      zoom: 7,
      librariesLayerCircles: {
        type: "circle",
        filter: ["!", ["has", "Year closed"]],
        "source-layer": "libraries",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 2, 18, 10],
          "circle-color": "#1b5e20",
          "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 18, 4],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.8, 18, 1],
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 5, 0.4, 18, 0.9]
        }
      },
      librariesSourceTiles: [config.libraries_tiles],
      lsoaFiles: [],
      lsoasLayerFill: {
        type: "fill",
        filter: ["in", ["get", "code"], ["literal", []]],
        "source-layer": "lsoa_boundaries",
        paint: {
          "fill-color": "rgba(254, 113, 144, 1)",
          "fill-opacity": 0.5
        }
      },
      lsoasLayerLabel: {
        type: "symbol",
        filter: ["in", ["get", "code"], ["literal", []]],
        "source-layer": "lsoa_boundaries",
        minzoom: 12,
        layout: {
          "text-field": ["to-string", ["get", "code"]],
          "text-font": ["Open Sans Bold"],
          "symbol-placement": "point",
          "text-size": {
            base: 1.2,
            stops: [
              [12, 14],
              [22, 48]
            ]
          },
          "text-allow-overlap": false,
          "text-line-height": 1
        },
        paint: {
          "text-color": "#697B89",
          "text-halo-color": "#fafaf8",
          "text-halo-width": 1
        }
      },
      lsoasSource: {
        type: "vector",
        id: "lsoa_boundaries",
        tiles: [config.lsoa_tiles],
        promoteId: { lsoa_boundaries: "code" }
      },
      matchColourLsoaPopulation: "rgba(254, 113, 144, 1)",
      matchColourLsoaDeprivation: "rgba(254, 113, 144, 1)",
      matchFilter: ["in", ["get", "code"], ["literal", []]],
      mapDisplay: "populationPercentage",
      mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      minZoom: 5,
      maxZoom: 16,
      matchFieldLsoaPopulation: ["to-string", ["get", "code"]],
      matchFieldLsoaDeprivation: ["to-string", ["get", "code"]],
      mdText: MarkDownData
    }
  },
  methods: {
    addMembershipData: async function (files) {
      let self = this;
      self.lsoaFiles = files;
      if (self.lsoaFiles[0].name) {
        const data = await csvHelper.parseFile(self.lsoaFiles[0], false);
        this.setLsoaFields(data.slice(1));
        const authority = await libraryAuthoritiesHelper.getLibraryAuthorityByName(
          data[1][0]
        );
        const geojson = JSON.parse(authority.geojson);
        this.authoritySource = { type: "geojson", data: geojson };
        this.authorityLayerLabel.layout["text-field"] = authority.utla19nm;
        var bounds = bbox(geojson);
        this.$refs.VMap.map.fitBounds(bounds, { padding: 10 });
      }
    },
    setDisplayOptions: function () {
      if (this.mapDisplay === "populationPercentage") {
        this.lsoasLayerFill.paint["fill-color"] = this.matchColourLsoaPopulation;
        this.lsoasLayerLabel.layout["text-field"] = this.matchFieldLsoaPopulation;
      }
      if (this.mapDisplay === "imd") {
        this.lsoasLayerFill.paint["fill-color"] = this.matchColourLsoaDeprivation;
        this.lsoasLayerLabel.layout["text-field"] = this.matchFieldLsoaDeprivation;
      }

      this.lsoasLayerFill.filter = this.matchFilter;
      this.lsoasLayerLabel.filter = this.matchFilter;
    },
    setLsoaFields: function (lsoas) {
      let filters = [];
      let matchFieldLsoaPopulation = ["match", ["get", "code"]];
      let matchFieldLsoaDeprivation = ["match", ["get", "code"]];

      lsoas.forEach((lsoa) => {
        const members = parseInt(lsoa[3].replace("x", "2"));
        this.$refs.mglMap.map.setFeatureState(
          {
            source: "lsoa_boundaries",
            sourceLayer: "lsoa_boundaries",
            id: lsoa[2]
          },
          {
            members: members
          }
        );

        filters.push(lsoa[2]);
        matchFieldLsoaPopulation.push(lsoa[2]);
        matchFieldLsoaPopulation.push([
          "concat",
          [
            "to-string",
            ["round", ["*", ["/", members, ["to-number", ["get", "population"]]], 100]]
          ],
          "%"
        ]);
        matchFieldLsoaDeprivation.push(lsoa[2]);
        matchFieldLsoaDeprivation.push(["get", "imd"]);
      });

      matchFieldLsoaPopulation.push("");
      matchFieldLsoaDeprivation.push("");

      let matchColourLsoaPopulation = [
        "interpolate",
        ["linear"],
        [
          "round",
          [
            "*",
            [
              "/",
              ["to-number", ["feature-state", "members"]],
              ["to-number", ["get", "population"]]
            ],
            100
          ]
        ],
        0,
        colorbrewer.default.OrRd[9][0],
        5,
        colorbrewer.default.OrRd[9][1],
        10,
        colorbrewer.default.OrRd[9][2],
        15,
        colorbrewer.default.OrRd[9][3],
        20,
        colorbrewer.default.OrRd[9][4],
        25,
        colorbrewer.default.OrRd[9][5],
        30,
        colorbrewer.default.OrRd[9][6],
        35,
        colorbrewer.default.OrRd[9][7],
        40,
        colorbrewer.default.OrRd[9][8]
      ];
      let matchColourLsoaDeprivation = [
        "interpolate",
        ["linear"],
        ["to-number", ["get", "imd"]],
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
      ];

      // Only show where lsoas exist in data
      let matchFilter = ["in", ["get", "code"], ["literal", filters]];
      this.matchFilter = matchFilter;

      // Store permanent definitions
      this.matchFieldLsoaPopulation = matchFieldLsoaPopulation;
      this.matchFieldLsoaDeprivation = matchFieldLsoaDeprivation;
      this.matchColourLsoaPopulation = matchColourLsoaPopulation;
      this.matchColourLsoaDeprivation = matchColourLsoaDeprivation;

      this.setDisplayOptions();
    }
  },
  components: {
    "layout-header": Header,
    "file-upload": FileUpload,
    "markdown-section": Markdown
  }
};
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
