<template>
  <div>
    <custom-header title="Membership map" subtitle="Explore library membership data" />
    <section>
      <div class="container">
        <b-message class="content is-medium" type="is-warning">
          <p>
            <b>Viewing library membership data</b>
          </p>
          You need library membership data in the
          <a href="https://schema.librarydata.uk/membership" target="_blank"
            >membership data schema format</a
          >. This can be created using the
          <a href="/postcode-to-lsoa" target="_blank">postcode to LSOA converter</a>.
        </b-message>
        <div class="columns">
          <div class="column">
            <b-field class="file">
              <b-upload v-model="lsoaFile" expanded>
                <a class="button is-primary is-fullwidth is-medium">
                  <b-icon icon="upload"></b-icon>
                  <span>{{ lsoaFile.name || "Click to load file" }}</span>
                </a>
              </b-upload>
            </b-field>
            <b-button
              :disabled="!lsoaFile.name"
              size="is-medium"
              type="is-secondary"
              icon-right="account-multiple-plus"
              v-on:click="addMembershipData"
              >Add members to map</b-button
            >
          </div>
          <div class="column">
            <b-message class="content is-medium" type="is-info">
              <p>
                <b>Display options</b>
              </p>
              <ul>
                <li><b>Population percentage</b>. This shades the map to highlight concentration of members, relative to population. At higher zoom levels in also displays the membership population percentage.</li>
                <li><b>Areas of deprivation</b>. This used the index of multiple deprivation for each area. 1 represents highly deprived areas, 10 the least deprived areas. Highly deprived areas are shaded in darker shades.</li>
              </ul>
            </b-message>
          </div>
        </div>
        <b-field>
          <b-radio
            v-model="mapDisplay"
            size="is-medium"
            native-value="populationPercentage"
            v-on:input="setDisplayOptions"
          >
            Display population percentage
          </b-radio>
          <b-radio
            v-model="mapDisplay"
            size="is-medium"
            native-value="imd"
            v-on:input="setDisplayOptions"
          >
            Display areas of deprivation
          </b-radio>
        </b-field>
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
      </div>
      <custom-footer />
    </section>
  </div>
</template>

<script>
import "../extensions/strings";

import Footer from "../components/Footer";
import Header from "../components/Header";

const config = require("../helpers/config.json");

import * as colorbrewer from "colorbrewer";

import bbox from "@turf/bbox";

import * as csvHelper from "../helpers/csv";
import * as libraryAuthoritiesHelper from "../helpers/libraryAuthorities";

import {
  MglMap,
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
          "line-color": "#763F45",
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
          "text-color": "#763F45",
          "text-halo-color": "#fafaf8",
          "text-halo-width": 2
        }
      },
      lsoaFile: {},
      lsoasSource: {
        type: "vector",
        tiles: [config.lsoa_tiles],
        promoteId: { lsoa_boundaries: "lsoa11cd" }
      },
      matchFilter: ["in", ["get", "lsoa11cd"], ["literal", []]],
      matchColourLsoaPopulation: "rgba(254, 113, 144, 1)",
      matchColourLsoaDeprivation: "rgba(254, 113, 144, 1)",
      lsoasLayerFill: {
        type: "fill",
        filter: ["in", ["get", "lsoa11cd"], ["literal", []]],
        "source-layer": "lsoa_boundaries",
        paint: {
          "fill-color": "rgba(254, 113, 144, 1)",
          "fill-opacity": 0.5
        }
      },
      matchFieldLsoaPopulation: ["to-string", ["get", "lsoa11cd"]],
      matchFieldLsoaDeprivation: ["to-string", ["get", "lsoa11cd"]],
      lsoasLayerLabel: {
        type: "symbol",
        filter: ["in", ["get", "lsoa11cd"], ["literal", []]],
        "source-layer": "lsoa_boundaries",
        minzoom: 12,
        layout: {
          "text-field": ["to-string", ["get", "lsoa11cd"]],
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
          "text-color": "#763F45",
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
      let matchFieldLsoaPopulation = ["match", ["get", "lsoa11cd"]];
      let matchFieldLsoaDeprivation = ["match", ["get", "lsoa11cd"]];

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
        colorbrewer.OrRd[9][0],
        5,
        colorbrewer.OrRd[9][1],
        10,
        colorbrewer.OrRd[9][2],
        15,
        colorbrewer.OrRd[9][3],
        20,
        colorbrewer.OrRd[9][4],
        25,
        colorbrewer.OrRd[9][5],
        30,
        colorbrewer.OrRd[9][6],
        35,
        colorbrewer.OrRd[9][7],
        40,
        colorbrewer.OrRd[9][8]
      ];
      let matchColourLsoaDeprivation = [
        "interpolate",
        ["linear"],
        ["to-number", ["get", "imd"]],
        1,
        colorbrewer.OrRd[9][8],
        2,
        colorbrewer.OrRd[9][7],
        3,
        colorbrewer.OrRd[9][6],
        4,
        colorbrewer.OrRd[9][5],
        5,
        colorbrewer.OrRd[9][4],
        6,
        colorbrewer.OrRd[9][3],
        7,
        colorbrewer.OrRd[9][2],
        8,
        colorbrewer.OrRd[9][1],
        9,
        colorbrewer.OrRd[9][0],
        10,
        colorbrewer.OrRd[9][0]
      ];

      // Only show where lsoas exist in data
      let matchFilter = ["in", ["get", "lsoa11cd"], ["literal", filters]];
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
      if (self.lsoaFile.name) {
        const data = await csvHelper.parseFile(self.lsoaFile);
        this.setLsoaFields(data);
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
    "custom-footer": Footer,
    "custom-header": Header,
    MglGeojsonLayer,
    MglMap,
    MglNavigationControl,
    MglVectorLayer
  }
};
</script>

<style>
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
