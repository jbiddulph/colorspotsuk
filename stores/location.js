// stores/location.js or stores/location.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLocationStore = defineStore('location-store', () => {
  const latitude = ref(null);
  const longitude = ref(null);

  const setLocation = (lat, lng) => {
    latitude.value = lat;
    longitude.value = lng;
  };

  return {
    latitude,
    longitude,
    setLocation
  };
});