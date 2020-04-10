<template>
  <div>
    <h2 class="title">{{device.name}}</h2>
    <p>position : {{device.latitude}},{{device.longitude}}</p>
    <template v-if="device.measurements.length">
      <p>temperature : {{device.measurements[0].temperature}}°C</p>
      <p>humidité : {{device.measurements[0].humidity}}%</p>
      <p>vent : {{device.measurements[0].wind}}km/h</p>
    </template>
    <p v-else>Aucune mesure</p>
  </div>
</template>
<script>
export default {
  name: "DeviceDetails",
  props: {
    device: {
      type: Object,
      required: true
    }
  }
};
</script>