<template>
  <v-card class="mx-auto" max-width="400">
    <template v-if="lastMeasurement && average">
      <v-list-item>
        <v-list-item-content>
          <v-row style="z-index:2">
            <v-col>
              <v-list-item-title class="headline">Capteur : {{device.name}}</v-list-item-title>
            </v-col>
            <v-col md="2">
              <v-btn fab dark small color="primary" @click="refreshDevice">
                <v-icon>fa-sync</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row align-self="center">
            <v-col col="6">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue darken-2" v-on="on">mdi-calendar-clock</v-icon>
                  {{date}}
                </template>
                <span>Date</span>
              </v-tooltip>
            </v-col>
            <v-col col="6">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue darken-2" v-on="on">mdi-map-marker</v-icon>
                  {{device.latitude}},{{device.longitude}}
                </template>
                <span>Position</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <v-row align="center">
          <v-col class="display-3" cols="7">
            {{lastMeasurement.temperature}}&deg;C
            <v-tooltip bottom v-if="temperature">
              <template v-slot:activator="{ on }">
                <v-icon large :color="temperature.color" v-on="on">{{temperature.icon}}</v-icon>
              </template>
              <span>{{temperature.text}}</span>
            </v-tooltip>
          </v-col>
          <v-col class="display-3" cols="3">
            <v-img src="../assets/Temperature.png" alt="Sunny image" width="82"></v-img>
          </v-col>
          <v-col cols="2" align-self="center">
            <v-row justify="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue-grey darken-2" v-on="on">mdi-scale-balance</v-icon>
                </template>
                <span>Moyenne</span>
              </v-tooltip>
            </v-row>
            <v-row justify="center">{{average.temperature}}&deg;C</v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-list-item>
        <v-list-item-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon color="blue darken-2" v-on="on">mdi-mother-heart</v-icon>
            </template>
            <span>Température ressentie</span>
          </v-tooltip>
        </v-list-item-icon>
        <v-list-item-subtitle>{{temperatureFelt}}&deg;C</v-list-item-subtitle>
      </v-list-item>
      <v-row>
        <v-col cols="6">
          <v-list-item>
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue darken-2" v-on="on">mdi-weather-windy</v-icon>
                </template>
                <span>Vitesse du vent</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-subtitle>{{lastMeasurement.wind}}km/h</v-list-item-subtitle>
            <v-list-item-icon v-if="windSpeed">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon :color="windSpeed.color" v-on="on">{{windSpeed.icon}}</v-icon>
                </template>
                <span>{{windSpeed.text}}</span>
              </v-tooltip>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue darken-2" v-on="on">mdi-weather-rainy</v-icon>
                </template>
                <span>Taux d'humidité</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-subtitle>{{lastMeasurement.humidity}}%</v-list-item-subtitle>
            <v-list-item-icon v-if="humidityPercent">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon :color="humidityPercent.color" v-on="on">{{humidityPercent.icon}}</v-icon>
                </template>
                <span>{{humidityPercent.text}}</span>
              </v-tooltip>
            </v-list-item-icon>
          </v-list-item>
        </v-col>
        <v-col cols="6">
          <v-list-item>
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue-grey darken-2" v-on="on">mdi-scale-balance</v-icon>
                </template>
                <span>Moyenne</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-subtitle>{{average.wind}}km/h</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon color="blue-grey darken-2" v-on="on">mdi-scale-balance</v-icon>
                </template>
                <span>Moyenne</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-subtitle>{{average.humidity}}%</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>
    <v-alert v-if="windForce" :type="windForce.type">{{windForce.text}}</v-alert>
    </template>
    <p v-else>Aucune mesure</p>
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
      deviceData: undefined,
      lastMeasurement: undefined,
      temperatureFelt: undefined,
      average: undefined,
      date: undefined,
      windForceMap: [
        { minSpeed: 0, text: "Vent faible", type: "info" },
        { minSpeed: 39, text: "Vent léger", type: "info" },
        { minSpeed: 50, text: "Vent modéré", type: "info" },
        { minSpeed: 62, text: "Vent fort", type: "warning" },
        { minSpeed: 75, text: "Rafales de vent", type: "warning" },
        { minSpeed: 89, text: "Tempête", type: "error" }
      ],
      humidityMap: [
        {
          text: "Taux d'humidité supérieur à la moyenne",
          icon: "mdi-arrow-top-right",
          color: "red darken-2"
        },
        {
          text: "Taux d'humidité inférieur à la moyenne",
          icon: "mdi-arrow-bottom-right",
          color: "blue darken-2"
        },
        {
          text: "Taux d'humidité égal à la moyenne",
          icon: "mdi-equal",
          color: "grey darken-2"
        }
      ],
      windMap: [
        {
          text: "Vitesse du vent supérieure à la moyenne",
          icon: "mdi-arrow-top-right",
          color: "red darken-2"
        },
        {
          text: "Vitesse du vent inférieure à la moyenne",
          icon: "mdi-arrow-bottom-right",
          color: "blue darken-2"
        },
        {
          text: "Vitesse du vent égale à la moyenne",
          icon: "mdi-equal",
          color: "grey darken-2"
        }
      ],
      temperatureMap: [
        {
          text: "Température supérieure à la moyenne",
          icon: "mdi-arrow-top-right",
          color: "red darken-2"
        },
        {
          text: "Température inférieure à la moyenne",
          icon: "mdi-arrow-bottom-right",
          color: "blue darken-2"
        },
        {
          text: "Température égale à la moyenne",
          icon: "mdi-equal",
          color: "grey darken-2"
        }
      ]
    };
  },
  methods: {
    async refreshDevice() {
      const { data } = await this.$axios.get("/devices/" + this.device._id);
      this.deviceData = data;
      await Promise.all([this.getAverage(), this.getFeltTemperature()]);
      if (this.deviceData.measurements.length) {
        this.lastMeasurement = this.deviceData.measurements[0];
        this.date = new Date(this.lastMeasurement.date).toLocaleString();
      }
    },
    async getFeltTemperature() {
      const { data } = await this.$axios.get(
        `/devices/${this.deviceData._id}/felt-temperature`
      );
      data.felt
        ? (this.temperatureFelt = Math.round(10 * data.felt) / 10)
        : (this.temperatureFelt = 0);
    },
    async getAverage() {
      const { data } = await this.$axios.get(
        `/devices/${this.deviceData._id}/average`
      );
      this.average = data;
      if (this.average.temperature) {
        this.average.temperature = Math.round(this.average.temperature);
      }
    }
  },
  watch: {
    device: {
      immediate: true,
      handler() {
        this.refreshDevice();
      }
    }
  },
  computed: {
    windForce() {
      let windForce;
      for (let item of this.windForceMap) {
        if (this.lastMeasurement?.wind > item.minSpeed) {
          windForce = item;
        } else {
          break;
        }
      }
      return windForce;
    },
    humidityPercent() {
      if (this.lastMeasurement?.humidity > this.average.humidity) {
        return this.humidityMap[0];
      }
      if (this.lastMeasurement?.humidity < this.average.humidity) {
        return this.humidityMap[1];
      } 
        return this.humidityMap[2];
    },
    windSpeed() {
      if (this.lastMeasurement?.wind > this.average.wind) {
        return this.windMap[0];
      }
      if (this.lastMeasurement?.wind < this.average.wind) {
        return this.windMap[1];
      }
      return this.windMap[2];
    },
    temperature() {
      if (this.lastMeasurement?.temperature > this.average.temperature) {
        return this.temperatureMap[0];
      }
      if (this.lastMeasurement?.temperature < this.average.temperature) {
        return this.temperatureMap[1];
      }
      return this.temperatureMap[2];
    }
  }
};
</script>