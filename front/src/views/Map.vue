<template>
    <v-container fluid>
        <l-map style="height: 100%" :zoom="zoom">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        </l-map>
    </v-container>
</template>
<script>
import { LMap, LTileLayer } from 'vue2-leaflet';
export default {
    name: "Map",
    components: {LMap, LTileLayer},
    data() {
    return {
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
    };
  },
}
</script>