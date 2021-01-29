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
            v-on:click="setLsoaLabelField"
          >
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
              layerId="lsoa_boundaries_label"
              :layer="lsoasLayerLabel"
            />
            <MglGeojsonLayer
              v-if="librariesSource"
              :sourceId="librariesSource.id"
              :source="librariesSource"
              layerId="myLayer"
              :layer="librariesLayer"
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
      librariesSource: null,
      librariesLayer: {},
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
          "fill-color": "#e5e5e5",
          "fill-opacity": 0.5,
          "fill-outline-color": "#cccccc"
        }
      },
      lsoasLayerLabel: {
        type: "symbol",
        "source-layer": "lsoa_boundaries",
        layout: {
          "text-field": ["to-string", ["get", "lsoa11cd"]],
          "text-font": ["Source Sans Pro Bold"],
          "symbol-placement": "point",
          "text-size": 16,
          "text-allow-overlap": false,
          "text-line-height": 1
        },
        paint: {
          "text-color": "#55595c",
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
      let filters = [];
      lsoas.forEach(lsoa => {
        filters.push(lsoa[2]);
        matchField.push(lsoa[2]);
        matchField.push(lsoa[3].replace("x", "<5"));
      });
      matchField.push("");
      let matchFilter = ["in", ["get", "lsoa11cd"], ["literal", filters]];

      this.lsoasLayerFill.filter = matchFilter;
      this.lsoasLayerLabel.filter = matchFilter;
      this.lsoasLayerLabel.layout = {
        ...this.lsoasLayerLabel.layout,
        "text-field": matchField
      };

      this.displayLsoas = true;
    },
    addMembershipData: async function() {
      const data = await csvHelper.parseUrl(
        "https://cors-anywhere.herokuapp.com/" + this.membershipUrl
      );
      this.setLsoaLabelField(data);
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
