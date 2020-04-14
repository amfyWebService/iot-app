<template>
  <v-container fluid style="height: 100%" class="pa-0">
    <v-row style="height: 100%" no-gutters>
      <v-col cols="4">
        <v-card style="height: 100%">
          <v-card-text>
            <v-text-field
              label="Rechercher un appareil"
              v-model="search"
              hide-details
              append-icon="fa-search"
            ></v-text-field>
            <v-card flat>
              <v-card-text class="pa-0">
                <!-- Device details -->
                <div v-if="selectedDevice" key="detail">
                  <v-toolbar flat>
                    <v-btn icon @click="selectedDevice=undefined">
                      <v-icon>fa-arrow-left</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <device-details v-if="selectedDevice" :device="selectedDevice"></device-details>
                </div>

                <!-- Device list -->
                <device-list
                  v-show="!selectedDevice"
                  key="list"
                  :devices="devices"
                  @click:device="selectedDevice=$event"
                ></device-list>
              </v-card-text>
            </v-card>
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
          >
            <l-tooltip>{{device.name}}</l-tooltip>
          </l-marker>
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
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
  components: { LMap, LTileLayer, LMarker, DeviceList, DeviceDetails, LTooltip },
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
      this.selectedDevice = device;
    }
  },
  watch: {
    selectedDevice(device){
      if(device){
        this.center = device.latLng;
      }
    }
  }
};
</script>