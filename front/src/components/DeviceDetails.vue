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
        <p>humidité : {{lastMeasurement.humidity}}%</p>
        <p>vent : {{lastMeasurement.wind}}km/h</p>
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
  data(){
    return {
      lastMeasurement: undefined,
    }
  },
  mounted(){
    if(this.device.measurements.length)
      this.lastMeasurement = this.device.measurements[0];
  },
  methods: {
    async refreshDevice(){
      const {data} = await this.$axios.get('/devices/' + this.device._id);
      if(data.measurements.length)
        this.lastMeasurement = data.measurements[0];
    }
  }
};
</script>