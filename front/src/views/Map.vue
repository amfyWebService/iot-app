<template>
  <v-container fluid style="height: 100%" class="pa-0">
    <v-row style="height: 100%" no-gutters>
      <v-col cols="3" class="px-2">
        <v-text-field
          label="Rechercher un appareil"
          v-model="search"
          hide-detail
          append-icon="fa-search"
        ></v-text-field>
        <v-card flat>
          <v-card-text>
            <device-list
              :devices="devices"
              v-show="!selectedDevice"
              @click:device="selectedDevice=$event"
            ></device-list>
            <div v-if="selectedDevice">
              <v-toolbar flat>
                <v-btn icon @click="selectedDevice=undefined">
                  <v-icon>fa-arrow-left</v-icon>
                </v-btn>
              </v-toolbar>
              <device-details v-if="selectedDevice" :device="selectedDevice"></device-details>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <l-map style="height: 100%" :zoom="zoom" :center="center" :bounds="bounds">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            v-for="device in devices"
            :key="device.id"
            :lat-lng="device.latLng"
            @click="onClickMarker(device)"
          ></l-marker>
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import DeviceList from "@/components/DeviceList";
import DeviceDetails from "@/components/DeviceDetails";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "Map",
  components: { LMap, LTileLayer, LMarker, DeviceList, DeviceDetails },
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
      devices: [],
      loadingDevices: false,
      search: "",
      bounds: undefined,
      selectedDevice: undefined
    };
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    async getDevices() {
      this.loadingDevices = true;
      const { data } = await this.$axios.get("/devices");
      for (const device of data) {
        device.latLng = L.latLng(device.latitude, device.longitude);
      }
      this.devices = data;

      this.bounds = L.latLngBounds(this.devices.map(value => value.latLng));

      this.loadingDevices = false;
    },
    onClickMarker(device) {
      console.log(device);
    }
  }
};
</script>