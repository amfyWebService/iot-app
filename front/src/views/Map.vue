<template>
  <v-container fluid style="height: 100%" class="pa-0">
    <v-row style="height: 100%" no-gutters>
      <v-col cols="3" class="px-2">
        <v-text-field label="Rechercher un appareil" v-model="search" hide-detail append-icon="fa-search"></v-text-field>
        <v-list>
          <v-subheader class="title">Liste des appareils</v-subheader>
          <v-skeleton-loader
            :loading="loadingDevices"
            transition="scale"
            height="94"
            type="list-item-two-line"
          >
            <v-list-item v-for="device in devices" :key="device.id"></v-list-item>
            <v-list-item v-if="!devices.length">Aucun appareil</v-list-item>
          </v-skeleton-loader>
        </v-list>
      </v-col>
      <v-col>
        <transition name="scale">
          <l-map style="height: 100%" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          </l-map>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
export default {
  name: "Map",
  components: { LMap, LTileLayer },
  data() {
    return {
      zoom: 13,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      center: L.latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: false,
      devices: [],
      loadingDevices: false,
      search: ""
    };
  },
  mounted(){
    setTimeout(() => this.showMap = true, 2000)
  },
  methods: {
    async getDevices() {
      this.loadingDevices = true;
      const { data } = await this.$axios.get("/devices");
      this.devices = data;
      this.loadingDevices = false;
    }
  },
};
</script>