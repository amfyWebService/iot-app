<template>
  <v-list>
    <v-subheader class="title">Liste des appareils</v-subheader>
    <!-- <v-skeleton-loader
            :loading="loadingDevices"
            transition="scale"
            height="94"
            type="list-item-two-line"
    >-->
    <v-list-item v-for="device in devices" :key="device.id" @click="$emit('click:device', device)">{{device.name}}</v-list-item>
    <v-list-item v-if="!devices.length">Aucun appareil</v-list-item>
    <!-- </v-skeleton-loader> -->
  </v-list>
</template>

<script>
export default {
    name: "DeviceList",
    props: {
        devices: {
            type: Array,
            default(){
                return []
            }
        }
    }
}
</script>