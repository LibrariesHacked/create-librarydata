<template>
  <div>
    <custom-header title="Membership map" subtitle="Explore library membership data" />
    <section>
      <v-container>
        <p>
          You need library membership data in the
          <a href="https://schema.librarydata.uk/membership" target="_blank"
            >membership data schema format</a
          >. This can be created using the
          <a href="/postcode-to-lsoa" target="_blank"
            >postcode to statistical area converter</a
          >.
        </p>
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <v-container>
              <file-upload
                v-bind:file="lsoaFiles"
                v-on:change-files="lsoaFiles = $event"
                v-on:delete-file="lsoaFiles = null"
              />
              <br />
              <v-btn
                color="primary"
                :disabled="lsoaFiles.length === 0"
                v-on:click="addMembershipData"
                >Add members to map
              </v-btn>
            </v-container>
          </v-col>
          <v-col cols="12" sm="6">
            <v-container>
              <v-alert border="right" color="blue" text type="info">
                <p>
                  <b>Display options</b>
                </p>
                <ul>
                  <li>
                    <b>Population percentage</b>. Shades the map to highlight
                    concentration of membership. When zooming in in also displays the
                    membership population percentage.
                  </li>
                  <li>
                    <b>Areas of deprivation</b>. Shades the map to highlight highly
                    deprived areas. Uses the index of multiple deprivation for each area.
                    1 represents highly deprived areas, 10 the least deprived.
                  </li>
                </ul>
              </v-alert>
            </v-container>
          </v-col>
        </v-row>
        <v-radio-group v-model="mapDisplay" v-on:change="setDisplayOptions" row>
          <v-radio
            label="Display population percentage"
            value="populationPercentage"
          ></v-radio>
          <v-radio label="Display areas of deprivation" value="imd"></v-radio>
        </v-radio-group>
        <MglMap
          container="map-container"
          :minZoom="minZoom"
          :maxZoom="maxZoom"
          :center.sync="center"
          :mapStyle="mapStyle"
          :zoom.sync="zoom"
          ref="mglMap"
        >
          <MglVectorLayer
            sourceId="lsoa_boundaries"
            :source="lsoasSource"
            layerId="lsoa_boundaries_fill"
            :layer="lsoasLayerFill"
          />
          <MglVectorLayer
            sourceId="lsoa_boundaries"
            :source="lsoasSource"
            layerId="lsoa_boundaries_label"
            :layer="lsoasLayerLabel"
          />
          <MglNavigationControl position="bottom-right" />
          <MglFullscreenControl position="top-right" />
          <MglGeojsonLayer
            v-if="authoritySource !== null"
            sourceId="authority_boundary_source"
            :source="authoritySource"
            layerId="authority_boundary_line"
            :layer="authorityLayerLine"
          />
          <MglGeojsonLayer
            v-if="authoritySource !== null"
            sourceId="authority_boundary_source"
            :source="authoritySource"
            layerId="authority_boundary_label"
            :layer="authorityLayerLabel"
          />
        </MglMap>
      </v-container>
    </section>
  </div>
</template>

<script>
import "../extensions/strings";

import FileUpload from "../components/FileUpload";

import Header from "../components/Header";

const config = require("../helpers/config.json");

import * as colorbrewer from "colorbrewer";

import bbox from "@turf/bbox";

import * as csvHelper from "../helpers/csv";
import * as libraryAuthoritiesHelper from "../helpers/libraryAuthorities";

import {
  MglMap,
  MglFullscreenControl,
  MglNavigationControl,
  MglGeojsonLayer,
  MglVectorLayer
} from "vue-mapbox";

export default {
  created() {
    this.map = null;
  },
  data() {
    return {
      map: null,
      mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [-2, 52],
      zoom: 7,
      minZoom: 5,
      maxZoom: 14,
      mapDisplay: "populationPercentage",
      authoritySource: null,
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
      lsoaFiles: [],
      lsoasSource: {
        type: "vector",
        tiles: [config.lsoa_tiles],
        promoteId: { lsoa_boundaries: "code" }
      },
      matchFilter: ["in", ["get", "code"], ["literal", []]],
      matchColourLsoaPopulation: "rgba(254, 113, 144, 1)",
      matchColourLsoaDeprivation: "rgba(254, 113, 144, 1)",
      lsoasLayerFill: {
        type: "fill",
        filter: ["in", ["get", "code"], ["literal", []]],
        "source-layer": "lsoa_boundaries",
        paint: {
          "fill-color": "rgba(254, 113, 144, 1)",
          "fill-opacity": 0.5
        }
      },
      matchFieldLsoaPopulation: ["to-string", ["get", "code"]],
      matchFieldLsoaDeprivation: ["to-string", ["get", "code"]],
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
      }
    };
  },
  methods: {
    setDisplayOptions: function() {
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
    setLsoaFields: function(lsoas) {
      let filters = [];
      let matchFieldLsoaPopulation = ["match", ["get", "code"]];
      let matchFieldLsoaDeprivation = ["match", ["get", "code"]];

      lsoas.forEach(lsoa => {
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
    },
    addMembershipData: async function() {
      let self = this;
      if (self.lsoaFiles[0].name) {
        const data = await csvHelper.parseFile(self.lsoaFiles[0]);
        this.setLsoaFields(data.slice(1));
        const authority = await libraryAuthoritiesHelper.getLibraryAuthorityByName(
          data[1][0]
        );
        const geojson = JSON.parse(authority.geojson);
        this.authoritySource = { type: "geojson", data: geojson };
        this.authorityLayerLabel.layout["text-field"] = authority.utla19nm;
        var bounds = bbox(geojson);
        this.$refs.mglMap.map.fitBounds(bounds, { padding: 10 });
      }
    }
  },
  components: {
    "custom-header": Header,
    "file-upload": FileUpload,
    MglGeojsonLayer,
    MglMap,
    MglFullscreenControl,
    MglNavigationControl,
    MglVectorLayer
  }
};
</script>

<style>
.main {
  padding: 20px;
}
.mapboxgl-canvas {
  left: 0;
}
#map-container {
  position: relative;
  margin-top: 10px;
  height: 75vh;
  width: 100%;
  border: 1px solid #e5e5e5;
}
#map-container canvas {
  outline: none;
}

@import "~mapbox-gl/dist/mapbox-gl.css";
</style>
