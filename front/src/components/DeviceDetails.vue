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
        <v-alert v-if="windForce" :type="windForce.type">{{windForce.text}}</v-alert>
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
      windForceMap: [
        {minSpeed: 0, text: "Le vent est normal", type: "info"},
        {minSpeed: 39, text: "Vent un peu fort", type: "info"},
        {minSpeed: 75, text: "Fort coup de vent", type: "warning"},
        {minSpeed: 89, text: "Tempête", type: "error"},
      ],
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
      data.felt ? this.temperatureFelt = Math.round(10*data.felt)/10 : this.temperatureFelt = 0;
    }
  },
  computed: {
    windForce(){
      let windForce;
      for(let item of this.windForceMap){
        if(this.lastMeasurement.wind > item.minSpeed){
          windForce = item;
        } else {
          break;
        }
      }
      return windForce;
    }
  }
};
</script>