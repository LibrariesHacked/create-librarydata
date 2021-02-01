<template>
  <div>
    <custom-header
      title="Membership visualisation"
      subtitle="Explore library membership data"
    />
    <section>
      <div class="container">
        <div class="columns">
          <div class="column">
            <b-field label="Membership CSV file URL">
              <b-input v-model="membershipUrl" size="is-medium"></b-input>
            </b-field>
            <b-button
              type="is-secondary"
              icon-right="map"
              v-on:click="addMembershipData"
              :disabled="membershipUrl === ''"
              :rounded="true"
              >Show on map</b-button
            >
          </div>
          <div class="column">
            <b-message class="content" type="is-warning">
              <p>
                <b>View library membership data</b>
              </p>
              <ol>
                <li>
                  Enter the full URL of the data you wish to view on library membership
                </li>
                <li>Select show on map to explore the data.</li>
              </ol>
            </b-message>
          </div>
        </div>
        <div id="map-container">
          <MglMap
            container="map-container"
            :center.sync="center"
            :mapStyle="mapStyle"
            :zoom.sync="zoom"
          >
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
            <MglVectorLayer
              v-if="displayLsoas"
              sourceId="lsoa_boundaries"
              :source="lsoasSource"
              layerId="lsoa_boundaries_fill"
              :layer="lsoasLayerFill"
            />
            <MglVectorLayer
              v-if="displayLsoas"
              sourceId="lsoa_boundaries"
              :source="lsoasSource"
              layerId="lsoa_boundaries_line"
              :layer="lsoasLayerLine"
            />
            <MglVectorLayer
              v-if="displayLsoas"
              sourceId="lsoa_boundaries"
              :source="lsoasSource"
              layerId="lsoa_boundaries_label"
              :layer="lsoasLayerLabel"
            />
            <MglNavigationControl position="bottom-right" />
          </MglMap>
        </div>
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

import * as csvHelper from "../helpers/csv";
import * as libraryAuthoritiesHelper from "../helpers/libraryAuthorities";

import {
  MglMap,
  MglNavigationControl,
  MglGeojsonLayer,
  MglVectorLayer
} from "vue-mapbox";

export default {
  data() {
    return {
      mapStyle: "/style.json",
      center: [-2, 52],
      zoom: 6,
      authoritySource: null,
      authorityLayerLine: {
        type: "line",
        paint: {
          "line-color": "#f1efec",
          "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1, 22, 12],
          "line-blur": 1
        }
      },
      authorityLayerLabel: {
        type: "symbol",
        layout: {
          "text-field": ["to-string", ["get", "utla19nm"]],
          "text-font": ["Source Sans Pro Bold"],
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "symbol-placement": "line",
          "text-size": 12,
          "text-line-height": 1
        },
        paint: {
          "text-color": "#6a6f73",
          "text-halo-color": "#f1efec",
          "text-halo-width": 4,
          "text-halo-blur": 2,
          "text-opacity": 1
        }
      },
      membershipUrl: "",
      displayLsoas: false,
      lsoasSource: {
        type: "vector",
        tiles: [config.lsoa_tiles]
      },
      lsoasLayerFill: {
        type: "fill",
        "source-layer": "lsoa_boundaries",
        paint: {
          "fill-color": "rgba(254,113,144,1)"
        }
      },
      lsoasLayerLine: {
        type: "line",
        "source-layer": "lsoa_boundaries",
        paint: {
          "line-color": "rgba(254,113,144,0.8)",
          "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0, 22, 6]
        }
      },
      lsoasLayerLabel: {
        type: "symbol",
        "source-layer": "lsoa_boundaries",
        minzoom: 10,
        layout: {
          "text-field": ["to-string", ["get", "lsoa11cd"]],
          "text-font": ["Source Sans Pro Bold"],
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
          "text-color": "rgba(254,113,144,1)",
          "text-halo-color": "#f1efec",
          "text-halo-width": 1,
          "text-halo-blur": 1,
          "text-opacity": 1
        }
      }
    };
  },
  created() {
    this.mapbox = null;
  },
  methods: {
    onMapLoaded: function(event) {
      this.map = event.map;
    },
    setLsoaLabelField: function(lsoas) {
      let matchField = ["match", ["get", "lsoa11cd"]];
      let matchColour = ["match", ["get", "lsoa11cd"]];
      let filters = [];
      lsoas.forEach(lsoa => {
        const members = parseInt(lsoa[3].replace("x", "2"));
        filters.push(lsoa[2]);
        matchField.push(lsoa[2]);
        matchField.push([
          "concat",
          [
            "to-string",
            ["round", ["*", ["/", members, ["to-number", ["get", "population"]]], 100]]
          ],
          "%"
        ]);
        matchColour.push(lsoa[2]);
        matchColour.push([
          "concat",
          "rgba(245,113,144,",
          ["to-string", ["+", ["/", members, ["to-number", ["get", "population"]]], 0.3]],
          ")"
        ]);
      });
      matchField.push("");
      matchColour.push("rgba(254,113,144,1)");
      let matchFilter = ["in", ["get", "lsoa11cd"], ["literal", filters]];

      this.lsoasLayerFill.filter = matchFilter;
      this.lsoasLayerFill.paint["fill-color"] = matchColour;
      this.lsoasLayerLabel.filter = matchFilter;
      this.lsoasLayerLabel.layout["text-field"] = matchField;
      this.lsoasLayerLine.filter = matchFilter;

      this.displayLsoas = true;
    },
    addMembershipData: async function() {
      const data = await csvHelper.parseUrl(
        "https://cors-anywhere.herokuapp.com/" + this.membershipUrl
      );
      this.setLsoaLabelField(data);
      const authority = await libraryAuthoritiesHelper.getLibraryAuthorityByName(
        data[1][0]
      );
      const geojson = JSON.parse(authority.geojson);
      this.authoritySource = { type: "geojson", data: geojson };
      this.authorityLayerLabel.layout["text-field"] = authority.utla19nm;
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
  margin-top: 10px;
  height: 75vh;
  width: 100%;
}
@import "~mapbox-gl/dist/mapbox-gl.css";
</style>
