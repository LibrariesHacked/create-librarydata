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
            <b-field label="Libraries CSV file URL">
              <b-input v-model="librariesUrl" size="is-medium"></b-input>
            </b-field>
            <b-button
              type="is-secondary"
              icon-right="map"
              v-on:click="addLayersToMap"
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
              <p>
                This tool displays data that conforms to the
              </p>
              <p>This tool has calculated a count of members per LSOA.</p>
              <ol>
                <li>
                  Enter the full URL (including http/https) of the data you wish to view
                  on library membership
                </li>
                <li>
                  (Optional) Select the date the postcodes were extracted from your
                  database.
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
            <MglVectorLayer
              sourceId="lsoa_boundary"
              :source="lsoasSource"
              layerId="lsoa_boundary"
              :layer="lsoasLayer"
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
      zoom: 12,
      librariesSource: null,
      librariesLayer: {},
      membershipUrl: "",
      librariesUrl: "",
      lsoasSource: {
        type: "vector",
        tiles: ["https://api-geography.librarydata.uk/rest/lsoas/{z}/{x}/{y}.mvt"]
      },
      lsoasLayer: {
        type: "fill",
        "source-layer": "lsoa_tiles",
        paint: {
          "fill-color": "#ffff00"
        }
      }
    };
  },
  created() {
    this.mapbox = null;
  },
  methods: {
    onMapLoaded: event => {
      this.map = event.map;
    },
    addLayersToMap: async () => {}
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
