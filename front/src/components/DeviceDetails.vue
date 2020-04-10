<template>
  <v-card flat>
    <v-card-title>
      <span v-text="device.name"></span>
      <v-spacer></v-spacer>
      <v-btn icon @click="refreshDevice">
        <v-icon>fa-sync</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <p>position : {{device.latitude}},{{device.longitude}}</p>
      <template v-if="lastMeasurement">
        <p>temperature : {{lastMeasurement.temperature}}°C</p>
        <p>ressenti: {{temperatureFelt}}°C</p>
        <p>humidité : {{lastMeasurement.humidity}}%</p>
        <p>vent : {{lastMeasurement.wind}}km/h</p>
        <v-alert v-if="isStrongBreeze()" type="info">Vent un peu fort</v-alert>
        <v-alert v-else-if="isStrongGale()" type="warning">Fort coup de vent</v-alert>
        <v-alert v-else-if="isStorm()" type="error">Tempête</v-alert>
        <v-alert v-else type="info">Le vent est normal</v-alert>
      </template>
      <p v-else>Aucune mesure</p>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "DeviceDetails",
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      lastMeasurement: undefined,
      temperatureFelt: undefined,
      isStrongBreeze: () => this.lastMeasurement.wind >= 39 && this.lastMeasurement.wind <= 74,
      isStrongGale: () => this.lastMeasurement.wind >= 75 && this.lastMeasurement.wind <= 88,
      isStorm: () => this.lastMeasurement.wind >= 89
    };
  },
  mounted() {
    if (this.device.measurements.length) this.lastMeasurement = this.device.measurements[0];
    this.getFeltTemperature();
  },
  methods: {
    async refreshDevice() {
      const { data } = await this.$axios.get("/devices/" + this.device._id);
      if (data.measurements.length) this.lastMeasurement = data.measurements[0];
    },
    async getFeltTemperature() {
      const { data } = await this.$axios.get(`/devices/${this.device._id}/felt-temperature`);
      if(data.felt) this.temperatureFelt = Math.round(10*data.felt)/10;
    }
  }
};
</script>